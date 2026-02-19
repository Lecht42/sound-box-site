import http from "node:http"
import { createReadStream, existsSync, promises as fs, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, "..")

const dataPaths = {
  blog: path.join(root, "src/assets/data-src/blog/blog.ts"),
  services: path.join(root, "src/assets/data-src/services/services.ts"),
  faq: path.join(root, "src/assets/data-src/faq/faq.ts"),
}

const mdDirs = {
  blog: path.join(root, "src/assets/data-src/blog/content"),
  services: path.join(root, "src/assets/data-src/services/content"),
}

const uploadDirs = {
  blog: path.join(root, "src/assets/imgs-src/blog"),
  services: path.join(root, "src/assets/imgs-src/services"),
}

// ----- Font Awesome (works with or without node_modules) -----
const faBaseDir = path.join(root, "node_modules/@fortawesome/fontawesome-free")
const faMetaPath = path.join(faBaseDir, "metadata/icons.json")
const faCssPath = path.join(faBaseDir, "css/all.min.css")
const faHasLocal = existsSync(faCssPath)

const FA_FALLBACK_ICONS = [
  // solid
  "fa-solid fa-volume-high",
  "fa-solid fa-microphone",
  "fa-solid fa-wand-magic-sparkles",
  "fa-solid fa-video",
  "fa-solid fa-music",
  "fa-solid fa-headphones",
  "fa-solid fa-radio",
  "fa-solid fa-sliders",
  "fa-solid fa-compact-disc",
  "fa-solid fa-bolt",
  "fa-solid fa-sparkles",
  "fa-solid fa-star",
  "fa-solid fa-play",
  "fa-solid fa-pause",
  "fa-solid fa-stop",
  "fa-solid fa-circle-info",
  "fa-solid fa-circle-check",
  "fa-solid fa-triangle-exclamation",
  "fa-solid fa-tag",
  "fa-solid fa-bullhorn",
  "fa-solid fa-chart-line",
  "fa-solid fa-camera",
  "fa-solid fa-image",
  "fa-solid fa-file-audio",
  "fa-solid fa-file-video",
  "fa-solid fa-gear",
  "fa-solid fa-pen",
  "fa-solid fa-trash",
  "fa-solid fa-plus",
  "fa-solid fa-magnifying-glass",
  "fa-solid fa-link",
  // regular
  "fa-regular fa-lightbulb",
  "fa-regular fa-circle-question",
  "fa-regular fa-image",
  // brands
  "fa-brands fa-instagram",
  "fa-brands fa-youtube",
  "fa-brands fa-tiktok",
  "fa-brands fa-telegram",
  "fa-brands fa-vk",
]

const faIconOptions = (() => {
  try {
    if (!existsSync(faMetaPath)) return []
    const meta = JSON.parse(readFileSync(faMetaPath, "utf-8"))
    const stylesMap = { solid: "fa-solid", regular: "fa-regular", brands: "fa-brands" }
    const icons = []
    for (const [name, data] of Object.entries(meta)) {
      const styles = Array.isArray(data.styles) ? data.styles : []
      styles.forEach((style) => {
        const prefix = stylesMap[style] || "fa-solid"
        icons.push(`${prefix} fa-${name}`)
      })
    }
    return icons.sort()
  } catch {
    return []
  }
})()

const readBody = async (req) =>
  new Promise((resolve, reject) => {
    const chunks = []
    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => resolve(Buffer.concat(chunks)))
    req.on("error", reject)
  })

const sendJson = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" })
  res.end(JSON.stringify(data))
}

const sendText = (res, status, data, contentType = "text/html; charset=utf-8") => {
  res.writeHead(status, { "Content-Type": contentType })
  res.end(data)
}

/**
 * Robust parser:
 * supports patterns:
 * 1) const x = [ ... ] export default x
 * 2) export default [ ... ]
 * 3) export const x = [ ... ]
 * 4) const x: Type[] = [ ... ] ; export default x
 */
const parseArrayFromTs = (source) => {
  const s = source

  // A) export default [ ... ]
  {
    const m = s.match(/export\s+default\s+(\[[\s\S]*?\])\s*;?/m)
    if (m?.[1]) {
      try {
        // eslint-disable-next-line no-new-func
        return new Function(`return ${m[1]};`)()
      } catch {}
    }
  }

  // B) export const name = [ ... ]
  {
    const m = s.match(/export\s+const\s+\w+\s*(?::[^=]+)?=\s*(\[[\s\S]*?\])\s*;?/m)
    if (m?.[1]) {
      try {
        // eslint-disable-next-line no-new-func
        return new Function(`return ${m[1]};`)()
      } catch {}
    }
  }

  // C) const name = [ ... ] ... export default name
  {
    const m = s.match(/const\s+\w+\s*(?::[^=]+)?=\s*(\[[\s\S]*?\])\s*[\s\S]*?export\s+default/m)
    if (m?.[1]) {
      try {
        // eslint-disable-next-line no-new-func
        return new Function(`return ${m[1]};`)()
      } catch {}
    }
  }

  // D) fallback: from first '[' after first 'const ' up to last ']' before 'export default'
  const exportIdx = s.lastIndexOf("export default")
  const startIdx = s.indexOf("const ")
  if (exportIdx !== -1 && startIdx !== -1) {
    const openIdx = s.indexOf("[", startIdx)
    const closeIdx = s.lastIndexOf("]", exportIdx)
    if (openIdx !== -1 && closeIdx !== -1 && closeIdx > openIdx) {
      const literal = s.slice(openIdx, closeIdx + 1)
      try {
        // eslint-disable-next-line no-new-func
        return new Function(`return ${literal};`)()
      } catch {}
    }
  }

  return []
}

const toTsString = (value) => `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`

const writeBlogTs = async (items) => {
  const body = items
    .map(
      (item) => `  {
    id: ${toTsString(item.id)},
    title: ${toTsString(item.title)},
    image: ${toTsString(item.image)},
    contentKey: ${toTsString(item.contentKey)},
    description: ${toTsString(item.description)},
    date: ${toTsString(item.date)},
  }`,
    )
    .join(",\n")
  const content = `export type NewsItem = {
  id: string
  title: string
  image: string
  contentKey: string
  description: string
  date: string
}

const news: NewsItem[] = [
${body}
]

export default news
`
  await fs.writeFile(dataPaths.blog, content, "utf-8")
}

const writeServicesTs = async (items) => {
  const body = items
    .map(
      (item) => `  {
    id: ${toTsString(item.id)},
    title: ${toTsString(item.title)},
    image: ${toTsString(item.image)},
    icon: ${toTsString(item.icon)},
    contentKey: ${toTsString(item.contentKey)},
    active: ${item.active ? "true" : "false"},
  }`,
    )
    .join(",\n")
  const content = `export type ServiceItem = {
  id: string
  title: string
  image: string
  icon: string
  contentKey: string
  active?: boolean
}

const services: ServiceItem[] = [
${body}
]

export default services
`
  await fs.writeFile(dataPaths.services, content, "utf-8")
}

const writeFaqTs = async (items) => {
  const body = items
    .map(
      (item) => `  {
    question: ${toTsString(item.question)},
    answer: ${toTsString(item.answer)},
  }`,
    )
    .join(",\n")
  const content = `export type FaqItem = {
  question: string
  answer: string
}

const faq: FaqItem[] = [
${body}
]

export default faq
`
  await fs.writeFile(dataPaths.faq, content, "utf-8")
}

const writeData = async (type, items) => {
  if (type === "blog") return writeBlogTs(items)
  if (type === "services") return writeServicesTs(items)
  if (type === "faq") return writeFaqTs(items)
}

const readData = async (type) => {
  const source = await fs.readFile(dataPaths[type], "utf-8")
  return parseArrayFromTs(source)
}

const readMd = async (type, key) => {
  const filePath = path.join(mdDirs[type], `${key}.md`)
  try {
    return await fs.readFile(filePath, "utf-8")
  } catch {
    return ""
  }
}

const writeMd = async (type, key, content) => {
  const filePath = path.join(mdDirs[type], `${key}.md`)
  await fs.writeFile(filePath, content, "utf-8")
}

const parseMultipart = (buffer, boundary) => {
  const parts = buffer
    .toString("binary")
    .split(`--${boundary}`)
    .filter((part) => part && part !== "--\r\n")

  const files = []
  const fields = {}
  for (const part of parts) {
    const [rawHeaders, rawBody] = part.split("\r\n\r\n")
    if (!rawHeaders || !rawBody) continue
    const headers = rawHeaders.split("\r\n").filter(Boolean)
    const disposition = headers.find((h) => h.toLowerCase().startsWith("content-disposition"))
    if (!disposition) continue
    const nameMatch = disposition.match(/name="([^"]+)"/)
    const filenameMatch = disposition.match(/filename="([^"]+)"/)
    const name = nameMatch?.[1]
    const body = rawBody.slice(0, -2)
    if (filenameMatch) {
      files.push({ name, filename: filenameMatch[1], content: Buffer.from(body, "binary") })
    } else if (name) {
      fields[name] = body
    }
  }
  return { files, fields }
}

const listImages = async (type) => {
  if (!["blog", "services"].includes(type)) return []
  try {
    const files = await fs.readdir(uploadDirs[type])
    return files.filter((name) => !name.startsWith("."))
  } catch {
    return []
  }
}

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost")

  // local FA files (only if present)
  if (faHasLocal && req.method === "GET" && (url.pathname.startsWith("/fa/") || url.pathname.startsWith("/webfonts/"))) {
    const rel = url.pathname.startsWith("/webfonts/")
      ? url.pathname.replace(/^\/webfonts\//, "webfonts/")
      : url.pathname.replace(/^\/fa\//, "")
    const filePath = rel === "all.min.css" ? faCssPath : path.join(faBaseDir, rel)
    if (!filePath.startsWith(faBaseDir) || !existsSync(filePath)) {
      res.writeHead(404)
      return res.end("Not found")
    }
    const ext = path.extname(filePath).toLowerCase()
    const typeMap = {
      ".css": "text/css; charset=utf-8",
      ".woff2": "font/woff2",
      ".woff": "font/woff",
      ".ttf": "font/ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".svg": "image/svg+xml",
    }
    res.writeHead(200, { "Content-Type": typeMap[ext] || "application/octet-stream" })
    return createReadStream(filePath).pipe(res)
  }

  if (req.method === "GET" && url.pathname === "/") {
    const iconList = faIconOptions.length ? faIconOptions : FA_FALLBACK_ICONS
    const cssLink = faHasLocal
      ? `<link rel="stylesheet" href="/fa/all.min.css">`
      : `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">`

    return sendText(
      res,
      200,
      `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>SoundBOX Admin</title>
  <style>
    body{font-family:Arial, sans-serif;background:#0e0f12;color:#fff;margin:0}
    header{background:#16181f;padding:16px;border-bottom:1px solid #f4d508}
    main{display:grid;grid-template-columns:280px 1fr;gap:16px;padding:16px}
    .panel{background:#16181f;border:1px solid #2a2e37;border-radius:8px;padding:12px}
    button,input,textarea,select{width:100%;margin:6px 0;padding:8px;border-radius:6px;border:1px solid #2a2e37;background:#0e0f12;color:#fff}
    button{background:#f4d508;color:#000;font-weight:600;cursor:pointer}
    .list button{background:#0e0f12;color:#fff;text-align:left}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .muted{color:#9aa0a6;font-size:12px}
    .status{padding:8px;border-radius:6px;margin:8px 0;display:none}
    .status.ok{display:block;background:#1f2a1f;color:#9ef39e;border:1px solid #2f4a2f}
    .status.err{display:block;background:#2a1f1f;color:#f39e9e;border:1px solid #4a2f2f}
    .icon-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px;max-height:260px;overflow:auto;border:1px solid #2a2e37;border-radius:6px;padding:6px;background:#0e0f12}
    .icon-item{display:flex;align-items:center;gap:8px;padding:6px;border-radius:6px;border:1px solid transparent;background:#11131a;cursor:pointer}
    .icon-item:hover{border-color:#f4d508}
    .icon-item.active{border-color:#f4d508;background:#1a1e29}
    .icon-preview{display:flex;align-items:center;gap:10px;min-height:36px;border:1px solid #2a2e37;border-radius:6px;padding:6px;background:#0e0f12}
    .help{font-size:12px;color:#9aa0a6;line-height:1.35}
  </style>
  ${cssLink}
</head>
<body>
  <header>
    <h1>Админка контента SoundBOX</h1>
    <div class="muted">Редактирование blog/services/faq и md-файлов</div>
  </header>
  <main>
    <section class="panel">
      <label>Раздел</label>
      <select id="typeSelect">
        <option value="blog">Блог</option>
        <option value="services">Услуги</option>
        <option value="faq">FAQ</option>
      </select>
      <button id="newBtn">Создать новый</button>
      <div class="list" id="list"></div>
    </section>
    <section class="panel">
      <div id="form"></div>
      <div id="status" class="status"></div>
    </section>
  </main>
  <script>
    const api = (path, options) => fetch(path, options).then(r => r.json());
    const statusEl = document.getElementById('status');
    const showStatus = (text, ok = true) => {
      statusEl.textContent = text;
      statusEl.className = 'status ' + (ok ? 'ok' : 'err');
      setTimeout(() => { statusEl.className = 'status'; }, 2500);
    };
    const typeSelect = document.getElementById('typeSelect');
    const listEl = document.getElementById('list');
    const formEl = document.getElementById('form');

    let currentType = 'blog';
    let currentItem = null;

    const iconOptionsAll = ${JSON.stringify(iconList)};
    const slugify = (value) =>
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const renderList = (items) => {
      listEl.innerHTML = '';
      items.forEach(item => {
        const btn = document.createElement('button');
        btn.textContent = item.title || item.question || item.id;
        btn.onclick = () => openItem(item);
        listEl.appendChild(btn);
      });
    };

    const loadList = async () => {
      const items = await api('/api/list?type=' + currentType);
      renderList(items);
    };

    const openItem = async (item) => {
      currentItem = item;

      if (currentType === 'faq') {
        formEl.innerHTML = \`
          <label>Вопрос</label>
          <input id="q" value="\${item.question || ''}" />
          <label>Ответ</label>
          <textarea id="a" rows="6">\${item.answer || ''}</textarea>
          <button id="saveBtn">Сохранить</button>
          <button id="deleteBtn">Удалить</button>
        \`;
        document.getElementById('saveBtn').onclick = saveFaq;
        document.getElementById('deleteBtn').onclick = deleteItem;
        return;
      }

      const mdKey = item.contentKey || item.id;
      let mdContent = '';
      if (mdKey) {
        const md = await api('/api/md?type=' + currentType + '&key=' + mdKey);
        mdContent = md.content || '';
      }

      // images list: blog only
      let images = { items: [] };
      if (currentType === 'blog') {
        images = await api('/api/images?type=blog');
      }

      const imageOptions = (images.items || []).map(name =>
        '<option value="' + name + '"' + (name === (item.image || '') ? ' selected' : '') + '>' + name + '</option>'
      ).join('');
      const imageField = currentType === 'blog'
        ? '<select id="image"><option value="">— выбрать —</option>' + imageOptions + '</select>'
        : '<input id="image" value="' + (item.image || '') + '" placeholder="URL или путь к изображению" />';

      const iconPicker = currentType === 'services'
        ? \`
          <div class="help">
            Можно выбрать из списка ниже, или вручную вписать классы (пример: <code>fa-solid fa-microphone</code>).
          </div>
          <div class="row">
            <input id="iconSearch" placeholder="Поиск иконки" />
            <div id="iconPreview" class="icon-preview"></div>
          </div>
          <input id="iconManual" placeholder="Или введи вручную (fa-solid fa-...)" value="\${item.icon || ''}" />
          <div id="iconList" class="icon-list"></div>
          <input id="icon" type="hidden" value="\${item.icon || iconOptionsAll[0] || ''}" />
        \`
        : '<input id="icon" value="' + (item.icon || '') + '" />';

      formEl.innerHTML = \`
        <div class="row">
          <div>
            <label>ID</label>
            <input id="id" value="\${item.id || ''}" />
          </div>
          <div>
            <label>Content key</label>
            <input id="contentKey" value="\${item.contentKey || item.id || ''}" />
          </div>
        </div>

        <label>Название</label>
        <input id="title" value="\${item.title || ''}" />

        \${currentType === 'blog'
          ? \`
        <label>Описание (для блога)</label>
        <textarea id="description" rows="3">\${item.description || ''}</textarea>

        <div class="row">
          <div>
            <label>Дата (для блога)</label>
            <input id="date" value="\${item.date || ''}" />
          </div>
          <div>
            <label>Изображение (файл)</label>
            \${imageField}
          </div>
        </div>
          \`
          : ''
        }

        <div class="row">
          <div>
            <label>Иконка (Font Awesome)</label>
            \${iconPicker}
          </div>
          <div>
            <label>Активен</label>
            <select id="active">
              <option value="true">Да</option>
              <option value="false">Нет</option>
            </select>
          </div>
        </div>

        <label>MD файл</label>
        <textarea id="md" rows="10">\${mdContent}</textarea>

        <label>Загрузить картинку(и) (добавятся в md)</label>
        <input id="file" type="file" multiple />

        <button id="saveBtn">Сохранить</button>
        <button id="deleteBtn">Удалить</button>
      \`;

      document.getElementById('active').value = (item.active ?? true).toString();
      document.getElementById('saveBtn').onclick = saveItem;
      document.getElementById('deleteBtn').onclick = deleteItem;
      document.getElementById('file').onchange = uploadImage;

      if (currentType === 'services') initIconPicker(item.icon || iconOptionsAll[0] || '');
    };

    const initIconPicker = (selected) => {
      const input = document.getElementById('icon');
      const manual = document.getElementById('iconManual');
      const list = document.getElementById('iconList');
      const search = document.getElementById('iconSearch');
      const preview = document.getElementById('iconPreview');

      const setValue = (value) => {
        input.value = value || '';
        if (manual && manual.value !== input.value) manual.value = input.value;
        preview.innerHTML = input.value
          ? '<i class="' + input.value + '"></i><span>' + input.value + '</span>'
          : '<span class="muted">РРєРѕРЅРєР° РЅРµ РІС‹Р±СЂР°РЅР°</span>';
        render();
      };

      const render = () => {
        const q = (search.value || '').toLowerCase().trim();
        const base = iconOptionsAll.length ? iconOptionsAll : [];
        // РµСЃР»Рё РЅРµС‚ РїРѕР»РЅРѕРіРѕ РєР°С‚Р°Р»РѕРіР° вЂ” РїРѕРєР°Р·С‹РІР°РµРј fallback Рё С‚Рѕ, С‡С‚Рѕ РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ РІРІС‘Р»
        const candidates = base.length ? base : ${JSON.stringify(FA_FALLBACK_ICONS)};

        const items = candidates
          .filter((name) => !q || name.toLowerCase().includes(q))
          .slice(0, 600);

        list.innerHTML = items.map((name) => {
          const active = name === input.value ? ' active' : '';
          return '<div class="icon-item' + active + '" data-value="' + name + '">' +
                   '<i class="' + name + '"></i>' +
                   '<span>' + name + '</span>' +
                 '</div>';
        }).join('');

        list.querySelectorAll('.icon-item').forEach((el) => {
          el.onclick = () => setValue(el.getAttribute('data-value'));
        });
      };

      search.oninput = render;

      manual.oninput = () => {
        // СЂСѓС‡РЅРѕР№ РІРІРѕРґ СЃ live preview Рё Р±РµР· РЅРµРѕР±С…РѕРґРёРјРѕСЃС‚Рё Р±С‹С‚СЊ РІ СЃРїРёСЃРєРµ
        const v = manual.value.trim();
        input.value = v;
        preview.innerHTML = v
          ? '<i class="' + v + '"></i><span>' + v + '</span>'
          : '<span class="muted">РРєРѕРЅРєР° РЅРµ РІС‹Р±СЂР°РЅР°</span>';
      };

      setValue(selected);
    };

    const saveFaq = async () => {
      const question = document.getElementById('q').value.trim();
      const answer = document.getElementById('a').value.trim();
      await api('/api/save-item', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ type: 'faq', item: { question, answer }, prev: currentItem?.question || null })
      });
      showStatus('Сохранено');
      loadList();
    };

    const saveItem = async () => {
      const rawId = document.getElementById('id').value.trim();
      const title = document.getElementById('title').value.trim();
      const id = rawId || slugify(title || 'item');
      const contentKey = document.getElementById('contentKey').value.trim() || id;
      const description = document.getElementById('description').value.trim();
      const date = document.getElementById('date').value.trim();
      const image = document.getElementById('image').value.trim();
      const icon = document.getElementById('icon').value.trim();
      const active = document.getElementById('active').value === 'true';
      const md = document.getElementById('md').value;

      if (!id) {
        showStatus('Заполните название или ID', false);
        return;
      }

      const item = { id, contentKey, title, description, date, image, icon, active };
      await api('/api/save-item', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ type: currentType, item, prev: currentItem?.id || null })
      });

      await api('/api/save-md', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ type: currentType, key: contentKey, content: md })
      });

      showStatus('Сохранено');
      loadList();
    };

    const deleteItem = async () => {
      if (!confirm('Удалить элемент?')) return;
      await api('/api/delete-item', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ type: currentType, item: currentItem })
      });
      showStatus('Удалено');
      formEl.innerHTML = '';
      loadList();
    };

    const uploadImage = async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;
      const form = new FormData();
      files.forEach((file) => form.append('file', file));
      form.append('type', currentType);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();

      if (data.markdown?.length) {
        const md = document.getElementById('md');
        md.value += '\\n' + data.markdown.join('\\n') + '\\n';
      }

      if (data.filenames?.length) {
        const image = document.getElementById('image');
        if (image && !image.value) image.value = data.filenames[0];
        if (currentType === 'blog' && image && image.tagName === 'SELECT') {
          const updated = await api('/api/images?type=blog');
          const options = (updated.items || []).map(name =>
            '<option value="' + name + '"' + (name === image.value ? ' selected' : '') + '>' + name + '</option>'
          ).join('');
          image.innerHTML = '<option value="">— выбрать —</option>' + options;
        }
      }

      showStatus('Файлы загружены');
    };

    document.getElementById('newBtn').onclick = () => {
      currentItem = null;
      if (currentType === 'faq') openItem({ question: '', answer: '' });
      else openItem({ id: '', title: '', description: '', date: '', image: '', icon: iconOptionsAll[0] || '', contentKey: '', active: true });
    };

    typeSelect.onchange = () => {
      currentType = typeSelect.value;
      formEl.innerHTML = '';
      loadList();
    };

    loadList();
  </script>
</body>
</html>`,
    )
  }

  if (req.method === "GET" && url.pathname === "/api/list") {
    const type = url.searchParams.get("type")
    if (!["blog", "services", "faq"].includes(type)) return sendJson(res, 400, { error: "bad type" })
    const items = await readData(type)
    return sendJson(res, 200, items)
  }

  if (req.method === "GET" && url.pathname === "/api/images") {
    const type = url.searchParams.get("type")
    if (!["blog", "services"].includes(type)) return sendJson(res, 400, { error: "bad type" })
    const items = await listImages(type)
    return sendJson(res, 200, { items })
  }

  if (req.method === "GET" && url.pathname === "/api/md") {
    const type = url.searchParams.get("type")
    const key = url.searchParams.get("key")
    if (!["blog", "services"].includes(type) || !key) return sendJson(res, 400, { error: "bad params" })
    const content = await readMd(type, key)
    return sendJson(res, 200, { content })
  }

  if (req.method === "POST" && url.pathname === "/api/save-item") {
    const body = JSON.parse((await readBody(req)).toString("utf-8"))
    const { type, item, prev } = body
    const items = await readData(type)

    if (type === "faq") {
      const idx = items.findIndex((i) => i.question === prev || i.question === item.question)
      if (idx >= 0) items[idx] = item
      else items.push(item)
      await writeData(type, items)
      return sendJson(res, 200, { ok: true })
    }

    const idx = items.findIndex((i) => i.id === (prev || item.id))
    if (idx >= 0) items[idx] = item
    else items.push(item)
    await writeData(type, items)
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === "POST" && url.pathname === "/api/delete-item") {
    const body = JSON.parse((await readBody(req)).toString("utf-8"))
    const { type, item } = body
    let items = await readData(type)
    if (type === "faq") items = items.filter((i) => i.question !== item.question)
    else items = items.filter((i) => i.id !== item.id)
    await writeData(type, items)
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === "POST" && url.pathname === "/api/save-md") {
    const body = JSON.parse((await readBody(req)).toString("utf-8"))
    const { type, key, content } = body
    if (!["blog", "services"].includes(type)) return sendJson(res, 400, { error: "bad type" })
    await writeMd(type, key, content || "")
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === "POST" && url.pathname === "/api/upload") {
    const contentType = req.headers["content-type"] || ""
    const boundaryMatch = contentType.match(/boundary=([^;]+)/)
    if (!boundaryMatch) return sendJson(res, 400, { error: "no boundary" })
    const buffer = await readBody(req)
    const { files, fields } = parseMultipart(buffer, boundaryMatch[1])
    const type = fields.type || "blog"
    if (!["blog", "services"].includes(type)) return sendJson(res, 400, { error: "bad type" })
    await fs.mkdir(uploadDirs[type], { recursive: true })
    const uploads = files.filter((f) => f.name === "file")
    if (!uploads.length) return sendJson(res, 400, { error: "no file" })

    const filenames = []
    const markdown = []
    for (const file of uploads) {
      const safeName = file.filename.replace(/[^a-zA-Z0-9._-]/g, "_")
      const target = path.join(uploadDirs[type], safeName)
      await fs.writeFile(target, file.content)
      const mdPath = `/src/assets/imgs-src/${type}/${safeName}`
      filenames.push(safeName)
      markdown.push(`![Р¤РѕС‚Рѕ](${mdPath})`)
    }
    return sendJson(res, 200, { ok: true, filenames, markdown })
  }

  res.writeHead(404)
  res.end("Not found")
})

const port = 4173
server.listen(port, () => {
  console.log(`Admin panel running on http://localhost:${port}`)
})







import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import services from "./assets/data-src/services";
import blog from "./assets/data-src/blog/blog";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Главная",
    component: () => import("./components/content/views/HomeView.vue"),
    meta: {
      nav: true,
      breadcrumb: "Главная",
      title: "SoundBOX — техническое обеспечение мероприятий",
      description:
        "Звук, свет, сцена и техническое сопровождение мероприятий. SoundBOX обеспечивает надежную работу оборудования на событиях любого масштаба.",
    },
  },
  {
    path: "/services",
    name: "Услуги",
    component: () => import("./components/content/views/ServicesView.vue"),
    meta: {
      nav: true,
      breadcrumb: "Услуги",
      title: "Услуги SoundBOX — звук, свет и сцена",
      description:
        "Аренда и техническое сопровождение: звук, свет, сценические решения и эффекты. Подбор оборудования под ваш формат и бюджет.",
    },
  },
  {
    path: "/services/:id",
    name: "service-detail",
    component: () => import("./components/content/views/ServiceDetailView.vue"),
    meta: {
      nav: false,
      breadcrumb: "Услуга",
      title: "Услуга SoundBOX",
      description: "Подробности услуги SoundBOX.",
    },
  },
  {
    path: "/blog",
    name: "Блог",
    component: () => import("./components/content/views/BlogView.vue"),
    meta: {
      nav: true,
      breadcrumb: "Блог",
      title: "Блог SoundBOX — новости и кейсы",
      description:
        "Полезные материалы о звуке, свете, сцене и техническом обеспечении мероприятий, а также кейсы и новости компании.",
    },
  },
  {
    path: "/blog/:id",
    name: "blog-detail",
    component: () => import("./components/content/views/BlogPostView.vue"),
    meta: {
      nav: false,
      breadcrumb: "Статья",
      title: "Статья SoundBOX",
      description: "Подробности статьи SoundBOX.",
    },
  },
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

const defaultTitle = "SoundBOX — техническое обеспечение мероприятий";
const defaultDescription =
  "Звук, свет, сцена и техническое сопровождение мероприятий. SoundBOX обеспечивает надежную работу оборудования на событиях любого масштаба.";
const defaultOgImage = "/og-image.svg";

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    element!.setAttribute(key, value);
  });
};

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
};

const upsertJsonLd = (id: string, json: string) => {
  let script = document.head.querySelector(`#${id}`) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = json;
};

router.afterEach((to) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const canonicalUrl = `${siteUrl}${to.fullPath}`;

  let title = (to.meta.title as string) || defaultTitle;
  let description = (to.meta.description as string) || defaultDescription;
  let ogImage = `${siteUrl}${defaultOgImage}`;

  if (to.name === "service-detail") {
    const serviceId = String(to.params.id || "");
    const service = services.find((item) => item.id === serviceId);
    if (service) {
      title = `${service.title} — услуги SoundBOX`;
      description = `Подробности услуги: ${service.title}.`;
    }
  }

  if (to.name === "blog-detail") {
    const postId = String(to.params.id || "");
    const post = blog.find((item) => item.id === postId);
    if (post) {
      title = `${post.title} — блог SoundBOX`;
      description = post.description;
      ogImage = `${siteUrl}/assets/imgs-src/blog/${post.image}`;
    }
  }

  document.title = title;
  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertMeta('meta[name="robots"]', { name: "robots", content: "index,follow" });

  upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: description,
  });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "SoundBOX" });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: ogImage });

  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: description,
  });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: ogImage });

  upsertLink("canonical", canonicalUrl);

  const breadcrumbItems = to.matched
    .filter((route) => route.meta?.breadcrumb)
    .map((route, index) => {
      const name = String(route.meta?.breadcrumb);
      let path = route.path;
      if (route.name === "service-detail") {
        path = `/services/${to.params.id || ""}`;
      }
      if (route.name === "blog-detail") {
        path = `/blog/${to.params.id || ""}`;
      }
      return {
        "@type": "ListItem",
        position: index + 1,
        name,
        item: `${siteUrl}${path}`,
      };
    });

  upsertJsonLd(
    "breadcrumb-schema",
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    }),
  );
});

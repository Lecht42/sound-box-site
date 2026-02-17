const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const distDir = path.resolve(process.cwd(), "dist");
const outFile = path.resolve(process.cwd(), "dist.zip");

if (!fs.existsSync(distDir)) {
  console.error(`dist folder not found: ${distDir}`);
  process.exit(1);
}

const output = fs.createWriteStream(outFile);
const archive = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  console.log(`Created: ${outFile} (${archive.pointer()} bytes)`);
});

output.on("error", (err) => {
  console.error("WriteStream error:", err);
  process.exit(1);
});

archive.on("warning", (err) => {
  // например, ENOENT на отдельных файлах
  console.warn("Archiver warning:", err);
});

archive.on("error", (err) => {
  console.error("Archiver error:", err);
  process.exit(1);
});

archive.pipe(output);

// false = не класть dist/ как папку внутри архива, а положить содержимое в корень
archive.directory(distDir, false);

archive.finalize().catch((err) => {
  console.error("Finalize error:", err);
  process.exit(1);
});

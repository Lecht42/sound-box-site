import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/sound-box-site/",
  plugins: [vue(), tailwindcss()],
});

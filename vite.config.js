import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/DBD-randomizer/",
  plugins: [react(), tailwindcss()],
  outDir: "build",
});

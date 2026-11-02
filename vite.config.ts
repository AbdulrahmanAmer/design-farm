import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The playground is the app; ui/ and tokens/ are the library it renders.
export default defineConfig({
  root: "playground",
  plugins: [react()],
  server: { port: 5178, fs: { allow: [".."] } },
  build: { outDir: "../dist", emptyOutDir: true },
});

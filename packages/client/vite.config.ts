import { defineConfig } from "vite";
import * as dotenv from "dotenv";
import path from "path";
import react from "@vitejs/plugin-react";

dotenv.config({
  path: path.resolve(
    __dirname,
    process.env.NODE_ENV ? "." + process.env.NODE_ENV : "",
  ),
});

// https://vite.dev/config/
export default defineConfig({
  build: {
   sourcemap: 'hidden',
    minify: "terser", // More reliable than esbuild for source maps
    terserOptions: {
      keep_fnames: true, // Keeps function names intact
      keep_classnames: true // Prevents renaming class names
    }
  },
  plugins: [react()],
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem')),
    // },
    proxy: {
      "/api": {
        target: process.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});

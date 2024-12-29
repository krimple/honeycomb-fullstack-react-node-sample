import { defineConfig } from "vite";
import * as dotenv from "dotenv";
// import fs from "fs";
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
  plugins: [react()],
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem')),
    // },
    // proxy: {
    //   "/api": {
    //     target: process.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, "/api"),
    //   },
    // },
  },
});

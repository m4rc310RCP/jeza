import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as path from 'path'
import dotenv from 'dotenv';
import basicSsl from "@vitejs/plugin-basic-ssl";

dotenv.config();

// const srcPath = './src'
const rootPathV1 = './src/v1'
const rootPathV2 = './src/v2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
	 server: {
		  host: "app.mls.m4rc310.com.br",
    	port: 5173,
			https: {}
	 },
	 resolve: {
		alias: {
			"@jeza/core": path.resolve(__dirname, rootPathV1, `@core`),
			"@jeza": path.resolve(__dirname, rootPathV1, `@presentation`),
			"@jeza-v2/core": path.resolve(__dirname, rootPathV2, `@core`),
			"@jeza-v2/presentation": path.resolve(__dirname, rootPathV2, `@presentation`),
		}
	 }
})

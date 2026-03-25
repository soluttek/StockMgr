import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
	plugins: [
		vue(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "StockMgr PWA",
				short_name: "StockMgr",
				theme_color: "#1a1a1a",
				icons: [
					{
						src: "/pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/szmqukqunofeofcfdjod\.supabase\.co\/.*/i,
						handler: "NetworkFirst",
						options: {
							cacheName: "supabase-api-cache",
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			}
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 3000,
		open: true,
	},
});

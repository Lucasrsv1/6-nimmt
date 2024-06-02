import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/generate-full-ranking/index.ts",
		"src/generate-full-ranking/worker/index.ts"
	],
	format: ["cjs", "esm"],		// Build for commonJS and ESmodules
	dts: true,					// Generate declaration file (.d.ts)
	splitting: false,
	sourcemap: true,
	clean: true
});

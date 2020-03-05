import babel from "rollup-plugin-babel";
import { eslint } from "rollup-plugin-eslint";
import resolve from '@rollup/plugin-node-resolve';


export default {
	input: "source/index.js",
	plugins: [
		eslint(),
		babel({
			exclude: "node_modules/**"
		}),
		resolve()
	],
	output: {
		file: "module/lursa.js",
		format: "es"
	}
};

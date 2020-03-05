import babel from "rollup-plugin-babel";
import { eslint } from "rollup-plugin-eslint";



export default {
	input: "source/index.js",
	plugins: [
		eslint(),
		babel({
			exclude: "node_modules/**"
			//,babelrc: false, // Ignore below comment. babelrc is used to include babel-plugin-external-helpers as per https://github.com/rollup/rollup-plugin-babel
			//presets: ["es2015-rollup"] // This was deprecated. Previously used because: .babelrc is required for pkg.scripts.test, override here // https://github.com/rollup/rollup-plugin-babel/issues/14#issuecomment-157445431
		})
	],
	output: {
		file: "module/lursa.js",
		format: "es"
	}
};

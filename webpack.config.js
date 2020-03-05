var webpack = require("webpack");
var path = require("path");

module.exports = [
	{
		entry: "./source/index.js",
		output:{
			filename: "lursa.js",
			library: "Lursa",
			libraryTarget: "umd"
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: "babel-loader",
					exclude: /node_modules/,
				}
			]
		}
	}
];

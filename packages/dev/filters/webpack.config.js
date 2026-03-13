/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const tsRule = {
    test: /\.tsx?$/,
    use: {
        loader: "ts-loader",
        options: {
            configFile: path.resolve(__dirname, "tsconfig.build.json"),
            transpileOnly: true,
        },
    },
    exclude: /node_modules/,
};

const resolve = {
    extensions: [".ts", ".tsx", ".js"],
};

/**
 * @param {Record<string, string>} _env
 * @param {{ mode?: string }}       argv
 * @returns {import("webpack").Configuration}
 */
module.exports = (_env, argv) => {
    const mode = /** @type {"production"|"development"} */ (argv.mode === "development" ? "development" : "production");
    const isProd = mode === "production";

    return {
        name: "McpFilters",
        mode,
        entry: path.resolve(__dirname, "src/index.ts"),
        target: "web",
        devtool: isProd ? "source-map" : "inline-source-map",
        output: {
            filename: "mcp-filters.js",
            path: path.resolve(__dirname, "bundle"),
            library: {
                name: "McpFilters",
                type: "umd",
            },
            globalObject: "globalThis",
        },
        module: { rules: [tsRule] },
        resolve,
    };
};

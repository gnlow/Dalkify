import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/dalkify.ts",
    output: {
        dir: ".",
        format: "iife",
        name: "dalkify"
    },
    plugins: [typescript()]
}
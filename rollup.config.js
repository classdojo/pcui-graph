import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import jscc from 'rollup-plugin-jscc';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const umdBuild = {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'pcuiGraph',
        globals: {
            '@playcanvas/observer': 'observer',
            '@playcanvas/pcui': 'pcui'
        }
    },
    external: ['@playcanvas/observer', '@playcanvas/pcui'],
    plugins: [
        jscc({
            values: { _STRIP_SCSS: process.env.STRIP_SCSS }
        }),
        postcss({
            minimize: false,
            extensions: ['.css', '.scss']
        }),
        commonjs({ transformMixedEsModules: true }),
        globals(),
        builtins(),
        babel({ babelHelpers: 'bundled' }),
        resolve(),
        process.env.NODE_ENV === 'production' && uglify()
    ]
};

const moduleBuild = {
    input: 'src/index.js',
    output: {
        file: 'dist/index.mjs',
        format: 'module'
    },
    external: ['@playcanvas/observer', '@playcanvas/pcui'],
    plugins: [
        commonjs({ transformMixedEsModules: true }),
        globals(),
        builtins(),
        babel({ babelHelpers: 'bundled' }),
        postcss({
            minimize: false,
            extensions: ['.css', '.scss']
        }),
        resolve(),
        process.env.NODE_ENV === 'production' && uglify()
    ]
};

const bundleBuild = {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.mjs',
        format: 'module'
    },
    plugins: [
        commonjs({ transformMixedEsModules: true }),
        globals(),
        builtins(),
        babel({ babelHelpers: 'bundled' }),
        postcss({
            minimize: false,
            extensions: ['.css', '.scss']
        }),
        resolve(),
        process.env.NODE_ENV === 'production' && uglify()
    ]
};


let targets;
if (process.env.target) {
    switch (process.env.target.toLowerCase()) {
        case "umd":      targets = [umdBuild]; break;
        case "module":      targets = [moduleBuild]; break;
        case "bundle":      targets = [bundleBuild]; break;
        case "all":      targets = [umdBuild, moduleBuild, bundleBuild]; break;
    }
}

export default targets;

// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

import replace from '@rollup/plugin-replace';

export default {
    input: './Main.tsx',
    output: {
        dir: 'output',
        format: 'iife',
        name: 'XXX',
        sourcemap: 'inline',
    },
    plugins: [typescript(), commonjs(), nodeResolve(), replace({
        'process.env.NODE_ENV' : '"development"'
    })]
};
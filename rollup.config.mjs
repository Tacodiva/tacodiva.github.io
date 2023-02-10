import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.ts',

	onwarn: function (message) {
		// Make rollup shut up about circular dependency 'issues'.
		if (message.code === 'CIRCULAR_DEPENDENCY') return;
		console.warn(message.toString());
	},

	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'public/bundle.js',
	},

	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		css({ output: 'bundle.css' }),

		resolve({ dedupe: ['svelte'] }),
		commonjs(),

		typescript(
			{
				tsconfig: "tsconfig.json",
				sourceMap: !production,
				inlineSources: !production
			}
		),

		!production && livereload({ watch: ['./public'] }),
		production && terser({ mangle: true })
	],
	watch: {
		clearScreen: false
	}
};
import svelte from 'rollup-plugin-svelte-hot';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import hmr from 'rollup-plugin-hot';

const nollup = !!process.env.NOLLUP;
const watch = !!process.env.ROLLUP_WATCH;
const useLiveReload = !!process.env.LIVERELOAD;

const dev = watch || useLiveReload;
const production = !dev;
const hot = watch && !useLiveReload;

function serve() {
	let started = false
	return {
		name: 'svelte/template:serve',
		writeBundle() {
			if (!started) {
				started = true
				const flags = ['run', 'start', '--', '--dev']
				// if (spa) flags.push('--single');

				require('child_process').spawn('npm', flags, {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true,
				});
			}
		},
	}
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/bundle.css');
			},
			hot: hot && {
				optimistic: true,
				noPreserveState: false,
			},
		}),
		replace({
			process: JSON.stringify({
				env: {
					isDev: !production,
				}
			}),
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		dev && !nollup && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		useLiveReload && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		hmr({
			public: 'public',
			inMemory: true,
	
			// This is needed, otherwise Terser (in npm run build) chokes
			// on import.meta. With this option, the plugin will replace
			// import.meta.hot in your code with module.hot, and will do
			// nothing else.
			compatModuleHot: !hot,
		}),
	],
	watch: {
		clearScreen: false
	}
};

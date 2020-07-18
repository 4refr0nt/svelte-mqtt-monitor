import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-bundle-size';
import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';

// load ENV var from .env file
dotenv.config();

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		replace({
			DEVICE_ID: JSON.stringify(process.env.DEVICE_ID),
			MQTT_PROTOCOL: JSON.stringify(process.env.MQTT_PROTOCOL),
			MQTT_HOST: JSON.stringify(process.env.MQTT_HOST),
			MQTT_PORT: JSON.stringify(process.env.MQTT_PORT),
			MQTT_USERNAME: JSON.stringify(process.env.MQTT_USERNAME),
			MQTT_PASSWORD: JSON.stringify(process.env.MQTT_PASSWORD),
			MQTT_PATH: JSON.stringify(process.env.MQTT_PATH),
			MQTT_SUBSCRIBE_TOPIC: JSON.stringify(process.env.MQTT_SUBSCRIBE_TOPIC),
			MQTT_MAX_MESSAGES: JSON.stringify(process.env.MQTT_MAX_MESSAGES),
			DATE_FORMAT: JSON.stringify(process.env.DATE_FORMAT),
		}),

		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('public/build/bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
			preferBuiltins: true
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
		production && bundleSize(),
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}

module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		jest: true,
	},
	extends: [
		'airbnb-base',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
	},
	rules: {
		'no-underscore-dangle': 0,
		'no-console': 0,
		'no-tabs': 0,
		indent: ['error', 'tab'],
		semi: 2,
		'global-require': 1,
		'handle-callback-err': 2,
		'no-mixed-requires': 2,
		'no-multi-spaces': 2,
		'no-var': 2,
		'prefer-const': 2,
		'no-trailing-spaces': 2,
		'no-process-exit': 2,
		'require-await': 2,
		camelcase: 'off',
	},
};

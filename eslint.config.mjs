import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';

export default [{
  ignores: ['dist/**'],
},
js.configs.recommended,
...pluginVue.configs['flat/essential'],
{
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },

    ecmaVersion: 2022,
    sourceType: 'module',
  },

  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'vue/require-v-for-key': 0,
    'no-console': 1,
  },
}, {
  files: ['**/*.vue'],

  rules: {
    indent: 'off',

    'vue/script-indent': ['error', 2, {
      baseIndent: 1,
    }],
  },
}];

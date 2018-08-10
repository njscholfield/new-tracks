module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:vue/essential"
    ],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "vue/require-v-for-key": 0,
        "no-console": 1
    },
    "overrides": [
        {
            "files": ["*.vue"],
            "rules": {
              "indent": "off",
              "vue/script-indent": ["error", 2, { "baseIndent": 1 }]
            }
        }
  ]
};

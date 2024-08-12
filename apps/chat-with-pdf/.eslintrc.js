
const { resolve } = require('node:path');

/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ['@makify/eslint-config/next.js'],
    settings: {
        "import/resolver": {
            typescript: {
                project: [
                    /* resolve(process.cwd(), 'tsconfig.json'), */
                    resolve(process.cwd(), 'apps/chat-with-pdf/tsconfig.json')
                ]
            }
        }
    }
};
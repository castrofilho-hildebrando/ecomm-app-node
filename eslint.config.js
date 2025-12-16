// eslint.config.js (NOVO FORMATO FLAT CONFIG)

// Importa os plugins necessários (o ESLint 9 exige 'require' ou 'import')
const eslintPluginTypeScript = require('@typescript-eslint/eslint-plugin');
const eslintParserTypeScript = require('@typescript-eslint/parser');

module.exports = [
    {
        // 1. Arquivos: Define quais arquivos esta configuração se aplica
        files: ["**/*.js", "**/*.ts"],
        
        // 2. Parser: O parser para arquivos TS
        languageOptions: {
            parser: eslintParserTypeScript,
            parserOptions: {
                // Configurações do parser
                sourceType: "module",
                ecmaVersion: 2021, // ECMA 12
            },
            // Define o Node global/ambiente
            globals: {
                process: "readonly",
                module: "readonly",
                require: "readonly",
                // Adicione outras variáveis globais aqui (browser, window, etc., se precisar)
                browser: "readonly",
            }
        },
        
        // 3. Plugins: Associa o alias '@typescript-eslint' ao objeto plugin
        plugins: {
            "@typescript-eslint": eslintPluginTypeScript,
        },
        
        // 4. Regras
        rules: {
            // Regras básicas:
            "semi": ["error", "always"],
            
            // Regra de Indentação
            // No Flat Config, a indentação do TS é configurada como uma regra do @typescript-eslint
            // Use o formato de escopo corrigido para o ESLint 9 (Flat Config)
            "indent": ["error", 4, { "SwitchCase": 1 }],
        }
    }
];
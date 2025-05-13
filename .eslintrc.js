module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Asegúrate de tener TypeScript como parser
  extends: [
    '@react-native',
    'plugin:@typescript-eslint/recommended', // Añade reglas recomendadas de TypeScript
    'plugin:prettier/recommended' // Integra Prettier con ESLint
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': ['error', {trailingComma: 'none'}], // Alinea con Prettier
    '@typescript-eslint/explicit-module-boundary-types': 'off' // Desactiva necesidad de tipos explícitos
  }
};

// metro.config.js
/**
 * Configuración de Metro Bundler para Expo
 * Resuelve problemas con módulos WASM y otros recursos
 */

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Asegurar que los archivos WASM se ignoren en web
config.resolver.assetExts.push(
    'wasm',
    'db',
    'sqlite',
);

module.exports = config;

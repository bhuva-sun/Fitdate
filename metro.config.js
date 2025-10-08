// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

// Enable web support and properly handle all required extensions
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'web.js',
  'web.jsx',
  'web.ts',
  'web.tsx',
  'mjs',
];

// Handle static assets for web
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'ttf',
  'woff',
  'woff2',
  'eot',
  'svg',
];

// Performance optimizations
config.maxWorkers = 4; // Adjust based on your CPU cores
config.transformer.minifierConfig = {
  compress: {
    drop_console: false, // Keep console.logs in development
    drop_debugger: true,
  }
};

// Cache configuration
config.cacheStores = [
  {
    type: 'file',
    absolute: true,
    root: `${__dirname}/node_modules/.cache/metro`,
  },
];

// Watchman configuration
config.watchFolders = [__dirname];
config.resolver.nodeModulesPaths = [`${__dirname}/node_modules`];

// Additional performance optimizations
config.resetCache = false;
config.transformer.asyncRequireModulePath = require.resolve('metro-runtime/src/modules/asyncRequire');
config.transformer.enableBabelRuntime = true;

module.exports = config;
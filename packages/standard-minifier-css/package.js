Package.describe({
  name: 'standard-minifier-css',
  version: '1.9.3-alpha300.15',
  summary: 'Standard css minifier used with Meteor apps by default.',
  documentation: 'README.md',
});

Package.registerBuildPlugin({
  name: "minifyStdCSS",
  use: [
    'minifier-css',
    'ecmascript',
    'logging',
  ],
  npmDependencies: {
    "@babel/runtime": "7.21.0",
    "source-map": "0.7.4",
    "lru-cache": "8.0.0",
    "micromatch": "4.0.5",
  },
  sources: [
    'plugin/minify-css.js',
  ]
});

Package.onUse(function(api) {
  api.use('minifier-css');
  api.use('isobuild:minifier-plugin@1.0.0');
  api.use('logging');
});

Package.describe({
  summary: 'Internal force-ssl common code.',
  version: '2.0.0-alpha300.9',
});

Npm.depends({
  'forwarded-http': '0.3.0'
});

Package.onUse(function (api) {
  api.use('ecmascript');
  api.mainModule('force_ssl_common.js', 'server');
});

Package.onTest(function (api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.mainModule('force_ssl_tests.js', 'server');
});

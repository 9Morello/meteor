Package.describe({
  summary: "Base64 encoding and decoding",
  version: '2.0.0-alpha300.9',
});

Package.onUse(api => {
  api.export('Base64');
  api.use('ecmascript');
  api.mainModule('base64.js');
});

Package.onTest(api => {
  api.use(['ecmascript', 'tinytest', 'ejson']);
  api.addFiles('base64_test.js', ['client', 'server']);
});

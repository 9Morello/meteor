Package.describe({
  version: '2.0.0-alpha300.9',
  summary: 'SHA256 implementation',
  git: 'https://github.com/meteor/meteor'
});

Package.onUse(function (api) {
  api.export('SHA256');
  api.addFiles('sha256.js');
});

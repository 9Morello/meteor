Package.describe({
  summary: 'GeoJSON utility functions (from https://github.com/maxogden/geojson-js-utils)',
  version: '2.0.0-alpha300.9',
});

Package.onUse(function (api) {
  api.use('modules');
  api.export('GeoJSON');
  api.mainModule('main.js');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('geojson-utils');
  api.addFiles(['geojson-utils.tests.js'], 'client');
});

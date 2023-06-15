Package.describe({
  summary: "Reactive dictionary",
  version: '2.0.0-alpha300.9',
});

Package.onUse(function (api) {
  api.use(['tracker', 'ejson', 'ecmascript']);
  // If we are loading mongo-livedata, let you store ObjectIDs in it.
  api.use(['mongo', 'reload'], { weak: true });
  api.mainModule('migration.js');
  api.export('ReactiveDict');
  api.addAssets('reactive-dict.d.ts', 'server');
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('reactive-dict');
  api.use('tracker');
  api.use('reload');
  api.addFiles('reactive-dict-tests.js');
});

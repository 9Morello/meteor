Package.describe({
  summary: "Allows you to define and run db migrations."
});

Package.on_use(function (api) {
  api.use('underscore', 'server');
  
  api.add_files(['migrations_server.js'], "server");
  
  api.export('Migrations', 'server');
});

Package.on_test(function (api) {
  api.use(['percolatestudio-migrations', 'tinytest']);
  api.add_files('migrations_tests.js', ['server']);
});
Package.describe({
  summary: "Allows you to define and run db migrations.",
  version: "0.7.2",
  name: "percolatestudio:percolatestudio-migrations",
  git: "https://github.com/percolatestudio/meteor-migrations.git"
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@0.9.1.1');
  api.use('underscore', 'server');
  api.add_files(['migrations_server.js'], "server");
  api.export('Migrations', 'server');
});

Package.on_test(function (api) {
  api.use(['percolatestudio:percolatestudio-migrations', 'tinytest']);
  api.add_files('migrations_tests.js', ['server']);
});
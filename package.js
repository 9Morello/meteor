Package.describe({
  summary:
    "Allows you to define and run scheduled jobs across multiple servers.",
  version: "2.0.0",
  name: "quave:synced-cron",
  git: "https://github.com/percolatestudio/meteor-synced-cron.git",
});

Npm.depends({ "@breejs/later": "4.1.0" });

Package.onUse(function (api) {
  api.versionsFrom("METEOR@3.0-alpha.17");

  api.use(
    ["check", "mongo@1.0.0||2.0.0||2.0.0-alpha300.17", "logging"],
    "server",
  );

  api.addFiles(["synced-cron-server.js"], "server");

  api.export("SyncedCron", "server");
});

Package.onTest(function (api) {
  api.use(["check", "mongo"], "server");
  api.use(["tinytest", "logging"]);

  api.addFiles(["synced-cron-server.js", "synced-cron-tests.js"], ["server"]);
});

Package.describe({
  summary: "Google OAuth flow",
  version: '2.0.0-alpha300.9',
});

Cordova.depends({
  "cordova-plugin-googleplus": "8.4.0",
});

Package.onUse(api => {
  api.use("ecmascript");
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('fetch', ['server']);
  api.use('service-configuration');
  api.use('random', 'client');

  api.addFiles('google_server.js', 'server');
  api.addFiles('google_client.js', 'client');
  api.addFiles('google_sign-in.js', 'web.cordova');

  api.mainModule('namespace.js');

  api.export('Google');
});

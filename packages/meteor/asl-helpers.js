function getAsl() {
  if (!global.asyncLocalStorage) {
    // lazily create asyncLocalStorage since this might run in older Meteor
    // versions that are incompatible with async hooks
    var AsyncLocalStorage = Npm.require('async_hooks').AsyncLocalStorage;
    global.asyncLocalStorage = new AsyncLocalStorage();
  }

  return global.asyncLocalStorage;
}

function getAslStore() {
  if (!Meteor.isServer) {
    return {};
  }

  var asyncLocalStorage = getAsl();
  return asyncLocalStorage.getStore() || {};
}

function getValueFromAslStore(key) {
  return getAslStore()[key];
}

function updateAslStore(key, value) {
  return getAslStore()[key] = value;
}

Meteor._getAsl = getAsl;
Meteor._getAslStore = getAslStore;
Meteor._getValueFromAslStore = getValueFromAslStore;
Meteor._updateAslStore = updateAslStore;

Meteor._runAsync = function (fn, ctx, store) {
  if (store === undefined) {
    store = {};
  }
  var asyncLocalStorage = getAsl();

  return asyncLocalStorage.run(
    store || Meteor._getAslStore(),
    function () {
      return fn.call(ctx);
    }
  );
};

Meteor._isPromise = function (r) {
  return r && typeof r.then === 'function';
};

meteor-roles
============

Roles-based authorization package for Meteor - compatible with built-in accounts package.

<br />

### Example App

The ```example-app``` directory contains a Meteor app which shows off the following features:
* Server-side publishing with authorization to secure sensitive data
* Client-side navigation with link visibility based on user permissions
* 'Sign-in required' app with up-front login page using ```accounts-ui```
* Client-side routing via ```meteor-router``` smart package

View online @  <a href="http://roles-example.meteor.com/" target="_blank">http://roles-example.meteor.com/</a>
  
Run locally:
  1. install [Meteorite][1]
  2. ```git clone https://github.com/alanning/meteor-roles.git```
  3. ```cd meteor-roles/example-app```
  4. ```mrt```
  5. point browser to ```http://localhost:3000```

<br />

### Changes to default Meteor behavior

  1. User entries in the ```Meteor.users``` collection gain a new field named ```roles``` which is an array of strings corresponding to the user's roles.
  2. A new collection ```Meteor.roles``` contains a global list of defined role names.
  3. The currently logged-in user's ```roles``` field is automatically published under ```_roles_own_user_roles```.
  4. Client javascript automatically subscribes to ```_roles_own_user_roles```.

<br />

### Usage

Add this smart package to your project:

  1. install [Meteorite][1]
  2. ```mrt add roles```


<br />

Here are some potential use cases:

<br />

-- **Server** --


Add users to roles:
```js
  var users = [
      {name:"Normal User",email:"normal@example.com",roles:[]},
      {name:"View-Secrets User",email:"view@example.com",roles:['view-secrets']},
      {name:"Manage-Users User",email:"manage@example.com",roles:['manage-users']},
      {name:"Admin User",email:"admin@example.com",roles:['admin']}
    ];

  _.each(users, function (user) {
    var id;
    
    id = Accounts.createUser({
      email: user.email,
      password: "apple1",
      profile: { name: user.name }
    });

    if (user.roles.length > 0) {
      Roles.addUsersToRoles(id, user.roles);
    }
  
  });
```

<br />

Check user roles before publishing sensitive data:
```js
// server/publish.js

// Give authorized users access to sensitive data
Meteor.publish('secrets', function () {
  if (Roles.userIsInRole(this.userId, ['view-secrets','admin'])) {
    
    return Meteor.secrets.find();
    
  } else {
    
    // user not authorized. do not publish secrets
    this.stop();
    return;
  
  }
});
```

<br />

Prevent non-authorized users from creating new users:
```js
  Accounts.validateNewUser(function (user) {
    var loggedInUser = Meteor.user();

    if (Roles.userIsInRole(loggedInUser, ['admin','manage-users'])) {
      return true;
    }

    throw new Meteor.Error(403, "Not authorized to create new users");
  });
```

<br />

-- **Client** --

Client javascript has access to all the same Roles functions as the server with the addition of a ```isInRole``` handlebars helper which is automatically registered by the Roles package.

Like all Meteor applications, client-side checks are a convenience, rather than a true security implementation 
since Meteor bundles the same client-side code to all users.  Providing the Roles functions client-side also allows for latency compensation during Meteor method calls.

NOTE: Any sensitive data needs to be controlled server-side to prevent unwanted disclosure. To be clear, Meteor sends all templates, client-side javascript, and published data to the client's browser.  This is by design and is a good thing.  The following example is just sugar to help improve the user experience for normal users.  Those interested in seeing the 'admin_nav' template in the example below will still be able to do so by manually reading the bundled ```client.js``` file. It won't be pretty but it is possible. But this is not a problem as long as the actual data is restricted server-side.

```handlebars
<!-- client/myApp.html -->

<template name="header">
  ... regular header stuff
  {{#if isInRole 'admin'}}
    {{> admin_nav}}  
  {{/if}}
</template>
```

<br />

### Documentation

Online API docs found here: http://alanning.github.com/meteor-roles/

API docs generated using [YUIDoc][2]

To re-generate documentation:
  1. install YUIDoc
  2. ```cd meteor-roles```
  3. ```yuidoc```

To serve documentation locally:
  1. install YUIDoc
  2. ```cd meteor-roles```
  3. ```yuidoc --server```
  4. point browser at http://localhost:3000/


<br />

### Tests


To run tests: 
  1. install [Meteorite][1]
  2. ```cd meteor-roles/roles```
  3. ```mrt```
  4. point browser at http://localhost:3000/

_NOTE_: If you see an error message regarding **'roles package does not exist'** that means you are trying to run 'mrt' in the wrong directory.  See step 2.





[1]: https://github.com/oortcloud/meteorite "Meteorite"

[2]: http://yui.github.com/yuidoc/ "YUIDoc"

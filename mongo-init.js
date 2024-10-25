db = db.getSiblingDB('todo-app');

// Create user for the todo-app database
db.createUser({
  user: 'admin',
  pwd: 'password',
  roles: [
    {
      role: 'readWrite',
      db: 'todo-app',
    },
  ],
});

// Create some initial collections
db.createCollection('todos');
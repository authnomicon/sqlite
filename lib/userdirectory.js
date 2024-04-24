function SQLiteUserDirectory(db) {
  this._db = db;
}

SQLiteUserDirectory.prototype.read = function(id, cb) {
  this._db.get('SELECT rowid AS id, * FROM users WHERE rowid = ?', [ id ], function(err, row) {
    if (err) { return cb(err); }
    
    // TODO: Handle undefined row.
  
    var user = {
      id: row.id.toString(),
      username: row.username,
      displayName: row.name
    };
    return cb(null, user);
  });
}

SQLiteUserDirectory.prototype.create = function(user, cb) {
  this._db.run('INSERT INTO users (name) VALUES (?)', [
    user.displayName
  ], function(err) {
    if (err) { return next(err); }
    
    var obj = {
      id: this.lastID.toString(),
      displayName: user.displayName
    };
    return cb(null, obj);
  });
};

SQLiteUserDirectory.prototype.read = function(id, cb) {
  this._db.get('SELECT rowid AS id, * FROM users WHERE rowid = ?', [ id ], function(err, row) {
    if (err) { return next(err); }

    // TODO: Handle undefined row.

    var user = {
      id: row.id.toString(),
      username: row.username,
      displayName: row.name
    };
    return cb(null, user);
  });
}

SQLiteUserDirectory.prototype.find = function(username, cb) {
  return;
  
  this._db.get('SELECT rowid AS id, * FROM clients WHERE rowid = ?', [ id ], function(err, row) {
    if (err) { return cb(err); }
    
    // TODO: Handle undefined row.
  
    var client = {
      id: row.id.toString(),
      redirectURIs: [ row.redirect_uri ],
      name: row.name
    };
    return cb(null, client);
  });
}

module.exports = SQLiteUserDirectory;

var crypto = require('crypto');


function SQLiteClientDirectory(db) {
  this._db = db;
}

SQLiteClientDirectory.prototype.list = function(cb) {
  this._db.all('SELECT rowid AS id, * FROM clients', function(err, rows) {
    if (err) { return cb(err); }
    
    var clients = rows.map(function(row) {
      var client = {
        id: row.id.toString(),
        redirectURIs: [ row.redirect_uri ],
        name: row.name
      };
      if (row.web_origin) { client.webOrigins = [ row.web_origin ]; }
      
      return client;
    })
    return cb(null, clients);
  });
}

SQLiteClientDirectory.prototype.read = function(id, cb) {
  this._db.get('SELECT rowid AS id, * FROM clients WHERE rowid = ?', [ id ], function(err, row) {
    if (err) { return cb(err); }
    if (!row) { return cb(null); }
  
    var client = {
      id: row.id.toString(),
      redirectURIs: [ row.redirect_uri ],
      name: row.name
    };
    if (row.web_origin) { client.webOrigins = [ row.web_origin ]; }
    
    return cb(null, client);
  });
}

SQLiteClientDirectory.prototype.create = function(client, cb) {
  var secret = crypto.randomBytes(20).toString('hex');
  
  this._db.run('INSERT INTO clients (secret, redirect_uri, name) VALUES (?, ?, ?)', [
    secret,
    client.redirectURIs[0],
    client.name
  ], function(err) {
    if (err) { return next(err); }
    
    var obj = {
      id: this.lastID.toString(),
      name: client.name,
      secret: secret,
      redirectURIs: [ client.redirectURIs[0] ]
    };
    return cb(null, obj);
  });
};

module.exports = SQLiteClientDirectory;


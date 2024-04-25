var uuid = require('uuidv7').uuidv7;
var pbkdf2 = require('@phc/pbkdf2');

var FIND_BY_USERNAME_SQL =
'SELECT users.* \
   FROM users \
  WHERE username = $username';

// TODO: add more columns
var INSERT_USER_SQL =
'INSERT INTO users (user_id, username, hashed_password, family_name, given_name) \
 VALUES ($id, $username, $hashedPassword, $familyName, $givenName)';


function SQLitePasswordStore(db) {
  this._db = db;
}

SQLitePasswordStore.prototype.create = function(user, password, cb) {
  var self = this;
  
  pbkdf2.hash(password, { digest: 'sha256', iterations: 310000 })
    .then(function(hashedPassword) {
      var id = uuid();
      self._db.run(INSERT_USER_SQL, {
          $id: id,
          $username: user.username,
          $hashedPassword: hashedPassword,
          $familyName: user.name && user.name.familyName,
          $givenName: user.name && user.name.givenName
        }, function(err) {
          if (err) { return cb(err); }
          
          var obj = {
            id: id,
            username: user.username
          };
          return cb(null, obj);
        });
    }, function(error) {
      return cb(error);
    });
};

SQLitePasswordStore.prototype.verify = function(username, password, cb) {
  this._db.get(FIND_BY_USERNAME_SQL, { $username: username }, function(err, row) {
    if (err) { return cb(err); }
    if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    
    pbkdf2.verify(row.hashed_password, password)
      .then(function(match) {
        if (!match) { return cb(null, false, { message: 'Incorrect username or password.' }); }
        
        var obj = {
          id: row.user_id,
          username: row.username
        };
        return cb(null, obj);
      }, function(error) {
        return cb(error);
      });
  });
}


module.exports = SQLitePasswordStore;

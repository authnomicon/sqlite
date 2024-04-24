var sqlite3 = require('sqlite3');
var fs = require('fs');
var path = require('path');


exports = module.exports = function() {
  var db = new sqlite3.Database('db.sqlite3');
  
  var sql = fs.readFileSync(path.join(__dirname, '../lib/schema.sql'), 'utf8');
  //console.log(sql);
  
  db.exec(sql, function(err) {
    if (err) {
      // TODO: handle this better
      console.log('ERROR CREATING DATABASE SCHEMA');
      console.log(err);
    }
  });
  
  return db;
};

exports['@singleton'] = true;

var sqlite3 = require('sqlite3');

exports = module.exports = function() {
  return new sqlite3.Database('db.sqlite3');
};

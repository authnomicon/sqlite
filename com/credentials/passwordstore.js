var PasswordStore = require('../../lib/credentials/passwordstore');

exports = module.exports = function(db) {
  return new PasswordStore(db);
};

exports['@singleton'] = true;
exports['@implements'] = 'module:@authnomicon/credentials.PasswordStore';
exports['@require'] = [
  '../database'
];

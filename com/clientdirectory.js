var ClientDirectory = require('../lib/clientdirectory');

exports = module.exports = function(db) {
  return new ClientDirectory(db);
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.authnomicon.org/oauth2/ClientDirectory';
exports['@require'] = [
  './database'
];

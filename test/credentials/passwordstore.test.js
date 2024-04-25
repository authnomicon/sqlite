var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/credentials/passwordstore');


describe('credentials/passwordstore', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
    expect(factory['@implements']).to.equal('module:@authnomicon/credentials.PasswordStore');
  });
  
  it('should create account with username and password', function(done) {
    var db = new Object();
    db.run = sinon.stub().yieldsAsync(null);
    
    var user = {
      username: 'mhashimoto'
    };
    
    var store = factory(db);
    store.create(user, 'opensesame', function(err, user) {
      if (err) { return done(err); }
      
      expect(db.run).to.have.been.calledOnce;
      var sql = db.run.getCall(0).args[0];
      var values = db.run.getCall(0).args[1];
      expect(sql).to.equal('INSERT INTO users (user_id, username, hashed_password, family_name, given_name)  VALUES ($id, $username, $hashedPassword, $familyName, $givenName)');
      expect(values.$id).to.have.length(36);
      delete values.$id;
      expect(values.$hashedPassword.indexOf('$pbkdf2-sha256$i=310000$')).to.equal(0);
      delete values.$hashedPassword;
      expect(values).to.deep.equal({
        $username: 'mhashimoto',
        $familyName: undefined,
        $givenName: undefined
      })
      
      expect(user.id).to.have.length(36);
      delete user.id;
      expect(user).to.deep.equal({
        username: 'mhashimoto'
      });
      done();
    });
  });
  
  it('should create account with family name and given name', function(done) {
    var db = new Object();
    db.run = sinon.stub().yieldsAsync(null);
    
    var user = {
      username: 'mhashimoto',
      name: {
        familyName: 'Hashimoto',
        givenName: 'Mork'
      }
    };
    
    var store = factory(db);
    store.create(user, 'opensesame', function(err, user) {
      if (err) { return done(err); }
      
      expect(db.run).to.have.been.calledOnce;
      var sql = db.run.getCall(0).args[0];
      var values = db.run.getCall(0).args[1];
      expect(sql).to.equal('INSERT INTO users (user_id, username, hashed_password, family_name, given_name)  VALUES ($id, $username, $hashedPassword, $familyName, $givenName)');
      expect(values.$id).to.have.length(36);
      delete values.$id;
      expect(values.$hashedPassword.indexOf('$pbkdf2-sha256$i=310000$')).to.equal(0);
      delete values.$hashedPassword;
      expect(values).to.deep.equal({
        $username: 'mhashimoto',
        $familyName: 'Hashimoto',
        $givenName: 'Mork'
      })
      
      expect(user.id).to.have.length(36);
      delete user.id;
      expect(user).to.deep.equal({
        username: 'mhashimoto'
      });
      done();
    });
  });
  
});

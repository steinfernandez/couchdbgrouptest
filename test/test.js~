var couch_module = require("../couch_module.js");
var assert = require('assert');
var mocha_steps = require('mocha-steps');
var stepnum = 0;

function done(result)
{
	console.log("haha stuff also here is your result: ");
	console.log(result);
/*	if(result == true)
	{
		stepnum++;
		functions[stepnum];
	}*/
	return;
}

function bodycallback(body)
{
	console.log("here is your body result");
	console.log(body);
	return;
}
/*
var testusercreate = couch_module.user.create("testuser1","testpwd1", "11-21-2015", booleancallback);
var testusercheckinfo = couch_module.user.checkinfo("testuser1",bodycallback);

      functions = [
        couch_module.user.create("testuser1","testpwd1", "11-21-2015", booleancallback),
        //couch_module.user.checkinfo("testuser1",bodycallback),
        couch_module.group.create("testgroup1","testowner1",booleancallback),
        couch_module.group.adduser("testgroup1","user2",booleancallback),
	couch_module.group.checkuser("testgroup1","user3",booleancallback),
        couch_module.group.checkowner("testgroup1","testowner1",booleancallback),
	couch_module.group.adduser("testgroup1","user3",booleancallback),
	couch_module.group.removeuser("testgroup1","user2",booleancallback),
      ]

functions[0];
*/

function mochacallback(err,response)
{
	return response;
}



describe('User', function() {
  describe('#userbasicfns()', function() {
    it('should create user without error', function(done) {
      couch_module.user.create("testuser1","testpwd1", "11-21-2015", done)
    });
    it('should checkinfo without error', function(done) {
      couch_module.user.checkinfo("testuser1", done)
    });
    it('should change user pass without error', function(done) {
      couch_module.user.changepassword("testuser1", "newpwd", done)
    });
  });
});

describe('Group', function() {
  describe('#groupbasicfns()', function() {
    it('should create group without error', function(done) {
      couch_module.group.create("testgroup1","testowner1",done)
    });
    it('should adduser without error', function(done) {
      couch_module.group.adduser("testgroup1","user2",done)
    });
    it('should checkuser without error', function(done) {
      couch_module.group.checkuser("testgroup1","user3",done)
    });
  });
});


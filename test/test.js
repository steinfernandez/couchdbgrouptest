var couch_module = require("../couch_module.js");
var assert = require('assert');

/*
function done(result)
{
	console.log("haha stuff also here is your result: ");
	console.log(result);
	if(result == true)
	{
		stepnum++;
		functions[stepnum];
	}
	return;
}

function bodycallback(body)
{
	console.log("here is your body result");
	console.log(body);
	return;
}

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

var CR_true = true;
var CR_filecheck_basic1 = "this is a test gibber doc";
var CR_filecheck_basic2 = "this is an edited test gibber doc";


function callbackfn(err,response)
{	
	if((!err)&&(this[0] == response))
		this[1]();
	else 
	{
		console.log("this is response"+response[0].text);
		if((!err)&&(this[0] == response[0].text))
			this[1]();
	}
}



describe('Basic User Functions', function() {
  describe('#userbasicfns()', function() {
    it('should create user without error', function(done) {
      couch_module.user.create("testuser1","testpwd1", "11-21-2015", callbackfn.bind([CR_true,done]))
    });
    it('should checkinfo without error', function(done) {
      couch_module.user.checkinfo("testuser1", callbackfn.bind([CR_true,done]))
    });
    it('should change user pass without error', function(done) {
      couch_module.user.changepassword("testuser1", "newpwd", callbackfn.bind([CR_true,done]))
    });
    it('should delete without error', function(done) {
      couch_module.user.destroy("testuser1", callbackfn.bind([CR_true,done]))
    });
  });
});

describe('Basic Group Functions', function() {
  describe('#groupbasicfns()', function() {
    it('should create group without error', function(done) {
      couch_module.group.create("testgroup1","testowner1",callbackfn.bind([CR_true,done]))
    });
    it('should adduser without error', function(done) {
      couch_module.group.adduser("testgroup1","user2",callbackfn.bind([CR_true,done]))
    });
    it('should checkuser without error', function(done) {
      couch_module.group.checkuser("testgroup1","user2",callbackfn.bind([CR_true,done]))
    });
    it('should checkowner without error', function(done) {
      couch_module.group.checkowner("testgroup1","testowner1",callbackfn.bind([CR_true,done]))
    });
    it('should removeuser without error', function(done) {
      couch_module.group.removeuser("testgroup1","user2",callbackfn.bind([CR_true,done]))
    });
    it('should deletegroup without error', function(done) {
      couch_module.group.destroy("testgroup1",callbackfn.bind([CR_true,done]))
    });
  });
});

describe('Basic File Functions', function() {
  describe('#filebasicfns()', function() {
    it('should create file without error', function(done) {
      couch_module.file.publish("user1","testfile1","this is a test gibber doc","1-1-2016",callbackfn.bind([CR_true,done]))
    });
    it('checking file contents', function(done) {
      couch_module.user.checkreadaccessfile("user1","gibbertest/publications/user1testfile1",callbackfn.bind([CR_filecheck_basic1,done]))
    });
    it('should edit file without error', function(done) {
      couch_module.file.edit("gibbertest/publications/user1testfile1","this is an edited test gibber doc",callbackfn.bind([CR_true,done]))
    });
    it('checking file contents', function(done) {
      couch_module.user.checkreadaccessfile("user1","gibbertest/publications/user1testfile1",callbackfn.bind([CR_filecheck_basic2,done]))
    });
  });
});




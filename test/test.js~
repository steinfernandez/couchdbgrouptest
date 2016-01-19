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

var FC_truecheck = "truecheck";
var FC_emptycheck = "emptycheck";
var FC_errcheck = "errcheck";
var FC_text = "text";
var CR_empty = [];
var CR_true = true;
var CR_filecheck_basic1 = "this is a test gibber doc";
var CR_filecheck_basic2 = "this is an edited test gibber doc";

function callbackfn(err,response)
{	
	if(this[2] == FC_truecheck)
	{
	if((!err)&&(this[0] == response))
		this[1]();
	}
	else if(this[2] == FC_emptycheck)
	{
		//console.log("thisisresponse");
		//console.log(response.length);
		//console.log(CR_empty);
		if((!err)&&(0 == response.length))
		this[1]();
	}
	else if(this[2] == FC_errcheck)
	{
		console.log("this is errcheck response");
		console.log(response);
		console.log(err);
		if(response == false)
		{
			this[1]();
			console.log("failed successfully");
		}
	}
	else 
	{
		console.log("this is response"+response[0][this[2]]);
		if((!err)&&(this[0] == response[0][this[2]]))
			this[1]();
	}
}



describe('Basic User Functions', function() {
  describe('#userbasicfns()', function() {
    it('should create user without error', function(done) {
      couch_module.user.create("testuser1","testpwd1", "11-21-2015", callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should fail to create user', function(done) {
      couch_module.user.create("testuser1","testpwd1", "11-21-2015", callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('should checkinfo without error', function(done) {
      couch_module.user.checkinfo("testuser1", callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should checkinfo with error', function(done) {
      couch_module.user.checkinfo("Verchielle, Angel of Affection and Nobility", callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('should change user pass without error', function(done) {
      couch_module.user.changepassword("testuser1", "newpwd", callbackfn.bind([CR_true,done,FC_truecheck]))
    });
/*    it('should change user pass with error', function(done) {
      couch_module.user.changepassword("Abdielle, Angel of Loyalty", "newpwd", callbackfn.bind([CR_true,done,FC_errcheck]))
    });*/
    it('should delete without error', function(done) {
      couch_module.user.destroy("testuser1", callbackfn.bind([CR_true,done,FC_truecheck]))
    });
/*    it('should delete with error', function(done) {
      couch_module.user.destroy("Lelielle, the Jaws of God", callbackfn.bind([CR_true,done,FC_errcheck]))
    });*/
    it('should create user without error', function(done) {
      couch_module.user.create("testuser1","testpwd1", "11-21-2015", callbackfn.bind([CR_true,done,FC_truecheck]))
    });
  });
});

describe('Basic Group Functions', function() {
  describe('#groupbasicfns()', function() {
    it('should create group without error', function(done) {
      couch_module.group.create("testgroup1","testowner1",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should adduser without error', function(done) {
      couch_module.group.adduser("testgroup1","user2",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should checkuser without error', function(done) {
      couch_module.group.checkuser("testgroup1","user2",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should checkowner without error', function(done) {
      couch_module.group.checkowner("testgroup1","testowner1",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should removeuser without error', function(done) {
      couch_module.group.removeuser("testgroup1","user2",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should deletegroup without error', function(done) {
      couch_module.group.destroy("testgroup1",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
  });
});

describe('Basic File Functions', function() {
  describe('#filebasicfns()', function() {
    it('should create file without error', function(done) {
      couch_module.file.publish("testuser1","testfile1","this is a test gibber doc","1-1-2016",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('checking file contents', function(done) {
      couch_module.user.checkreadaccessfile("testuser1","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic1,done,FC_text]))
    });
    it('should edit file without error', function(done) {
      couch_module.file.edit("gibbertest/publications/testuser1testfile1","this is an edited test gibber doc",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('checking file contents', function(done) {
      couch_module.user.checkreadaccessfile("testuser1","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
  });
});

describe('Access Rights', function() {
  describe('#accessrights()', function() {
    it('user_checkreadaccessall', function(done) {
      couch_module.user.checkreadaccessall("testuser1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('user_checkwriteaccessall', function(done) {
      couch_module.user.checkwriteaccessall("testuser1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('user_checkreadaccessfile', function(done) {
      couch_module.user.checkreadaccessfile("testuser1","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('user_checkwriteaccessfile', function(done) {
      couch_module.user.checkwriteaccessfile("testuser1","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('file_addreadaccess', function(done) {
      couch_module.file.addreadaccess("gibbertest/publications/testuser1testfile1","magicuser",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('user_checkreadaccessfile', function(done) {
      couch_module.user.checkreadaccessfile("magicuser","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('file_remreadaccess', function(done) {
      couch_module.file.remreadaccess("gibbertest/publications/testuser1testfile1","magicuser",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('user_checkreadaccessfile', function(done) {
      couch_module.user.checkreadaccessfile("magicuser","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_empty,done,FC_emptycheck]))
    });
    it('file_addwriteaccess', function(done) {
      couch_module.file.addwriteaccess("gibbertest/publications/testuser1testfile1","magicuser",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('user_checkwriteaccessfile', function(done) {
      couch_module.user.checkwriteaccessfile("magicuser","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('file_remwriteaccess', function(done) {
      couch_module.file.remwriteaccess("gibbertest/publications/testuser1testfile1","magicuser",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('user_checkwriteaccessfile', function(done) {
      couch_module.user.checkwriteaccessfile("magicuser","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_empty,done,FC_emptycheck]))
    });
    it('file_addgroupreadaccess', function(done) {
      couch_module.file.addgroupreadaccess("gibbertest/publications/testuser1testfile1","fateburn",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('group_checkreadaccessfile', function(done) {
      couch_module.group.checkreadaccessfile("fateburn","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('file_remgroupreadaccess', function(done) {
      couch_module.file.remgroupreadaccess("gibbertest/publications/testuser1testfile1","fateburn",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('group_checkreadaccessfile', function(done) {
      couch_module.group.checkreadaccessfile("fateburn","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_empty,done,FC_emptycheck]))
    });
    it('file_addgroupwriteaccess', function(done) {
      couch_module.file.addgroupwriteaccess("gibbertest/publications/testuser1testfile1","fateburn",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('group_checkwriteaccessfile', function(done) {
      couch_module.group.checkwriteaccessfile("fateburn","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('file_remgroupwriteaccess', function(done) {
      couch_module.file.remgroupwriteaccess("gibbertest/publications/testuser1testfile1","fateburn",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('group_checkwriteaccessfile', function(done) {
      couch_module.group.checkwriteaccessfile("fateburn","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_empty,done,FC_emptycheck]))
    });
  });
});



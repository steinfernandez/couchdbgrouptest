var couch_module = require("../couch_module.js");
var assert = require('assert');

var FC_truecheck = "truecheck";
var FC_emptycheck = "emptycheck";
var FC_errcheck = "errcheck";
var FC_text = "text";
var CR_empty = [];
var CR_true = true;
var CR_filecheck_basic1 = "this is a test gibber doc";
var CR_filecheck_basic2 = "this is an edited test gibber doc";


/* Upon completion of each function, this function is called to check the results based on the values bound to it. 
this[0] - expected return value. only used for FC_truecheck.
this[1] - done function to be called on successful completion of the test.
this[2] - type of test. this is used to determine which part of the response should be checked and how. 
 */
function callbackfn(err,response)
{	
	if(this[2] == FC_truecheck)
	{
	if((!err)&&(this[0] == response))
		this[1]();
	}
	else if(this[2] == FC_emptycheck)
	{
		if((!err)&&(0 == response.length))
		this[1]();
	}
	else if(this[2] == FC_errcheck)
	{
		if(response == false)
		{
			this[1]();
		}
	}
	else 
	{
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
    it('should change user pass with error', function(done) {
      couch_module.user.changepassword("Abdielle, Angel of Loyalty", "newpwd", callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('should delete without error', function(done) {
      couch_module.user.destroy("testuser1", callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should delete with error', function(done) {
      couch_module.user.destroy("Lelielle, the Jaws of God", callbackfn.bind([CR_true,done,FC_errcheck]))
    });
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
    it('should edit file with error', function(done) {
      couch_module.file.edit("Gaghielle, Roaring Beast of God","this is an edited test gibber doc",callbackfn.bind([CR_true,done,FC_errcheck]))
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
    it('file_addreadaccessfail', function(done) {
      couch_module.file.addreadaccess("imaginaryfile","magicuser",callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('user_checkreadaccessfile', function(done) {
      couch_module.user.checkreadaccessfile("magicuser","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('file_remreadaccess', function(done) {
      couch_module.file.remreadaccess("gibbertest/publications/testuser1testfile1","magicuser",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('file_remreadaccessfail', function(done) {
      couch_module.file.remreadaccess("imaginaryfile","magicuser",callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('user_checkreadaccessfile', function(done) {
      couch_module.user.checkreadaccessfile("magicuser","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_empty,done,FC_emptycheck]))
    });
    it('file_addwriteaccess', function(done) {
      couch_module.file.addwriteaccess("gibbertest/publications/testuser1testfile1","magicuser",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('file_addwriteaccessfail', function(done) {
      couch_module.file.addwriteaccess("imaginaryfile","magicuser",callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('user_checkwriteaccessfile', function(done) {
      couch_module.user.checkwriteaccessfile("magicuser","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('file_remwriteaccess', function(done) {
      couch_module.file.remwriteaccess("gibbertest/publications/testuser1testfile1","magicuser",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('file_remwriteaccessfail', function(done) {
      couch_module.file.remwriteaccess("imaginaryfile","magicuser",callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('user_checkwriteaccessfile', function(done) {
      couch_module.user.checkwriteaccessfile("magicuser","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_empty,done,FC_emptycheck]))
    });
    it('file_addgroupreadaccess', function(done) {
      couch_module.file.addgroupreadaccess("gibbertest/publications/testuser1testfile1","fateburn",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('file_addgroupreadaccessfail', function(done) {
      couch_module.file.addgroupreadaccess("imaginaryfile","fateburn",callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('group_checkreadaccessfile', function(done) {
      couch_module.group.checkreadaccessfile("fateburn","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('file_remgroupreadaccess', function(done) {
      couch_module.file.remgroupreadaccess("gibbertest/publications/testuser1testfile1","fateburn",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('file_remgroupreadaccessfail', function(done) {
      couch_module.file.remgroupreadaccess("imaginaryfile","fateburn",callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('group_checkreadaccessfile', function(done) {
      couch_module.group.checkreadaccessfile("fateburn","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_empty,done,FC_emptycheck]))
    });
    it('file_addgroupwriteaccess', function(done) {
      couch_module.file.addgroupwriteaccess("gibbertest/publications/testuser1testfile1","fateburn",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('file_addgroupwriteaccessfail', function(done) {
      couch_module.file.addgroupwriteaccess("imaginaryfile","fateburn",callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('group_checkwriteaccessfile', function(done) {
      couch_module.group.checkwriteaccessfile("fateburn","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('file_remgroupwriteaccess', function(done) {
      couch_module.file.remgroupwriteaccess("gibbertest/publications/testuser1testfile1","fateburn",callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('file_remgroupwriteaccessfail', function(done) {
      couch_module.file.remgroupwriteaccess("imaginaryfile","fateburn",callbackfn.bind([CR_true,done,FC_errcheck]))
    });
    it('group_checkwriteaccessfile', function(done) {
      couch_module.group.checkwriteaccessfile("fateburn","gibbertest/publications/testuser1testfile1",callbackfn.bind([CR_empty,done,FC_emptycheck]))
    });
  });
});



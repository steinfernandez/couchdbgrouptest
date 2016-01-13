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
var FC_text = "text";
var CR_true = true;
var CR_filecheck_basic1 = "this is a test gibber doc";
var CR_filecheck_basic2 = "this is an edited test gibber doc";
var CR_designdoc_1 =  { _id: 'gibbertest/publications/user1testfile1',
  _rev: '1-549dab7f9f22a3d735e400d5248c1ace',
  type: 'publication',
  author: 'user1',
  readaccess: [ 'user1' ],
  writeaccess: [ 'user1' ],
  groupreadaccess: [],
  groupwriteaccess: [],
  publicationDate: '1-1-2016',
  text: 'this is a test gibber doc',
  _revs_info: 
   [ { rev: '1-549dab7f9f22a3d735e400d5248c1ace',
       status: 'available' } ] };


function callbackfn(err,response)
{	
	if(this[2] == "truecheck")
	{
	if((!err)&&(this[0] == response))
		this[1]();
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
    it('should checkinfo without error', function(done) {
      couch_module.user.checkinfo("testuser1", callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should change user pass without error', function(done) {
      couch_module.user.changepassword("testuser1", "newpwd", callbackfn.bind([CR_true,done,FC_truecheck]))
    });
    it('should delete without error', function(done) {
      couch_module.user.destroy("testuser1", callbackfn.bind([CR_true,done,FC_truecheck]))
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
  });
});

describe('User Design Doc Functions', function() {
  describe('#userddbasicfns()', function() {
    it('user_checkreadaccessall', function(done) {
      couch_module.user.checkreadaccessall("testuser1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('user_checkwriteaccessall', function(done) {
      couch_module.user.checkwriteaccessall("testuser1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('user_checkreadaccessfile', function(done) {
      couch_module.user.checkreadaccessall("testuser1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('user_checkwriteaccessfile', function(done) {
      couch_module.user.checkwriteaccessall("testuser1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
    it('user_checkwriteaccessfile', function(done) {
      couch_module.user.checkwriteaccessall("testuser1",callbackfn.bind([CR_filecheck_basic2,done,FC_text]))
    });
  });
});


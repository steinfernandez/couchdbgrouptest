var couch_module = require("./couch_module.js");
var queue = require('queue');
 
var q = queue();

function user_obj()
{
	this.create = User_Create;
	this.destroy = User_Destroy;
	this.checkinfo = User_CheckInfo;
	this.changepassword = User_ChangePassword;
	this.checkreadaccessall = User_CheckReadAccessAll;
	this.checkwriteaccessall = User_CheckWriteAccessAll;
	this.checkwriteaccessfile = User_CheckWriteAccessFile;
	this.checkreadaccessfile = User_CheckReadAccessFile;
}

function group_obj()
{
	this.create = Group_Create;
	this.destroy = Group_Destroy;
	this.adduser = Group_AddUser;
	this.removeuser = Group_RemoveUser;
	this.checkuser = Group_CheckUser;
	this.checkowner = Group_CheckOwner;
	this.checkreadaccessfile = Group_CheckReadAccessFile;
	this.checkwriteaccessfile = Group_CheckWriteAccessFile;
}

function file_obj()
{
	this.publish = File_Publish;
	this.edit = File_Edit;
}

var user = new user_obj();
var group = new group_obj();
var file = new file_obj();

var queuehandler = {
	user : user,
	group : group,
	file : file
};

module.exports = queuehandler;

var isempty = true;

q.concurrency = 1;
q.timeout = 1000; 


q.on('timeout', function(next, job) {
  console.log('job timed out:', job.toString().replace(/\n/g, ''));
  next();
});

function ensurequeue()
{
	if(isempty)
	{
		isempty = !isempty;
		q.start(function(err) {
		  console.log('all done:');
		});
	}
}

function createCallback(err,response,cb,queuecb)
{
	return function(){
	cb(err,response);
	queuecb();
	}
}


function User_Create(username,password,date,cb)
{
	q.push(function(queuecb){couch_module.user.create(username,password,date,(err,response) => {cb(err,response); queuecb();})});
	ensurequeue();
}

function User_Destroy(username,cb)
{
	q.push(couch_module.user.destroy(username,cb));
	ensurequeue();
}

function User_CheckInfo(username,cb)
{
	q.push(couch_module.user.checkinfo(username,cb));
	ensurequeue();
}

function User_ChangePassword(username,newpwd,cb)
{
	q.push(couch_module.user.create(username,newpwd,cb));
	ensurequeue();
}

function User_CheckReadAccessAll(username,cb)
{
	q.push(couch_module.user.checkreadaccessall(username,cb));
	ensurequeue();
}

function User_CheckWriteAccessAll(username,cb)
{
	q.push(couch_module.user.checkwriteaccessall(username,cb));
	ensurequeue();
}

function User_CheckReadAccessFile(username,filename,cb)
{
	q.push(couch_module.user.checkreadaccessfile(username,filename,cb));
	ensurequeue();
}

function User_CheckWriteAccessFile(username,filename,cb)
{
	q.push(couch_module.user.checkwriteaccessfile(username,filename,cb));
	ensurequeue();
}

function File_Publish(username,filename,text,date,cb)
{
	q.push(couch_module.file.publish(username,filename,text,date,cb));
	ensurequeue();
}

function File_Edit(filename,newtext,cb)
{
	q.push(couch_module.file.edit(filename,newtext,cb));
	ensurequeue();
}

function Group_Create(groupname,owner,cb)
{
	q.push(couch_module.group.create(groupname,owner,cb));
	ensurequeue();
}

function Group_Destroy(groupname,cb)
{
	q.push(couch_module.group.destroy(groupname,cb));
	ensurequeue();
}

function Group_AddUser(groupname,newuser,cb)
{
	q.push(couch_module.group.adduser(groupname,newuser,cb));
	ensurequeue();
}

function Group_RemoveUser(groupname,remuser,cb)
{
	q.push(couch_module.group.removeuser(groupname,remuser,cb));
	ensurequeue();
}

function Group_CheckUser(groupname,checkuser,cb)
{
	q.push(couch_module.group.checkuser(groupname,checkuser,cb));
	ensurequeue();
}

function Group_CheckOwner(groupname,checkowner,cb)
{
	q.push(couch_module.group.checkowner(groupname,checkowner,cb));
	ensurequeue();
}

function Group_CheckReadAccessFile(groupname, filename, cb)
{
	q.push(couch_module.group.checkreadaccessfile(groupname, filename, cb));
	ensurequeue();
}

function Group_CheckWriteAccessFile(groupname, filename, cb)
{
	q.push(couch_module.group.checkwriteaccessfile(groupname, filename, cb));
	ensurequeue();
}



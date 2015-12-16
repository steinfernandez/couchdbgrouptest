var couch_module = require("./couch_module.js");
var queue = require('queue');
 
var q = queue();

function user_obj()
{
	this.create = User_Create;
	this.destroy = User_Destroy;
	this.checkinfo = User_CheckInfo;
	this.changepassword = User_ChangePassword;
	//this.checkreadaccessall = User_CheckReadAccessAll;
	//this.checkwriteaccessall = User_CheckWriteAccessAll;
	//this.checkwriteaccessfile = User_CheckWriteAccessFile;
	//this.checkreadaccessfile = User_CheckReadAccessFile;
}

var user = new user_obj();

var queuehandler = {
	user : user
};

module.exports = queuehandler;

var isempty = true;

function User_Create(username,password,date,cb)
{
	q.push(couch_module.user.create(username,password,date,cb));
	if(isempty)
	{
		isempty = !isempty;
		q.start(function(err) {
		  console.log('all done:');
		});
	}
}

function User_Destroy(username,cb)
{
	q.push(couch_module.user.destroy(username,cb));
	if(isempty)
	{
		isempty = !isempty;
		q.start(function(err) {
		  console.log('all done:');
		});
	}
}

function User_CheckInfo(username,cb)
{
	q.push(couch_module.user.checkinfo(username,cb));
}

function User_ChangePassword(username,newpwd,cb)
{
	q.push(couch_module.user.create(username,newpwd,cb));
}





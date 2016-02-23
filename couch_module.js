/* jshint node: true, couch: true, esversion: 6 */
/*eslint no-undef: 0, no-unused-vars: 0*/

var nano = require("nano")("http://admin:admin@localhost:5984");
var blah = nano.db.use("gibbertest");

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
	this.setmetadata = File_SetMetadata;
	this.setispublic = File_SetIsPublic;
	this.addreadaccess = File_AddReadAccess;
	this.remreadaccess = File_RemReadAccess;
	this.addwriteaccess = File_AddWriteAccess;
	this.remwriteaccess = File_RemWriteAccess;
	this.addgroupreadaccess = File_AddGroupReadAccess;
	this.remgroupreadaccess = File_RemGroupReadAccess;
	this.addgroupwriteaccess = File_AddGroupWriteAccess;
	this.remgroupwriteaccess = File_RemGroupWriteAccess;
}

var user = new user_obj();
var group = new group_obj();
var file = new file_obj();

var couch_module = {
	user : user,
	group : group,
	file : file
};

module.exports = couch_module;

function User_Create(username,password,date,cb)
{
	var result = false;
	blah.insert({"type": "user","password": password,"joinDate": date,"website": "","affiliation": "","email": "","following": [],"friends": []}, username, function(err, body) {
	if (!err)	
		cb(err,true);
	else
		cb(err,false);
	});
}


function User_CheckInfo(username,cb)
{
	var result = false;
	blah.get(username, { revs_info: true }, function(err, body) {
	if(!err)
		result = body;
	cb(err,result);
	});
}

/*This function, and all other functions that modify a document work by using the get function to find the appropriate document, reading it and then overwriting it with the modified values.*/
function User_ChangePassword(username,newpwd,cb)
{
	var result = false;
	var newbody = {"type": "user","password": "","joinDate": "","website": "","affiliation": "","email": "","following": [],"friends": []};
	blah.get(username, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newbody = body;
		newbody.password = newpwd;
		blah.insert(newbody, username, function(err2, body) {
		if (!err2)
		{
			result = true;
			cb(err2,result);
		}
		});
	}
	cb(err1,result);
	});
}

function User_Destroy(username,cb)
{
	var result = false;
	blah.get(username, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		blah.destroy(username, body._rev, function(err2, body) {
		if (!err2)
		{
			result = true;
			cb(err2,result);
		}
		});
	}
	cb(err1,result);
	});	
}

function User_CheckReadAccessAll(username, cb)
{
	var response = [];
	blah.view("gibbertest", "userreadaccessall", {"key":username},function(err, body) {
	if (!err)
		body.rows.forEach(function(doc) {response.push(doc.value);});
	cb(err,response);
	});
}

function User_CheckWriteAccessAll(username, cb)
{
	var response = [];
	blah.view("gibbertest", "userwriteaccessall", {"key":username},function(err, body) {
	if (!err)
		body.rows.forEach(function(doc) {response.push(doc.value);});
	cb(err,response);
	});
}

function User_CheckReadAccessFile(username, filename, cb)
{
	var response = [];
	blah.view("gibbertest", "userreadaccessfile", {"key":[username,filename]},function(err, body) {
	if (!err)
		body.rows.forEach(function(doc) {response.push(doc.value);});
	cb(err,response);
	});
}

function User_CheckWriteAccessFile(username, filename, cb)
{
	var response = [];
	blah.view("gibbertest", "userwriteaccessfile", {"key":[username,filename]},function(err, body) {
	if (!err)
		body.rows.forEach(function(doc) {response.push(doc.value);});
	cb(err,response);
	});
}

function File_Publish(username,filename,text,date,language,tags,notes,cb)
{
	blah.insert({type: "publication", "author": username, "isPublic": false,"readaccess":[username],"writeaccess":[username],"groupreadaccess":[],"groupwriteaccess":[],"publicationDate":date, "lastModified":date, "language": language, "tags": tags, "notes": notes, "text":text}, "gibbertest/publications/"+username+filename, function(err, body) {
	var result = false;
	if (!err)
		result = true;
	cb(err,result);
	});
}

function File_Edit(filename,newtext,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		newfile.text = newtext;
		var date = new Date(),day  = date.getDate(),month = date.getMonth() + 1,year = date.getFullYear(),time = date.toLocaleTimeString();
		newfile.lastModified = [year,month,day,time];
		blah.insert(newfile, filename, function(err2, body) {
	if (!err2)
	{
		result = true;
		cb(err2,result);
	}
	});
	}
	cb(err1,result);
	});
}

function File_SetMetadata(filename,newlanguage,newtags,newnotes,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		newfile.language = newlanguage;
		newfile.notes = newnotes;
		newfile.tags = newfile.tags.concat(newtags);
		var date = new Date(),day  = date.getDate(),month = date.getMonth() + 1,year = date.getFullYear(),time = date.toLocaleTimeString();
		newfile.lastModified = [year,month,day,time];
		blah.insert(newfile, filename, function(err2, body) {
	if (!err2)
	{
		result = true;
		cb(err2,result);
	}
	});
	}
	cb(err1,result);
	});
}

function File_SetIsPublic(filename,isPublic,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		newfile.isPublic = isPublic;
		blah.insert(newfile, filename, function(err2, body) {
		if (!err2)
		{
			result = true;
			cb(err2,result);
		}
		});
	}
	cb(err1,result);
	});
}

function File_AddReadAccess(filename,newuser,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		if (newfile.readaccess.indexOf(newuser) == -1)
			newfile.readaccess.push(newuser);
		blah.insert(newfile, filename, function(err2, body) {
		if (!err2)
		{
			result = true;
			cb(err2,result);
		}
		});
	}
	cb(err1,result);
	});
}

function File_RemReadAccess(filename,remuser,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		var i = newfile.readaccess.indexOf(remuser);
		if(i != -1) 
			newfile.readaccess.splice(i, 1);
		blah.insert(newfile, filename, function(err2, body) {
		if (!err2)
		{
			result = true;
			cb(err2,result);
		}
		});
	}
	cb(err1,result);
	});
}

function File_AddWriteAccess(filename,newuser,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		if (newfile.writeaccess.indexOf(newuser) == -1)
			newfile.writeaccess.push(newuser);
	blah.insert(newfile, filename, function(err2, body) {
	if (!err2)
	{
		result = true;
		cb(err2,result);
	}
	});
	}
	cb(err1,result);
	});
}

function File_RemWriteAccess(filename,remuser,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		var i = newfile.writeaccess.indexOf(remuser);
		if(i != -1) 
			newfile.writeaccess.splice(i, 1);
	blah.insert(newfile, filename, function(err2, body) {
	if (!err2)
	{
		result = true;
		cb(err2,result);
	}
	});
	}
	cb(err1,result);
	});
}

function File_AddGroupReadAccess(filename,newgroup,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		if (newfile.groupreadaccess.indexOf(newgroup) == -1)
			newfile.groupreadaccess.push(newgroup);
	blah.insert(newfile, filename, function(err2, body) {
	if (!err2)
	{
		result = true;
		cb(err2,result);
	}
	});
	}
	cb(err1,result);
	});
}

function File_RemGroupReadAccess(filename,remgroup,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		var i = newfile.groupreadaccess.indexOf(remgroup);
		if(i != -1) 
			newfile.groupreadaccess.splice(i, 1);
	blah.insert(newfile, filename, function(err2, body) {
	if(!err2)
	{
		result = true;
		cb(err2,result);
	}
	});
	}
	cb(err1,result);
	});
}

function File_AddGroupWriteAccess(filename,newgroup,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		if (newfile.groupwriteaccess.indexOf(newgroup) == -1)
			newfile.groupwriteaccess.push(newgroup);
	blah.insert(newfile, filename, function(err2, body) {
	if(!err2)
	{
		result = true;
		cb(err2,result);
	}
	});
	}
	cb(err1,result);
	});
}

function File_RemGroupWriteAccess(filename,remgroup,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "isPublic":"","readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","lastModified":"","language":"","tags":"","notes":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		var i = newfile.groupwriteaccess.indexOf(remgroup);
		if(i != -1) 
			newfile.groupwriteaccess.splice(i, 1);
	blah.insert(newfile, filename, function(err2, body) {
	if (!err2)
	{
		result = true;
		cb(err2,result);
	}
	});
	}
	cb(err1,result);
	});
}

function Group_Create(groupname,owner,cb)
{
	blah.insert({"owner": owner,"type": "group","members": [owner]}, groupname, function(err, body) {
	var result = false;
	if (!err)
		result = true;
	cb(err,result);
	});
}

function Group_Destroy(groupname,cb)
{
	blah.get(groupname, { revs_info: true }, function(err, body) {
	blah.destroy(groupname, body._rev, function(err, body) {
	var result = false;
	if (!err)
		result = true;
	cb(err,result);
	});    
	});
}

function Group_AddUser(groupname,newuser,cb)
{
	var newfile = {"owner": "","type": "group","members": []};
	blah.get(groupname, { revs_info: true }, function(err, body) {
	if (!err)
	{	
		newgroup = body;
		newgroup.members.push(newuser);
		blah.insert(newgroup, groupname, function(err, body) {
		var result = false;
		if (!err)
			result = true;
		cb(err,result);
		});
	}
	});
}

function Group_RemoveUser(groupname,remuser,cb)
{
	var newfile = {"owner": "","type": "group","members": []};
	var index = -1;
	blah.get(groupname, function(err, body) {
	if (!err)
	{	
		newgroup = body;
		for(i=0;i<newgroup.members.length;i++)
		{
			if(newgroup.members[i] == remuser)
			{
				index = i;
				break;
			}
		}
		if (index > -1) 
		{
			newgroup.members.splice(index, 1);
		}
		blah.insert(newgroup, groupname, function(err, body) {
		var result = false;
		if(!err)
			result = true;
		cb(err,result);
		});
	}
	});	
}

function Group_CheckUser(groupname,checkuser,cb)
{
	var newfile = {"owner": "","type": "group","members": []};
	var found = false;
	blah.get(groupname, function(err, body) {
	if (!err)
	{	
		newgroup = body;
		for(i=0;i<newgroup.members.length;i++)
		{
			if(newgroup.members[i] == checkuser)
			{
				found = true;
				break;
			}
		}
	}
	cb(err,found);
	});
}

function Group_CheckOwner(groupname,checkowner,cb)
{
	var newfile = {"owner": "","type": "group","members": []};
	var found = false;
	blah.get(groupname, function(err, body) {
	if (!err)
	{	
		newgroup = body;
		if(newgroup.owner == checkowner)
			found = true;
	}
	cb(err,found);
	});
}

function Group_CheckReadAccessFile(groupname, filename, cb)
{
	var response = [];
	blah.view("gibbertest", "groupreadaccessfile", {"key":[groupname,filename]},function(err, body) {
	if(!err)
	{
		body.rows.forEach(function(doc) {response.push(doc.value);});
	}
	cb(err,response);
	});
}

function Group_CheckWriteAccessFile(groupname, filename, cb)
{
	var response = [];
	blah.view("gibbertest", "groupwriteaccessfile", {"key":[groupname,filename]},function(err, body) {
	if(!err)
	{
		body.rows.forEach(function(doc) {response.push(doc.value);});
	}
	cb(err,response);
	});
}


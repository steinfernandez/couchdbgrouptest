var nano = require('nano')('http://admin:admin@localhost:5984');
var blah = nano.db.use('gibbertest');

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

/**
 * Creates a new user.
 * @param {string} username - The name of the user to be created.
 * @param {string} password - The password of the user to be created.
 * @param {string} date - The current date.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function User_Create(username,password,date,cb)
{
	var result = false;
	blah.insert({"type": "user","password": password,"joinDate": date,"website": "","affiliation": "","email": "","following": [],"friends": []}, username, function(err, body) {
  if (!err)
    {	//console.log(body);
	cb(err,true);
}
else
	{
	//console.log(err);
	cb(err,false);
	}
});
}

/**
 * Retrieves info for a specified user.
 * @param {string} username - The name of the user whose info is to be retrieved.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function User_CheckInfo(username,cb)
{
	var result = false;
	blah.get(username, { revs_info: true }, function(err, body) {
 //console.log(body);
  if (!err)
	result = true;
  cb(err,result);
});
}

/**
 * Changes password for a specified user.
 * @param {string} username - The name of the user whose password is to be changed.
 * @param {string} newpwd - The new password.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function User_ChangePassword(username,newpwd,cb)
{
	var result = false;
	var newbody = {"type": "user","password": "","joinDate": "","website": "","affiliation": "","email": "","following": [],"friends": []};
	blah.get(username, { revs_info: true }, function(err1, body) {
	if (!err1)
    {	
		//console.log(body);
		newbody = body;
		newbody.password = newpwd;
	//console.log(newbody);
	blah.insert(newbody, username, function(err2, body) {
  //console.log(body);
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

/**
 * Deletes a specified user.
 * @param {string} username - The name of the user to be deleted.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
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

/**
 * Return all files that a specified user can read
 * @param {string} username - The name of the user whose readable files are to be retrieved.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function User_CheckReadAccessAll(username, cb)
{
	var response = [];
	blah.view("gibbertest", 'userreadaccessall', {"key":username},function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      response.push(doc.value);
    }
);
  }
  if (!err)
	result = true;
  cb(err,response);
});
}

/**
 * Return all files that a specified user can write
 * @param {string} username - The name of the user whose writable files are to be retrieved.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function User_CheckWriteAccessAll(username, cb)
{
	var response = [];
	blah.view("gibbertest", 'userwriteaccessall', {"key":username},function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      response.push(doc.value);
    }
);
  }
//console.log(err);
cb(err,response);
});
}

/**
 * Return a specific file if the specified user can read it
 * @param {string} username - The name of the user attempting to read the file.
 * @param {string} filename - The name of the file to be retrieved.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function User_CheckReadAccessFile(username, filename, cb)
{
	var response = [];
	blah.view("gibbertest", 'userreadaccessfile', {"key":[username,filename]},function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      response.push(doc.value);
    }
);
  }
cb(err,response);
});
}

/**
 * Return a specific file if the specified user can write to it
 * @param {string} username - The name of the user attempting to write to the file.
 * @param {string} filename - The name of the file to be retrieved.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function User_CheckWriteAccessFile(username, filename, cb)
{
	var response = [];
	blah.view("gibbertest", 'userwriteaccessfile', {"key":[username,filename]},function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      response.push(doc.value);
    }
);
  }
cb(err,response);
});
}

/**
 * Creates a new file
 * @param {string} username - The name of the user creating the file
 * @param {string} filename - The name of the file to be created.
 * @param {string} text - The contents of the file.
 * @param {string} date - The current date.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_Publish(username,filename,text,date,cb)
{
	blah.insert({type: "publication", "author": username, "readaccess":[username],"writeaccess":[username],"groupreadaccess":[],"groupwriteaccess":[],"publicationDate":date,"text":text}, "gibbertest/publications/"+username+filename, function(err, body) {
   var result = false;
  if (!err)
	result = true;
  cb(err,result);
});
}

/**
 * Edits an existing file
 * @param {string} filename - The name of the file to be edited.
 * @param {string} newtext - The new contents of the file.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_Edit(filename,newtext,cb)
{
 	var result = false;
	var newfile = {type: "publication", "author": "", "readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
   	{	
		newfile = body;
		newfile.text = newtext;
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

/**
 * Grants a user read access permissions for the specified file
 * @param {string} filename - The name of the relevant file.
 * @param {string} newuser - The name of the user to be granted permission.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_AddReadAccess(filename,newuser,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","text":""};
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

/**
 * Revokes a user's read access permissions for the specified file
 * @param {string} filename - The name of the relevant file.
 * @param {string} remuser - The name of the user whose permission is to be revoked
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_RemReadAccess(filename,remuser,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","text":""};
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

/**
 * Grants a user write access permissions for the specified file
 * @param {string} filename - The name of the relevant file.
 * @param {string} newuser - The name of the user to be granted permission.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_AddWriteAccess(filename,newuser,cb)
{
 	var result = false;
	var newfile = {type: "publication", "author": "", "readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","text":""};
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

/**
 * Revokes a user's write access permissions for the specified file
 * @param {string} filename - The name of the relevant file.
 * @param {string} remuser - The name of the user whose permission is to be revoked
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_RemWriteAccess(filename,remuser,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","text":""};
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

/**
 * Grants a group read access permissions for the specified file
 * @param {string} filename - The name of the relevant file.
 * @param {string} newgroup - The name of the group to be granted permission.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_AddGroupReadAccess(filename,newgroup,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","text":""};
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

/**
 * Revokes a group's read access permissions for the specified file
 * @param {string} filename - The name of the relevant file.
 * @param {string} remuser - The name of the group whose permission is to be revoked
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_RemGroupReadAccess(filename,remgroup,cb)
{
  	var result = false;
	var newfile = {type: "publication", "author": "", "readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
  	{	
		newfile = body;
		var i = newfile.groupreadaccess.indexOf(remgroup);
		if(i != -1) 
			newfile.groupreadaccess.splice(i, 1);
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


/**
 * Grants a group write access permissions for the specified file
 * @param {string} filename - The name of the relevant file.
 * @param {string} newgroup - The name of the group to be granted permission.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_AddGroupWriteAccess(filename,newgroup,cb)
{
	var result = false;
	var newfile = {type: "publication", "author": "", "readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","text":""};
	blah.get(filename, { revs_info: true }, function(err1, body) {
	if (!err1)
	{	
		newfile = body;
		if (newfile.groupwriteaccess.indexOf(newgroup) == -1)
			newfile.groupwriteaccess.push(newgroup);
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

/**
 * Revokes a group's write access permissions for the specified file
 * @param {string} filename - The name of the relevant file.
 * @param {string} remuser - The name of the group whose permission is to be revoked
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function File_RemGroupWriteAccess(filename,remgroup,cb)
{
  	var result = false;
	var newfile = {type: "publication", "author": "", "readaccess":"","writeaccess":"","groupreadaccess":[],"groupwriteaccess":[],"publicationDate":"","text":""};
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

/**
 * Creates a new group.
 * @param {string} groupname - The name of the group to be created.
 * @param {string} owner - The owner of the group to be created.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function Group_Create(groupname,owner,cb)
{
	blah.insert({"owner": owner,"type": "group","members": [owner]}, groupname, function(err, body) {
   var result = false;
  //console.log(body);
  if (!err)
	result = true;
  cb(err,result);
});
}

/**
 * Deletes the specified group.
 * @param {string} groupname - The name of the group to be deleted.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function Group_Destroy(groupname,cb)
{
	blah.get(groupname, { revs_info: true }, function(err, body) {
	blah.destroy(groupname, body._rev, function(err, body) {
   var result = false;
  //console.log(body);
  if (!err)
	result = true;
  cb(err,result);
});
    
});
	
}

/**
 * Adds a user to an existing group.
 * @param {string} groupname - The name of the group.
 * @param {string} newuser - The name of the user to be added.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
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
  //console.log(body);
  if (!err)
	result = true;
  cb(err,result);
});
    }
});
	
}

/**
 * Removes a user from an existing group.
 * @param {string} groupname - The name of the group.
 * @param {string} remuser - The name of the user to be removed.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
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
  if (!err)
	result = true;
  cb(err,result);
});
    }
});
	
}

/**
 * Checks if the specified user is a member of a group
 * @param {string} groupname - The name of the group.
 * @param {string} checkuser - The name of the user to be checked.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
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

/**
 * Checks if the specified user is the owner of a group
 * @param {string} groupname - The name of the group.
 * @param {string} checkuser - The name of the user to be checked.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function Group_CheckOwner(groupname,checkowner,cb)
{
	var newfile = {"owner": "","type": "group","members": []};
	var found = false;
	blah.get(groupname, function(err, body) {
	if (!err)
    {	
		newgroup = body;
		if(newgroup.owner == checkowner)
		{
			found = true;
		}
    }
	cb(err,found);
});
	
}

/**
 * Return a specific file if the specified group can read it
 * @param {string} groupname - The name of the group attempting to read the file.
 * @param {string} filename - The name of the file to be retrieved.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function Group_CheckReadAccessFile(groupname, filename, cb)
{
	var response = [];
	blah.view("gibbertest", 'groupreadaccessfile', {"key":[groupname,filename]},function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      response.push(doc.value);
    }
);
  }
cb(err,response);
});
}

/**
 * Return a specific file if the specified group can write to it
 * @param {string} groupname - The name of the group attempting to write to the file.
 * @param {string} filename - The name of the file to be retrieved.
 * @param {function} cb - The callback function in the form of cb(err,response).
 */
function Group_CheckWriteAccessFile(groupname, filename, cb)
{
	var response = [];
	blah.view("gibbertest", 'groupwriteaccessfile', {"key":[groupname,filename]},function(err, body) {
  if (!err) {
    body.rows.forEach(function(doc) {
      response.push(doc.value);
    }
);
  }
cb(err,response);
});
}


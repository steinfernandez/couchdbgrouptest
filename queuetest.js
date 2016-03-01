var queuehandler = require("./queuehandler.js");

function cb(err, response)
{
	console.log(response);
}



queuehandler.user.create("magicuser","magicuser","date",cb);
queuehandler.group.create("magicgroup","magicuser",cb);
queuehandler.group.adduser("gibbertest/groups/magicgroup","magicuser",cb);
//queuehandler.group.removeuser("gibbertest/groups/group0","magicuser",cb);
/*

queuehandler.file.addwriteaccess("gibbertest/publications/pub2","magicuser2",cb);
queuehandler.file.addgroupreadaccess("gibbertest/publications/pub2","magicgroup",cb);
queuehandler.file.addgroupwriteaccess("gibbertest/publications/pub2","magicgroup2",cb);*/

//queuehandler.file.remreadaccess("gibbertest/publications/pub2","user2",cb);

queuehandler.file.publish("user2","fileblah","textblah","dateblah","languageblah","tagsblah","notesblah",cb);
//queuehandler.file.addreadaccess("gibbertest/publications/user2fileblah","magicuser",cb);
//queuehandler.file.addgroupreadaccess("gibbertest/publications/user2fileblah","gibbertest/groups/magicgroup",cb);
//queuehandler.file.addwriteaccess("gibbertest/publications/user2fileblah","magicuser",cb);
queuehandler.file.addgroupwriteaccess("gibbertest/publications/user2fileblah","gibbertest/groups/magicgroup",cb);
queuehandler.user.authorizewrite("magicuser","gibbertest/publications/user2fileblah",cb);



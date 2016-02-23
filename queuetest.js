var queuehandler = require("./queuehandler.js");

function cb(err, response)
{
	console.log(response);
}




/*queuehandler.file.addreadaccess("gibbertest/publications/pub2","magicuser",cb);
queuehandler.file.addwriteaccess("gibbertest/publications/pub2","magicuser2",cb);
queuehandler.file.addgroupreadaccess("gibbertest/publications/pub2","magicgroup",cb);
queuehandler.file.addgroupwriteaccess("gibbertest/publications/pub2","magicgroup2",cb);*/

//queuehandler.file.remreadaccess("gibbertest/publications/pub2","user2",cb);

queuehandler.file.publish("userblah","fileblah","textblah","dateblah","languageblah","tagsblah","notesblah",cb);

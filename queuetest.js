var queuehandler = require("./queuehandler.js");

function cb(err, response)
{
	console.log(response);
}


//queuehandler.user.create("testuser1","testpwd1", "11-21-2015",cb);

queuehandler.user.checkreadaccessfile("user1","gibbertest/publications/pub1",cb);

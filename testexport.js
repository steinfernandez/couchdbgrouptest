var couch_module = require("./couch_module.js");


function booleancallback(result)
{
	console.log("haha stuff also here is your result: ");
	console.log(result);
}

function bodycallback(body)
{
	console.log("here is your body result");
	console.log(body);
}

var testusercreate = couch_module.user.create("testuser1","testpwd1", "11-21-2015", booleancallback);
var testusercheckinfo = couch_module.user.checkinfo("testuser1",bodycallback);

      functions = [
        couch_module.user.create("testuser1","testpwd1", "11-21-2015", booleancallback),
        couch_module.user.checkinfo("testuser1",bodycallback),
        makeUsers,
        makePubs,
	makeGroups,
        makeDesign,
        testDesign1,
	testDesign2,
	testDesign3,
	testDesign4,
	testDesign5,
	testDesign6,
	testDesign7
      ]


//group.create("testgroup1","testowner1");
//group.adduser("testgroup1","user2");
//group.checkuser("testgroup1","user3");
//group.checkowner("testgroup1","testowner1");
//group.adduser("testgroup1","user3");
//group.removeuser("testgroup1","user2");

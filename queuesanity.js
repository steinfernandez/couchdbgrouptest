/* This is a test to ensure that the queue executes synchronously i.e. waits for each task to complete before executing the next.*/


var queue = require('queue');
var assert = require('assert');
 
var q = queue();

q.timeout = 4000; 
q.concurrency = 1;	/* This is necessary for synchronous execution. Default behaviour is asynchronous.*/


var testString = ''

q.push(( cb ) => {
  setTimeout( () => { testString +=1; cb(); }, 3000 )
})

q.push(( cb ) => {
  console.log("testString: "+testString);
  cb(); 
})

q.push(( cb ) => {
  setTimeout( () => { testString +=2; cb(); }, 2000 )
})

q.push(( cb ) => {
  console.log("testString: "+testString);
  cb(); 
})


q.push(( cb ) => {
  setTimeout( () => { testString +=3; cb(); }, 1000 )
})


q.push(( cb ) => {
  console.log("testString: "+testString);
  cb();
})

q.push(( cb ) => {
  assert( testString === '123' ) ;
  cb();
})




q.start(function(err) {
		  console.log('all done:');
		});



function printstuff()
{
	console.log("testString after everything"+testString);
}

//setTimeout(printstuff,10000);


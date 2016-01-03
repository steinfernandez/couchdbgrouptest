var queue = require('queue');
var assert = require('assert');
 
var q = queue();

//q.timeout = 3000; 
q.concurrency = 1;
//q.timeout = 1000;

var testString = ''

q.push(( cb ) => {
  setTimeout( () => { testString +=1; cb(); }, 3000 )
})

q.push(( cb ) => {
  console.log("testString: "+testString) 
})

q.push(( cb ) => {
  setTimeout( () => { testString +=2; cb(); }, 2000 )
})

q.push(( cb ) => {
  console.log("testString: "+testString) 
})


q.push(( cb ) => {
  setTimeout( () => { testString +=3; cb(); }, 1000 )
})


q.push(( cb ) => {
  console.log("testString: "+testString) 
})

q.push(( cb ) => {
  assert( testString === '123' ) 
})




q.start(function(err) {
		  console.log('all done:');
		});



function printstuff()
{
	console.log("testString after everything"+testString);
}

//setTimeout(printstuff,10000);

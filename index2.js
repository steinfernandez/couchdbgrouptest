// NOTE: COOKIES DON'T WORKING USING LOCALHOST, MUST USE 127.0.0.1.
// node node_modules/gibber.server 8080 '/www/gibber.libraries/'
var request         = require( 'request' ),
    connect         = require( 'connect' ),
    url             = require( 'url' ),
    fs              = require( 'fs' ),
    passport        = require( 'passport' ),
    express         = require( 'express' ),
    sharejs         = require( 'share' ),
    shareCodeMirror = require( 'share-codemirror'),
    app             = express(),
    RedisStore      = require( 'connect-redis' )( express ),        
    server          = require( 'http' ).createServer( app ),
    util            = require( 'util' ),
    LocalStrategy   = require( 'passport-local' ).Strategy,  
    queryString     = require( 'querystring' ),
    rtc             = require( './gibber_rtc.js' )( server, process.argv[4] ),
    nodemailer      = require( 'nodemailer' ),
    transporter     = nodemailer.createTransport(),
    webServerPort   = process.argv[2] || 80, //second argument passed to command
    serverRoot      = process.argv[3] || __dirname + '/../../',
    users           = [],
    _url            = 'http://127.0.0.1:5984/gibber',
    designURI       = 'http://127.0.0.1:5984/gibber/_design/gibber/',
    searchURL       = 'http://127.0.0.1:5984/_fti/local/gibber/_design/fti/';

function findById(id, fn) {
  var idx = id;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn( null, null )
    //fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn)
{
	queuehandler.user.checkinfo(username, 
	function(err,response) 
	{
		if(response && !err)
		{
			var user = { username:response._id, password: response.password, id:users.length } // MUST GIVE A USER ID FOR SESSION MAINTENANCE
			users.push( user )
			return fn( null, user );
		}
		else
		{
			return fn( null, null );
		}
    	});
}

/*TODO add tag functionality to couch_module (added to file_publish) then come back and stare at this*/
function findByTag( tag, fn ) {
   request(
    { uri:designURI + '_view/tagged', json: true }, 
    function(e,r,b) {
      // console.log(b.rows)
      var results = []
      if(b.rows && b.rows.length > 0) {
        for( var i = 0; i < b.rows.length; i++ ) {
          var row = b.rows[ i ]

          if( row.value.indexOf( tag ) > -1 ) results.push( row.key )
        }
      }
      return results
    }
  )
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser( function(user, done) { 
  done(null, user.id); 
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) { 
    done(err, user); 
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        console.log( user, username, password )
        if (err) { return done(err); }
        if (!user) { 
          return done(null, false, { message: 'Unknown user ' + username }); 
        }
        if (user.password != password) { 
          return done(null, false, { message: 'Invalid password' }); 
        }
        return done(null, user);
      })
    });
  }
));

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', ["http://127.0.0.1:8080"]);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   // res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'false')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  next();
}

var checkForREST = function( req, res, next ) {
  var arr = req.url.split('/');
  if( arr[1] === 'gibber' ) {
    arr.shift(); arr.shift(); // get rid of first two elements, the first / and gibber/
    var url = escapeString( arr.join('/') )
    request('http://127.0.0.1:5984/gibber/'+ url, function(err, response, body) {
      res.send( body )
      // res.redirect( 'http://gibber.mat.ucsb.edu/?url='+url, { loadFile: body } )
    })
  }else{
    next()  
  }
}

var checkForVersion = function( req, res, next ) {
  var version = null,
      search = /\/(v(\d+))/.exec( req.originalUrl )
    
  if( search && search.length !== 0 ) {
    version = search[2]
    remove = search[1]
    
    req.url = req.url.slice( remove.length + 1 ) // remove version string from URL
  }

  req.gibberVersion = version
  
  next()
}

var entityMap = { "&": "%26", "'": '%27', "/": '%2F' };

function escapeString( string ) {
  return String( string ).replace(/[&<>"'\/]/g, function ( s ) {
    return entityMap[ s ];
  });
}
  
// var app = express();
var oneDay = 86400000;
app.engine('htm', require('ejs').renderFile);
app.configure( function() {
  app.set('views', serverRoot + 'snippets/')
  app.set('view engine', 'ejs')
  //app.use(express.logger())
  app.use( express.cookieParser() )
  //app.use(express.methodOverride())
  app.use( express.session({ secret:'gibber gibberish gibbering', store:new RedisStore() }) )
  //{ /* */ secret: 'gibber gibberish gibbering', expires:false, maxAge:10000000000 }) )
  app.use( express.bodyParser() )
  
  app.use( passport.initialize() )
  app.use( passport.session() )
  
  app.use( allowCrossDomain )
  
  app.use( checkForVersion )
  
  app.use( app.router )
  
  app.use( checkForREST )
  
  app.use( express.static( sharejs.scriptsDir ) )
  // serve share codemirror plugin
  app.use( express.static( shareCodeMirror.scriptsDir ) )
    
  app.use( express.static( serverRoot/*, { maxAge:oneDay } */ ) )

  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
  });
})

app.get( '/', function(req, res){
  var path, version = null
  
  if( req.query ) {
    if( req.query.path || req.query.p ) {
      path = req.query.path || req.query.p
      if( path.indexOf('/publications') === -1 ) { // shorthand to leave publications out of url
        var arr = path.split( '/' )
    
        path = arr[0] + '/publications/' + arr[1]
      }

      request('http://127.0.0.1:5984/gibber/' + escapeString( path ), function(err, response, body) {
        var _body = JSON.parse( body )
        if( body && typeof body.error === 'undefined' ) {
          res.render( 'index', { loadFile:body, isInstrument:_body.isInstrument || 'false', gibberVersion: req.gibberVersion } )
        }else{
          res.render( 'index', { loadFile: JSON.stringify({ error:'path not found' }) })
        }
      })
    }else if( req.query.i ) {
      path = req.query.i
      
      if( path.indexOf('/publications') === -1 ) { // shorthand to leave publications out of url
        var arr = path.split( '/' )
    
        path = arr[0] + '/publications/' + arr[1]
      }
      
      request('http://127.0.0.1:5984/gibber/' + escapeString( path ), function(err, response, body) {
        var _body = JSON.parse( body )
        if( body && typeof body.error === 'undefined' ) {
          res.render( 'index', { loadFile:body, isInstrument:true, gibberVersion: req.gibberVersion } )
        }else{
          res.render( 'index', { loadFile: JSON.stringify({ error:'path not found' }) })
        }
      })
    }else if( req.query.u || req.query.user ) {
      path = req.query.u || req.query.user
      
      request( designURI + '_view/publications?key=%22'+path+'%22', function(e,r,_b) {
        res.render( 'instrumentBrowser', {
          user: path,
          userfiles:(JSON.parse(_b)).rows,
        });
      })
    }else{
      res.render( 'index', { loadFile:'null', isInstrument:'false', gibberVersion: req.gibberVersion } )
    }
  }
  // fs.readFile(serverRoot + "index.htm", function (err, data) {
  //   if (err) {
  //     next(err);
  //     return;
  //   }
  //   res.writeHead( 200, {
  //     'Content-Type': 'text/html',
  //     'Content-Length': data.length
  //   })

  //   res.end( data )
  // })
})

app.post( '/userreadaccessall', function( req, res ) {
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
    request(
      { uri:designURI + '_view/userreadaccessall', json: true }, 
      function(e,r,b) {
        var results = []
        if(b.rows && b.rows.length > 0) {
          for( var i = 0; i < b.rows.length; i++ ) {
            var row = b.rows[ i ]

            if( row.value.indexOf( req.user.username ) > -1 ) results.push( row.key )
          }
        }
        res.send({ results: results })
      }
    )
})

app.post( '/userwriteaccessall', function( req, res ) {
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
    request(
      { uri:designURI + '_view/userwriteaccessall', json: true }, 
      function(e,r,b) {
        var results = []
        if(b.rows && b.rows.length > 0) {
          for( var i = 0; i < b.rows.length; i++ ) {
            var row = b.rows[ i ]

            if( row.value.indexOf( req.user.username ) > -1 ) results.push( row.key )
          }
        }
        res.send({ results: results })
      }
    )
})

app.post( '/userreadaccessfile', function( req, res ) {
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
    request(
      { uri:designURI + '_view/userreadaccessfile', json: true }, 
      function(e,r,b) {
        var results = []
        if(b.rows && b.rows.length > 0) {
          for( var i = 0; i < b.rows.length; i++ ) {
            var row = b.rows[ i ]

            if( row.value.indexOf( req.user.username ) > -1 ) results.push( row.key )
          }
        }
        res.send({ results: results })
      }
    )
})

app.post( '/userwriteaccessfile', function( req, res ) {
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
    request(
      { uri:designURI + '_view/userwriteaccessfile', json: true }, 
      function(e,r,b) {
        var results = []
        if(b.rows && b.rows.length > 0) {
          for( var i = 0; i < b.rows.length; i++ ) {
            var row = b.rows[ i ]

            if( row.value.indexOf( req.user.username ) > -1 ) results.push( row.key )
          }
        }
        res.send({ results: results })
      }
    )
})

//add authentication to check if currently logged on user is part of group
app.post( '/groupreadaccessfile', function( req, res ) { 
    request(
      { uri:designURI + '_view/groupreadaccessfile', json: true }, 
      function(e,r,b) {
        var results = []
        if(b.rows && b.rows.length > 0) {
          for( var i = 0; i < b.rows.length; i++ ) {
            var row = b.rows[ i ]

            if( row.value.indexOf( [req.body.groupname,req.body.filename] ) > -1 ) results.push( row.key )
          }
        }
        res.send({ results: results })
      }
    )
})

app.post( '/groupwriteaccessfile', function( req, res ) { 
    request(
      { uri:designURI + '_view/groupwriteaccessfile', json: true }, 
      function(e,r,b) {
        var results = []
        if(b.rows && b.rows.length > 0) {
          for( var i = 0; i < b.rows.length; i++ ) {
            var row = b.rows[ i ]

            if( row.value.indexOf( [req.body.groupname,req.body.filename] ) > -1 ) results.push( row.key )
          }
        }
        res.send({ results: results })
      }
    )
})

app.post('fileaddreadaccess', function(req, res){
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
	queuehandler.file.addreadaccess(req.body.filename,req.body.newuser,function(err, response)
	{
	res.send({ response: response });
	});
	
})

app.post('fileremreadaccess', function(req, res){
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
	queuehandler.file.remreadaccess(req.body.filename,req.body.newuser,function(err, response)
	{
	res.send({ response: response });
	});
	
})

app.post('fileaddwriteaccess', function(req, res){
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
	queuehandler.file.addwriteaccess(req.body.filename,req.body.newuser,function(err, response)
	{
	res.send({ response: response });
	});
	
})

app.post('fileremwriteaccess', function(req, res){
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
	queuehandler.file.remwriteaccess(req.body.filename,req.body.newuser,function(err, response)
	{
	res.send({ response: response });
	});
	
})

app.post('fileaddgroupreadaccess', function(req, res){
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
	queuehandler.file.addgroupreadaccess(req.body.filename,req.body.newgroup,function(err, response)
	{
	res.send({ response: response });
	});
})

app.post('fileremgroupreadaccess', function(req, res){
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
	queuehandler.file.remgroupreadaccess(req.body.filename,req.body.newgroup,function(err, response)
	{
	res.send({ response: response });
	});
})

app.post('fileaddgroupwriteaccess', function(req, res){
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
	queuehandler.file.addgroupwriteaccess(req.body.filename,req.body.newgroup,function(err, response)
	{
	res.send({ response: response });
	});
})

app.post('fileremgroupwriteaccess', function(req, res){
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
	queuehandler.file.remgroupwriteaccess(req.body.filename,req.body.newgroup,function(err, response)
	{
	res.send({ response: response });
	});
})

app.get( '/tag', function( req, res ) { 
  if( req.query.tag ) {
    request(
      { uri:designURI + '_view/tagged', json: true }, 
      function(e,r,b) {
        var results = []
        if(b.rows && b.rows.length > 0) {
          for( var i = 0; i < b.rows.length; i++ ) {
            var row = b.rows[ i ]

            if( row.value.indexOf( req.query.tag ) > -1 ) results.push( row.key )
          }
        }
        res.send({ results: results })
      }
    )
  }
})

app.get( '/recent', function( req, res ) {
  request(
    { uri:designURI + '_view/recent?descending=true&limit=20', json: true }, 
    function(e,r,b) {
      res.send({ results: b.rows })
    }
  )
})

app.get( '/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
})

app.post( '/requestPassword', function(req, res){
  request( 'http://127.0.0.1:5984/gibber/' + req.body.username, function(e,r,_b) {
    var data = JSON.parse( _b ),
        password = data.password,
        email = data.email

    if( typeof email === 'undefined' || email === '' ) {
      res.send({ result:'fail', msg:'You did not specify an email account for password reminders. Please contact an administrator if you need access to this account.'})
    }else{
      transporter.sendMail({
        from: 'gibber@gibber.mat.ucsb.edu',
        to: email,
        subject:'gibber password reminder',
        text:'As requested, your gibber password is ' + password + '.'
      })       
      res.send({ result:'success', msg:'An email with your password been sent to ' + email })
    }
  })
})

app.get( '/login', function(req, res){
  // console.log(" LOGIN?  ")
  res.render( 'login_start', { user: req.user, message:'login' /*req.flash('error')*/ });
})

app.get( '/loginStatus', function( req, res ) {
  if( req.isAuthenticated() ) {
    res.send({ username: req.user.username })
  }else{
    res.send({ username: null })
  }
})

// app.post( '/test', function(req, res, next){
//   console.log("TESTING", req.user, req.isAuthenticated() )
//   next()
//   res.render( 'login_start', { user: req.user, message: req.flash('error') });
// })

app.post( '/retrieve', function( req, res, next ) {
  // console.log( req.body )
  var suffix = req.body.address.replace(/\//g, '%2F'),
      _url = 'http://127.0.0.1:5984/gibber/' + suffix
      
  
  if( _url.indexOf('%2Fpublications') === -1 ) { // shorthand to leave publications out of url
    var arr = _url.split( '/' )
    
    _url = arr[0] + '%2Fpublications%2F' + arr[1]
  }
  
  _url += suffix.indexOf('?') > -1 ? "&revs_info=true" : "?revs_info=true"
  
  request( _url, function(e,r,b) {
    //console.log( e, b )
    res.send( b )
  })
})

app.get( '/create_publication', function( req, res, next ) {
  //console.log( req.user )
  res.render( 'create_publication', { user: req.user, message:'publication' } );
})

app.post( '/publish', function( req, res, next ) {
  var date = new Date(),
      day  = date.getDate(),
      month = date.getMonth() + 1,
      year = date.getFullYear(),
      time = date.toLocaleTimeString()
	
	queuehandler.file.publish(req.body.username,req.body.filename,req.body.code,[year,month,day,time],req.body.language,req.body.tags,req.body.notes,
	function(err,response)
	{
		if(err)
			res.send({error:"unable to publish file."}); //TODO: detailed error messages
		else
			{} //TODO: respond properly when file successfully published
	}
	);
})

//review this fn.
app.post( '/update', function( req, res, next ) {
  //console.log( req.body._rev, req.body._id )
  if( typeof req.user === 'undefined' ) {
    res.send({ error:'you are not currently logged in.' })
    return
  }
  
queuehandler.file.edit(req.body._id,req.body.text)

})

app.post( '/createNewUser', function( req, res, next ) { 
  var date = new Date(),
      day  = date.getDate(),
      month = date.getMonth() + 1,
      year = date.getFullYear(),
      time = date.toLocaleTimeString()
  queuehandler.user.create(req.body.username, req.body.password, [year,month,day,time],
    function (error, response) {
      if( error ) { 
        console.log( error )
        res.send({ msg: 'The server was unable to create your account' }) 
      } else { 
        res.send({ msg:'User account created' })
      }
    }
  )
})

app.get( '/welcome', function( req, res, next ) {
  res.render( 'welcome', {
    user:req.user
  })
})

app.get( '/preferences', function( req, res, next ) {
  res.render( 'preferences', {
    user:req.user
  })
})

app.get( '/documentation', function( req, res, next ) {
  res.render( 'docs', {
    user:req.user
  })
})
app.get( '/help', function( req, res, next ) {
  res.render( 'help', {
    user:req.user
  })
})
app.get( '/docs/', function( req,res,next ) { 
  res.render( '../docs/output/'+req.query.group+'/'+req.query.file+'.htm' )
})
app.get( '/credits', function( req,res,next ) { 
  res.render( 'credits' )
})

// adds inspect function to .ejs templates, used in browser .ejs to dynamically inject js
app.locals.inspect = require('util').inspect;

app.get( '/browser', function( req, res, next ) {
  var demos = {}
  request( designURI + '_view/demos', function(e,r,b) { 
    var audio = [], visual = [], audiovisual = [], demoRows = JSON.parse( b ).rows

    for( var i =0; i < demoRows.length; i++ ) {
      var cat, row = demoRows[ i ]
      
      cat = row.value.category || 'audiovisual'
      
      switch( cat ) {
        case 'Visual': visual.push( row ); break;
        case 'Audio' : audio.push(  row ); break;
        default: audiovisual.push(  row ); break;
      }
    }
    
    demos.visual = visual; demos.audio = audio; demos.audiovisual = audiovisual;
    
    request( { uri:designURI + '_view/recent?descending=true&limit=20', json: true }, 
      function(__e,__r,__b) {
        var recent = []
        for( var i = 0; i < __b.rows.length; i++ ){
          //console.log( __b.rows[i].value )
          recent.push( __b.rows[i].value )
        }
        request( designURI + '_view/tutorials', function(e,r,b) {
          // console.log( (JSON.parse(b)).rows )
          var _audio = [], _3d = [], _2d = [], _misc=[], demoRows = JSON.parse( b ).rows

            for( var i =0; i < demoRows.length; i++ ) {
            var cat = 'misc', row = demoRows[ i ]
            //console.log( row )
            if( row.key.split('*').length > 0 ) {
              cat = row.key.split('*')[1]
              switch( cat ) {
                case '2d' :
                  _2d.push( row ); break;
                case '3d' : _3d.push( row ); break;
                case 'audio' : _audio.push( row ); break;
                default:
                  _misc.push( row ); break;
              }
            }
          }
                    
          if( req.user ) {
            //console.log("USER ACCOUNT")
            request({ 
              uri:designURI + '_view/publications?key=%22'+req.user.username+'%22', 
              json:true 
            },
            function(e,r,_b) {
              //console.log(_b)
              res.render( 'browser', {
                user: req.user,
                demos:demos,
                audio:_audio,
                _2d:_2d,
                _3d:_3d,
                misc:_misc,
                userfiles:_b.rows,
                recent: recent, 
              });
            })
          }else{
            //console.log("NO USER ACCOUNT")
            res.render( 'browser', {
              user: null,
              demos: demos,
              audio: _audio,
              _2d: _2d,
              _3d: _3d,
              misc: _misc,
              userfiles:[],
              recent:recent,
            });
          }
        });
      })
  })
})


app.post( '/userfiles', function( req,res,next ) {
  if( req.user && req.user.username ) {
    request({ 
      uri:designURI + '_view/publications?key=%22'+req.user.username+'%22', 
      json:true 
    },
    function(e,r,_b) {
      res.send({
        files:_b.rows,
      });
    })
  }else{
    res.send({ msg:'No user is logged in. Cannot retrieve userfiles.' })
  }
})

app.get( '/chat', function( req, res, next ) {
  var result = {}
  if( !req.user ) {
    result.error = "You must log in (create an account if necessary) before using chat."
    res.send( result )
  }else{
    res.render( 'chat' )
  }
})

app.get( '/demos', function( req, res, next ) {
  request( designURI + '_view/demos', function(e,r,b) {
    var audio = [], visual = [], audiovisual = [], demoRows = JSON.parse( b ).rows

    for( var i =0; i < demoRows.length; i++ ) {
      var cat, row = demoRows[ i ]
      
      cat = row.demoCategory || 'audiovisual'
      
      switch( cat ) {
        case 'visual': visual.push( row ); break;
        case 'audio' : audio.push(  row ); break;
        default: audiovisual.push( row );  break;
      }
    }
    
    res.render( 'demos', { audio:audio, visual:visual, audiovisual:audiovisual})
  })
})

app.post( '/deleteUserFile', function( req, res, next ) {
  var fileInfo = req.body
  console.log( fileInfo )
})

app.post( '/search', function( req, res, next) {
  var result = {},
      query = queryString.escape(req.body.query), filter = req.body.filter,
      url = searchURL + filter + "?q="+query
  
  console.log( "SEARCH REQUEST", url )
  
  if( typeof query === 'undefined' || typeof filter === 'undefined') {
    result.error = 'Search query or search type is undefined.'
    res.send( result )
    return
  }
  
  var pubs = [], count = 0
  
  request({ 'url':url }, function(e,r,b) {
    //console.log( b )
    b = JSON.parse( b )
    if( b && b.rows && b.rows.length > 0 ) {
      //result.rows = b.rows
      //res.send( result )
      for( var i = 0; i < b.rows.length; i++ ) {
        !function() {
          var num = i,
              pubID = b.rows[ i ].id,
              suffix = pubID.replace(/\//g, '%2F'),
              _url = 'http://127.0.0.1:5984/gibber/' + suffix
      
          _url += suffix.indexOf('?') > -1 ? "&revs_info=false" : "?revs_info=false"
  
          request( _url, function(e,r,_b) {
            _b = JSON.parse( _b )
            
            delete _b.text
            
            pubs[ num ] = JSON.stringify( _b )
            
            if( ++count === b.rows.length  ) sendResults()
             
          })
              
        }()
      }
      
      function sendResults() {
        res.send({ rows: pubs, totalRows:b.total_rows })
      }
    }else{
      if( b.reason ) {
        res.send({ error:b.reason })
      }else{
        res.send({ rows:[] })
      }
    }
  })
  //request({ url:searchURL, json:})
  /*request({ url: esUrl , json:{
      "query": {
          "filtered" : {
              "query" : {
                  "query_string" : {
                      "query" : req.body.query
                  }
              }
          }
      },
  }}, function(e,r,b) {
    console.log("SEARCH RESULTS:", b )
    var result = {}
    if(b) {
      if( b.hits ) {
        for(var i = 0; i < b.hits.hits. length; i++ ) {
          console.log( b.hits.hits[i] )
          if( b.hits.hits[i]._id )
            result[ b.hits.hits[i]._id ] = b.hits.hits[i]._source.text
          //console.log("RESULT " + i + ":", b.hits.hits[i]._id, b.hits.hits[i]._source.text )
        }
      }else{
        result.noresults = "No matches were found for your query."
      }
    }else{
      if( b ) {
        result.error = b.indexOf('error') > -1 ? "The gibber database appears to be down. Please contact an administrator" : "No hits were found"
      }else{
        result.error = "The search database is offline. Please, please, please report this to admin@gibber.cc"
        console.log(e, r)
      }
    }
    
    res.send(result)
  })*/
})

app.post( '/login', function( req, res, next ) {
  passport.authenticate( 'local', function( err, user, info ) {
    var data = {}
    //console.log( "LOGGING IN... ", user, err, info )
    if (err) { return next( err ) }
    
    if (!user) {
      res.send({ error:'Your username or password is incorrect. Please try again.' })
    }else{
      req.logIn( user, function() { 
        res.send({ username: user.username }) 
      });
    }
  })( req, res, next );
})

app.get('/logout', function(req, res, next){
  if( req.user ) {
    req.logout();
    res.send({ msg:'logout complete' })
  }else{
    //console.log( "There wasn't any user... " )
    res.send({ msg:'you aren\t logged in... how did you even try to logout?' })
  }
  
  //res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

nodemailer.sendmail = true
server.listen( webServerPort )
rtc.init()

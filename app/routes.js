module.exports = function(app, passport, db, uuidV4) {

// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
      res.render(`login.ejs`)
        // res.render('index.ejs');
    });

    app.get('/newRoom', function(req, res) {
      res.redirect(`/newRoom/${uuidV4()}`)
        // res.render('index.ejs');
    });
    // rooms
    app.get("/newRoom/:room", (req, res) =>{
        res.render("room", {
        roomId: req.params.room,
        joined: ""
      })
    })

  app.get("/joinRoom/:room", (req, res) =>{
        res.render("room.ejs", {
          roomId: req.params.room,
          joined: "joined"
        })
  })

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profileActivity.ejs', {
            user : req.user,
            messages: result
          })
        })
    });
    app.get('/main', function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('index.ejs', {
            user : req.user,
            messages: result
          })
        })
    });
    app.get('/roomRoom', function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('old_main.ejs', {
            user : req.user,
            messages: result
          })
        })
    });
    app.get('/messenger', function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('messenger.ejs', {
            user : req.user,
            messages: result
          })
        })
    });
    app.get('/language', function(req, res) {
        db.collection('languages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('languages.ejs', {
            user : req.user,
            messages: result
          })
        })
    });

  //   app.get('/profile', isLoggedIn, function(req, res) {
  //     db.collection('messages').find().toArray((err, result) => {
  //     db.collection('chat').find({
  //       //to target specfic iuser ids
  //       // _id: ObjectId(req.user._id)
  //     }).toArray((err2, result2) => {
  //     db.collection('anki').find().toArray((err3, result3) => {
  //       if (err) return console.log(err)
  //       res.render('profile.ejs', {
  //         users : req.user,
  //         messages: result,
  //         chat: result2,
  //         anki: result3
  //       })
  //       })
  //       })
  //     })
  // });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/messages', (req, res) => {
      db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/messages', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbUp:req.body.thumbUp + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    app.put('/messagesThumbsDown', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbUp:req.body.thumbUp - 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/main', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/main', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


const User = require('./models/user');
const Exercise = require('./models/exercise');

const express = require('express');
const router = express.Router();


router.post('/new-user', function (req, res, next) {

  const user = new User(req.body);
  user.save(function(err, newUser){
    //console.log(err.code);
    // lets see if we can get this in userSchema.pre('save')
    if(err) {
      // unique username error, status 500 internal server error
      if(err.code === 11000){
        return next(new Error('sorry, that username is taken'));
      } else {
        return next(err);
      }
    }
    res.json({ username: newUser.username, _id: newUser._id });
  });

});// end POST /new-user for adding a new username and generate unique id



router.get('/users', function(req, res, next) {
  User.find({}, '-__v', function (err, users){
    if(err) return next(err);
    res.json(users);
  });
});// end GET /users


// for testing ryiTnqBkW userId for chloe
// for testing ryPRhqBkb userId for lily

router.post('/add', function(req, res, next) {

  User.findById(req.body.userId, '-__v', function(err, user){
    if(err) { return next(err); }

    if(!user){ return next(new Error('unknown _id')); }

    // if no date remove property so mongoose uses specified default
    if(!req.body.date) { delete req.body.date; }
    req.body.username = user.username;

    const newExercise = Exercise(req.body);
    newExercise.save(function(err, exercise){
      if(err) return next(err);

      const savedExercise = {
        username: exercise.username,
        description: exercise.description,
        duration: exercise.duration,
        _id: user._id,
        date: exercise.date.toDateString()
      }

      res.json(savedExercise);
    });

  });// end findById

});// end POST /add for adding exercise form data


router.get('/log', function(req, res) {
  // use the obj res.body for queries as well because of body-parser
  //
  // GET /api/exercise/log?{userId}[&from][&to][&limit]
  //
  // { } = required, [ ] = optional
  //
  // from, to = dates (yyyy-mm-dd); limit = number
  //
  // so first we want to check what parameters we have, userId required
    // if only userId, return all exercises logged
    // else chain whichever others are requested and respond
    // with any appropriate errors in those requests
});


router.get('/all', function(req, res) {
  Exercise.find({}, function (err, exercises){
    if(err) return console.log(err);
    res.json(exercises);
  });
});// end GET /all exercises for testing



module.exports = router;

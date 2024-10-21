var express = require('express');
var router = express.Router();
const userModel = require('./users')
const postModel = require('./posts')
const upload =  require('./multer')

const localStrategy = require('passport-local');
const passport = require('passport');
passport. use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload', isLoggedIn ,upload.single('file'),async function(req, res, next) {
  if (!req.file || !req.body.filecaption) {
    req.flash('failure',"failure")
    return  res.status(400).redirect('/profile')
  }
  req.flash('success',"success")
  res.redirect('/profile')

  // for saving the userid in post and postid in uesr
  const user = await userModel.findOne({username:req.session.passport.user})
  const post = await postModel.create({
    image :req.file.filename,
    user: user._id,
    postText: req.body.filecaption
  })
  user.posts.push(post._id)
  await user.save()



});

router.get('/login', function(req, res, next) {

  res.render('login',{error: req.flash("error")});
});

router.post('/register', function(req, res, next) {
  const { username, email, fullname,password } = req.body;
userdata = new userModel({ username, email, fullname, password });

userModel.register(userdata,req.body.password)
.then(function(){
  passport.authenticate("local")(req,res,function(){
    res.redirect("/profile");
    failureRedirect:  "/";
    failureFlash: true
  })
})
});

router.post('/login',passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}),function (req,res){

})

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err){return next(err)}
    res.redirect('/login')
  })
})

router.get('/profile',isLoggedIn, async function(req,res){
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts")




  const failure =req.flash('failure')
  const success =req.flash('success')
  var message;
  if (failure.length>0) {
    message = failure
  }
  else{
    message = success
  }
  res.render("profile",{user,message})
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
    }
    res.redirect('/')
}

module.exports = router;

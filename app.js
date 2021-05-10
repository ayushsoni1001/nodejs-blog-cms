var bodyParser        = require("body-parser"),
    express           = require("express"),
    mongoose          = require("mongoose"),
    flash             = require("connect-flash"),
    methodOverride    = require("method-override"),
    expressSanitizer  = require("express-sanitizer"),
    passport          = require("passport"),
    LocalStrategy     = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    session               = require("express-session"),
    User                  = require("./models/user"),
    Blog                 = require("./models/blogs")

var blogRoutes = require("./routes/blogs"),
    authRoutes = require("./routes/auth")

// App Config
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true}, {useUnifiedTopology: true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

// Auth Setup
app.use(session({
    secret: "abcd123",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// Routes Use
app.use(blogRoutes);
app.use(authRoutes);



// RESTFUL Routes

app.get("/", function(req, res){
    res.redirect("/blogs");
});



app.listen(3000, function(){
    console.log("Start");
});

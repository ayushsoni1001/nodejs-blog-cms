var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs")
var middleware = require("../middleware/login")

// Blog Inxed
router.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error!!");
        } else {
            res.render("index", {blogs:blogs});
        }
    });
});

// My Blog Index
router.get("/myblogs", middleware.isLoggedIn, function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error!!");
        } else {
            res.render("myblogs", {blogs:blogs});
        }
    });
});

// Create Blog
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
    res.render("new");
});

// Post Blog
router.post("/blogs",middleware.isLoggedIn, function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res,render("new");
        } else {
            newBlog.author.id = req.user._id;
            newBlog.author.username = req.user.username;
            newBlog.save();
            res.redirect("/blogs");
        }
    })
})

// Get Single Blog
router.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
});

// Edit Route
router.get("/blogs/:id/edit", middleware.editBlog, function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        res.render("edit", {blog: foundBlog});
    });
});

// Update Route
router.put("/blogs/:id", middleware.editBlog, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findOneAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    });
});

// Delete Route
router.delete("/blogs/:id", middleware.editBlog, function(req, res){
    Blog.findOneAndDelete(req.res.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
});

module.exports = router;
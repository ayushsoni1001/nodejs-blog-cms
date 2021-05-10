
var Blog = require("../models/blogs")

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next)
    {
        if(req.isAuthenticated()){
            next();
        } else {
            req.flash("error", "Please Login First!")
            res.redirect("/login");
        }
    }

middlewareObj.editBlog = function(req, res, next)
{
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            } else {
                if(foundBlog.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.render("../views/permission");
                }
            }
        })
    } else {
        res.render("../views/permission");
    }
}

module.exports = middlewareObj;
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');
var mongoose = require('mongoose');
var methodOverride = require('method-override');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extented: true}));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/Blog_app", {useNewUrlParser: true});

var blogAppSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blogs = mongoose.model("Blog", blogAppSchema);

// Blogs.create({
// 	title: "Blog Post",
// 	image: "https://pmcvariety.files.wordpress.com/2017/10/rickandmorty.jpg?w=1000",
// 	body: "This is Rick and morty"
// });

app.get("/", function(req, res){
	res.redirect("/blogs")
});

app.get("/blogs", function(req, res){
	
	Blogs.find({}, function(err, blogs){
		if(err){
		   console.log("Error");
		   }else {
			   res.render("index", {blogs: blogs});
		   }
	});
});

app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blogs.create(req.body.blog, function(err, newBlog){
		if(err){
		  	res.render("new");
		   } else{
			   res.redirect("/blogs");
		   }
	});
});

app.get("/blogs/:id", function(req, res){
	Blogs.findById(req.params.id, function(err, foundBlog){
		if(err){
		   res.redirect("/blogs");
		   }else {
			   res.render("show", {blog: foundBlog});
		   }
	})
});

app.get("/blogs/:id/edit", function(req, res){
	Blogs.findById(req.params.id, function(err, foundBlog){
		if(err){
		   res.redirect("/blogs");
		   }else {
			   res.render("edit", {blog: foundBlog});
		   }
	});
});

app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blogs.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
		   res.redirect("/blogs");
		   }else {
			   res.redirect("/blogs/" + req.params.id);
		   }
	});
});

app.delete("/blogs/:id", function(req, res){
	Blogs.findByIdAndRemove(req.params.id, function(err){
		if(err){
		   res.redirect("/blogs");
		   }else {
			   res.redirect("/blogs");
		   }
	});
});

app.get("*", function(req, res){
	res.send("Error 404 wrong URL try again");
});

app.listen(3000, process.env.IP, function(){
	console.log("The server is at your service");
});
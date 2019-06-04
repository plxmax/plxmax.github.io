const Post = require("../models/post");


exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId // We extract the userId attached to the request in check-auth.js middleware
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    }).catch(error => {
      res.status(500).json({
        message: "Post creation failed"
      });
    });
  }

  exports.postUpdate = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId}, post).then(result => {
      if(result.n > 0){ // n is number of documents found by the query
        res.status(200).json({ message: "Update successful!" });
      }else{
        res.status(401).json({ message: "Not Authorized!" });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Updating the post failed!"
      });
    });
  }


  exports.fetchPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize; // it receives the number as a string. 
    // So to make sure it receives the number as a number we write a + next to it
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage){
      postQuery.skip(pageSize * (currentPage - 1)) // Skips the first n=pageSize*(currentPage-1) documents
      .limit(pageSize); // These chain methods receive numbers as their arguments
    }
    postQuery.then(documents => {
      fetchedPosts = documents;
      return Post.count();
    }).then(count => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        numberOfPosts: count
      })
    }).catch(error => {
      res.status(500).json({
        message: "Fetching posts failed"
      });
    });
  }

  exports.fetchPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
  }

  exports.deletePost =(req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
      if(result.n > 0){ // n is number of documents found by the query
        res.status(200).json({ message: "Post was deleted!" });
      }else{
        res.status(401).json({ message: "Not Authorized!" });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Deleting post failed"
      });
    });
  }
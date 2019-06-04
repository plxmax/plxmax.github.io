const express = require("express");
const checkAuth = require("../middleware/check-auth");
const PostsController = require('../controllers/posts');
const router = express.Router();
const extractFile = require('../middleware/file');


router.post("", checkAuth, // After this line, the incomming requests have userData attached to them, extracted by jwt.verify
extractFile, PostsController.createPost);

router.put("/:id", checkAuth, extractFile, PostsController.postUpdate);

router.get("", PostsController.fetchPosts);

router.get("/:id", PostsController.fetchPost);

router.delete("/:id",checkAuth, PostsController.deletePost);

module.exports = router;

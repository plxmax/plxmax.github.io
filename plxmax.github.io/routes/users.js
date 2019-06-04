const express = require("express");
const UserController = require('../controllers/users');
const router = express.Router();

router.get("/admin", UserController.getAdmin);
router.post('/signup', UserController.createUser);
router.post("/login", UserController.userLoging);
module.exports = router;
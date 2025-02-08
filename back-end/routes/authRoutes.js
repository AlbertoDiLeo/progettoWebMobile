const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { login } = require("../controllers/authController");
const { register } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

module.exports = router;

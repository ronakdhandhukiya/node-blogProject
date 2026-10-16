const express = require("express");
const authRouter = express.Router();

const {signup,login,refresh}=require("../controllers/authController");

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);

module.exports = authRouter;
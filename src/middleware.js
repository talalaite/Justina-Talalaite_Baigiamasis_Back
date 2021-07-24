const jwt = require("jsonwebtoken");
const Joi = require("joi");

const { jwtSecret } = require("./config");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(250).trim().required(),
  email: Joi.string().email().min(3).max(250).trim().lowercase().required(),
  password: Joi.string().min(6).max(250).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(250).trim().lowercase().required(),
  password: Joi.string().min(6).max(250).required(),
});

module.exports = {
  async isRegisterDataCorrect(req, res, next) {
    let userData;
    try {
      userData = await registerSchema.validateAsync({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      req.userData = userData;
      return next();
    } catch (e) {
      return res.status(400).send({ error: "Insufficient data provided" });
    }
  },

  async isLoginDataCorrect(req, res, next) {
    let userData;
    try {
      userData = await loginSchema.validateAsync({
        email: req.body.email,
        password: req.body.password,
      });
      req.userData = userData;
      return next();
    } catch (e) {
      return res.status(400).send({ error: "Insufficient data provided" });
    }
  },

  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const decodedToken = jwt.verify(token, jwtSecret);
      req.userData = decodedToken;
      next();
    } catch (e) {
      console.log(e);
      return res.status(401).send({ error: "Validation failed" });
    }
  },
};

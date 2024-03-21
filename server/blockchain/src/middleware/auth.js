const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Inscription = require("../models/inscription");

const isAuth = async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ status: 401, message: "Unauthorized1" });
      }
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET ? process.env.JWT_SECRET : "KbPassword"
      );
      const result = await User.findOne({ where: { email: decoded.email, deleted: false }, include: Inscription });
      
      if (!result) {
        return res.status(401).json({ status: 401, message: "Unauthorized2" });
      }
      const user = result.dataValues;
      var userPv = user;
      delete userPv.password;
      delete userPv.deleted;
      req.user = userPv;
      next();
    } catch (error) {
      return res.status(401).json({ status: 401, message: "Unauthorizedbb" });
    }
};
  
const checkPermission = (check) => async(req, res, next) => {
    req.user.role == check ?   next() : res.status(403).send("Not authorized")
}

module.exports = {
    isAuth,
    checkPermission
}
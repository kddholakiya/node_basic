const router = require('express').Router();
import multer from "multer";

// Controllers
import authController from "../../controller/auth.controller";
const { login,logout,} = new authController();

//Comman file
import CommanController from "../../helper/common";
const {  CheckValidationError , VerifyJwt } = new CommanController();
const upload = new multer()
module.exports = (function() {

router.post("/login",login);
router.patch("/logout",VerifyJwt,logout);
 return router;
})();
const router = require('express').Router();

import * as validateUser from '../../helper/validations/user.validations'
import userController  from '../../controller/user.controller';
const {createUser,editUser,deleteUser,getAllUsers} = new userController();
//Comman file
import CommanController from "../../helper/common";
const {  CheckValidationError  , VerifyJwt } = new CommanController();
// const upload = new multer()
module.exports = (function() {

router.post('/create-user',VerifyJwt, createUser);
router.patch('/edit-user',VerifyJwt, CheckValidationError, editUser);
router.delete('/delete-user',VerifyJwt, deleteUser);
router.get('/getall-user',VerifyJwt, getAllUsers);


    return router;

})();
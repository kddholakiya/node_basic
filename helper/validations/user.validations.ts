import { body } from 'express-validator';


module.exports.addUser = [
  body('name').trim().exists({ checkFalsy: true }).withMessage("FirstNameRequired"),
  body('name').trim().isLength({ min: 3, max: 30 }).withMessage('NameLength'),
  body('phoneNumber').trim().exists({ checkFalsy: true }).withMessage("PhoneNumberRequired"),
  body('zipCode').trim().exists({ checkFalsy: true }).withMessage("ZipcodeRequired"),
];

module.exports.editProfile = [
  body('email').trim().isEmail().withMessage('EmailNotValid'),
  body('name').trim().exists({ checkFalsy: true }).withMessage("FirstNameRequired"),
  body('name').trim().isLength({ min: 3, max: 30 }).withMessage('FirstNameLength'),
  body('phoneNumber').trim().exists({ checkFalsy: true }).withMessage("PhoneNumberRequired"),
  body('address').trim().exists({ checkFalsy: true }).withMessage("AddressRequired"),
  body('zipCode').trim().exists({ checkFalsy: true }).withMessage("ZipcodeRequired"),
];

module.exports.changePassword = [
  body('password').trim().exists({ checkFalsy: true }).withMessage("PasswordRequired"),
  body('newPassword').trim().isLength({ min: 8 }).withMessage("PasswordLength"),
  body('newPassword').trim().matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").withMessage("PasswordValid")
];

module.exports.addSiteManager = [
  body('name').trim().exists({ checkFalsy: true }).withMessage("FirstNameRequired"),
  body('name').trim().isLength({ min: 3, max: 30 }).withMessage('NameLength'),
  body('userName').trim().exists({ checkFalsy: true }).withMessage("userNameRequired"),
  body('password').trim().isLength({ min: 3, max: 30 }).withMessage('PasswordRequired'),
  body('phoneNumber').trim().exists({ checkFalsy: true }).withMessage("PhoneNumberRequired"),
  body('address').trim().exists({ checkFalsy: true }).withMessage("AddressRequired"),
  body('zipCode').trim().exists({ checkFalsy: true }).withMessage("ZipcodeRequired"),
];

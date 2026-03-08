import jwt, { decode } from "jsonwebtoken";
import { HttpCodes } from "../helper/responseCodes";
import { Types } from 'mongoose';
// import smtpTransport from 'nodemailer-smtp-transport';
// import nodemailer from 'nodemailer';
import * as Path from "path";
import uuid4 from 'uuid4';
import { createCipheriv, createDecipheriv } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from 'express-validator';
import ejs from 'ejs';
var CryptoJS = require("crypto-js");
import winston from 'winston';
// import { createDat, decrypt } from "./Crypto";

import fs from 'fs';
import { NextFunction } from "express";
import user, { IUser } from "../model/user";
require('dotenv').config();


export default class CommanController {
  constructor() {
    this.getEpoch = this.getEpoch.bind(this);
    this.CreateJwt = this.CreateJwt.bind(this);
    this.VerifyJwt = this.VerifyJwt.bind(this);
    this.CheckValidationError = this.CheckValidationError.bind(this);
    this.GenerateOtp = this.GenerateOtp.bind(this);
    this.GenerateUniqueId = this.GenerateUniqueId.bind(this);
    this.commonResponse = this.commonResponse.bind(this);
    this.encryptVerifyToken = this.encryptVerifyToken.bind(this);
    this.getLoggedOfUnauthorizeUser = this.getLoggedOfUnauthorizeUser.bind(this);
    this.UUID = this.UUID.bind(this);

  }



  async getEpoch() {
    return await Math.floor(Date.now() / 1000);
  }


  async commonResponse(res, error, result) {

    if (error) {
      res.status(200).json({ status: false, message: res.__("api.errors.SomethingWrong"), code: HttpCodes['BAD_REQUEST'], data: error, total: 0 });
    } else {
      if (result && result.status === "customError") {
        res.status(200).json({ status: false, message: res.__(`api.errors.${result.msg}`), code: result.code, data: result.data, total: result?.total });
      } else {
        res.status(200).json({ status: true, message: res.__(`api.msg.${result.msg}`), code: result.code, data: result.data, total: result?.total, pageNumber: result?.pageNumber });
      }
    }
  }

  //create jwt newToken
  async CreateJwt(data) {
    const newToken = jwt.sign(data, process.env.jwtSecret, { expiresIn: '2h'});
    return newToken;
  }

  //create verify token
  async encryptVerifyToken(pass) {
    let verifyToken = await uuid4(pass);
    return verifyToken;
  }
  // Verify jwt token
  async VerifyJwt(req, res, next: NextFunction) {
    try {
      let token
      token = req.headers['authorization']
      console.log(req.headers.authorization,">>>>>>>>>>>>>>>> ");
      
    //   accessKey = req.headers['x-access-key'];

      if (!token && token == null && token == undefined) {
        return res.status(200).json({ message: res.__("api.errors.TokenNotProvided"), code: HttpCodes['UNAUTHORIZED'] });
      }
      const decryptApisecretkey = process.env.jwtSecret
      const decoded = jwt.verify(token, decryptApisecretkey);
      if (decoded) {
        let users: IUser = await user.findOne({ authToken: token });
        if (users && users !== null && users !== undefined) {
          req['user'] = decoded
          return next();
        } else {
          return res.status(200).json({
            message: res.__("api.errors.sessionExpire"),
            code: HttpCodes['UNAUTHORIZED']
          });
        }
      } else {
        return res.status(200).json({
          message: res.__("api.errors.InvalidToken"),
          code: HttpCodes['UNAUTHORIZED']
        });
      }
    } catch (error) {
      console.log(error, ">>>>>>errr")
      return res.status(200).json({
        message: res.__("api.errors.InvalidToken"),
        code: HttpCodes['UNAUTHORIZED']
      });
    }
  }

  //get logged of fishong attack
  async getLoggedOfUnauthorizeUser(req: any, res: any, next: any) {

    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'Keval' },
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log' })
      ]
    });

    // function phishingAttackLogger() {
    const userAgent = req.headers['user-agent'];

    if (userAgent && /bot|crawler|spider|curl|wget|java|python|ruby/i.test(userAgent)) {
      logger.info(`Potential phishing attack detected: ${userAgent}`);
    }
    next();
    // }
    // phishingAttackLogger()
  }


  //generate id
  async CreateObjectId() {
    const id = new Types.ObjectId();
    return id;
  }


  /// check validation error before API responce
  async CheckValidationError(req, res, next) {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ message: res.__(`api.errors.${errors.array()[0].msg}`), code: HttpCodes['CONTENT_NOT_FOUND'], data: {} });
    } else {
      next();
    }
  }

  // Function to generate OTP
  async GenerateOtp() {
    let otp = Math.floor(100000 + Math.random() * 900000);
    return otp;
  }
  // Function to generate DisplayUniqueId
  async GenerateUniqueId() {
    let uniqueId = Math.floor(100 + Math.random() * 900000);
    return uniqueId;
  }

  async UUID() {
    const uuid = uuidv4();
    return uuid;
  }



}

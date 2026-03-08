"use strict";

import { HttpCodes } from "../helper/responseCodes";
import user, { IUser } from "../model/user";
import CommanController from "../helper/common";
import bcrypt from "bcrypt";
import { stat } from "fs";
import fs from 'fs';


const { getEpoch, VerifyJwt, CreateJwt } = new CommanController();

export default class authService {

    constructor() {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async login(req: any, callback: any) {
        try {
            const { email, password } = req.body;
            var currentTime = await getEpoch();
            if (!email || !password) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'PleaseEnterLoginDetails', code: HttpCodes['BAD_REQUEST'], data: {} });
            }
            const userData = await user.findOne({ email: email, isDelete: false,accountType :  { $in: [1, 2] }  });
            if (!userData) {
                return callback(null, { status: HttpCodes['API_FAILURE'], msg: "UserNotFound", code: HttpCodes['NOT_FOUND'], data: {} })
            }
            const matchPassword = await bcrypt.compare(password, userData.password);
            if (!matchPassword) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'InvalidPassword', code: HttpCodes['BAD_REQUEST'], data: {} });
            }
            const jwtData = {
                _id : userData._id,
                email : userData.email,
            }
            
            const token = await CreateJwt(jwtData);
            const updateUser = await user.findOneAndUpdate({ _id: userData._id }, { lastLoginAt: currentTime, authToken: token }, { new: true });
            if (!updateUser) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': "SomethingWrong", code: HttpCodes['BAD_REQUEST'], data: {} });
            }
            return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'Login', code: HttpCodes['OK'], data: { token } });
        }
        catch (error) {
            console.log(error);
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }

    async logout(req : any, callback : any) {
        try {
            const userData: IUser = await user.findOne({ _id: req.user._id })
            if (userData) {
                const currentTime = await getEpoch()
                var userUpdate: any = await user.updateOne({ _id: userData?._id }, { authToken: null }, { new: true })
                if (userUpdate['acknowledged']) {
                    return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'LoggedOut', code: HttpCodes['OK'], data: {} });
                } else {
                    return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['NOT_FOUND'], data: {} });
                }
            }
            else {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'UserNotFound', code: HttpCodes['NOT_FOUND'], data: {} });
            }
        } catch (error) {
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }

}
"use strict";

import { HttpCodes } from "../helper/responseCodes";
import user, { IUser } from "../model/user";
import CommanController from "../helper/common";

const { getEpoch, VerifyJwt } = new CommanController();


export default class adminService {

    constructor() {
        this.createUser  = this.createUser.bind(this);
        this.editUser  = this.editUser.bind(this);
        this.deleteUser  = this.deleteUser.bind(this);
        this.getAllUsers  = this.getAllUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
    }


    async createUser(req: any, callback: any) {
        try {
            const userData: IUser = await user.findOne({ _id: req.user._id, accountType:{ $in: [1, 2] } })
            if (!userData) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'InvalidAccount', code: HttpCodes['UNAUTHORIZED'], data: {} });
            }
            const { email, ownerName, companyName,supervisor1Name,supervisor1Number,supervisor2Name,supervisor2Number, phoneNumber, ownerAddress,siteAddress, aadharCardNo, panCardNo, chequeNo, panCard, aadharCard, cheque, accountType, profile } = req.body
            const users = await user.findOne({ email: email, isDelete: false });
            if (users) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'accountAlreadyExist', code: HttpCodes['CREATED'], data: {} });
            }
            const newUser = {
                email : email,
                ownerName : ownerName,
                accountType : accountType,
                companyName : companyName,
                supervisor1Name : supervisor1Name,
                supervisor1Number : supervisor1Number,
                supervisor2Name : supervisor2Name,
                supervisor2Number : supervisor2Number,
                ownerAddress : ownerAddress,
                siteAddress : siteAddress,
                phoneNumber : phoneNumber,
                aadharCardNo : aadharCardNo,
                panCardNo : panCardNo,
                chequeNo : chequeNo,
                // profile : profile,      
                // aadharCard : aadharCard,
                // panCard : panCard,
                // cheque : cheque,
                createdAt: await getEpoch()
            }

            const userCreate: IUser = new user(newUser)
            const saveData = await userCreate.save();
            if (!saveData) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
            }
            return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'UserCreated', code: HttpCodes['OK'], data: {} });
        } catch (error) {
            console.log(error);
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }

    }

    async editUser(req: any, callback: any) {
        try {
            const userData: IUser = await user.findOne({ _id: req.user._id, accountType:{ $in: [1, 2] } });
            if (!userData) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'InvalidAccount', code: HttpCodes['UNAUTHORIZED'], data: {} });
            }
            const userId = await user.findOne({_id : req.params._id});
            if (!userId) {
                return callback(null, { status: HttpCodes['API_FAILURE'], msg: "UserNotFound", code: HttpCodes['NOT_FOUND'], data: {} })
            }
          const  {email,ownerName,companyName,supervisor1Name,supervisor1Number,supervisor2Name,supervisor2Number,ownerAddress,siteAddress,aadharCardNo,panCardNo,chequeNo,phoneNumber} = req.body;
          const currentTime = await getEpoch()
          const updateData = {
            email : email,
            ownerName : ownerName,
            companyName : companyName,
            supervisor1Name : supervisor1Name,
            supervisor1Number : supervisor1Number,
            supervisor2Name : supervisor2Name,
            supervisor2Number : supervisor2Number,
            phoneNumber : phoneNumber,
            ownerAddress : ownerAddress,
            siteAddress : siteAddress,
            aadharCardNo : aadharCardNo,
            panCardNo : panCardNo,
            chequeNo : chequeNo,
            updatedAt: currentTime
        }
        const updateUser = await user.updateOne({_id : req.params.id},updateData,{new : true});
        if (updateUser['acknowledged'] == false) {
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
        return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'UserUpdated', code: HttpCodes['OK'], data: {} });
        } catch (error) {
            console.log(error);
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }

    }

    async deleteUser(req : any,callback : any) {
        try {
            const userData: IUser = await user.findOne({ _id: req.user._id, accountType:{ $in: [1, 2] } });
            if (!userData) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'InvalidAccount', code: HttpCodes['UNAUTHORIZED'], data: {} });
            }
            const userId = await user.findOne({ _id: req?.params?.id })
            if (!userId) {
                return callback(null, { status: HttpCodes['API_FAILURE'], msg: "UserNotFound", code: HttpCodes['NOT_FOUND'], data: {} })
            }
            var userUpdate: any = await user.deleteOne({ _id: userId });
            if (userUpdate["acknowledged"]) {
                return callback(null, {status: HttpCodes["API_SUCCESS"],msg: 'userDeleted',code: HttpCodes["OK"],data: {},});
            } else {
                return callback(null, {status: HttpCodes["API_FAILURE"],msg: "SomethingWrong",code: HttpCodes["NOT_FOUND"],data: {},});
            }
        } catch (error) {
            console.log(error);
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }

    async getAllUsers(req : any , callback : any) {
        try {
            const { searchValue } = req.query;
            const userData: IUser = await user.findOne({ _id: req.user._id, accountType:{ $in: [1, 2] } });
            if (!userData) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'InvalidAccount', code: HttpCodes['UNAUTHORIZED'], data: {} });
            }
            var finalData :any = {}
            var query: any = [];
            let skip: any = Number((Number(req?.query?.skip) * Number(req?.query?.limit)) || 0);
            const limit = parseInt(req.query.limit || 10);

            query.push({
                $match: {
                    isDelete: false,
                    accountType: 3
                }
            });
            
            query.push(
                {
                    $match: {
                        $or: [
                            { email: { $regex: new RegExp(searchValue), $options: 'i' } }
                        ]
                    }
                }
            );

            query.push({
                $sort: { 'createdAt': -1 }
            });

            query.push({
                $project: {
                    '_id' : 1,'email' : 1,'ownerName' : 1,'companyName' : 1,'phoneNumber' : 1
                }
            });

            query.push({
                $facet: {
                    edges: [{ $skip: skip }, { $limit: limit }],
                    pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } },
                    {
                        $project: {
                            count: 1,
                            currentPage: {
                                $divide: [{ $add: [skip, limit] }, limit],
                            }
                        }
                    },
                    ],

                },
            });
            const allUsers = await user.aggregate(query, { "collation": { "locale": "en", strength: 4 }, "allowDiskUse": true });
            if (allUsers[0]?.edges.length <= 0) {
                return callback(null, { status: HttpCodes['API_FAILURE'], msg: 'NoDataAvailable', code: HttpCodes['BAD_REQUEST'], data: {}, });
            }
            let pageno = Math.ceil(allUsers[0]?.pageInfo[0]?.count / limit);
            Promise.all([allUsers[0]?.edges]).then(async (values) => {
                finalData['userData'] = values[0];
            });
            return callback(null, { status: HttpCodes['API_SUCCESS'], msg: 'usersgetsuccess', code: HttpCodes['OK'], data: finalData,pageno : pageno,total : allUsers[0]?.pageInfo[0]?.count});
        } catch (error) {
            console.log(error);
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }

    async getUserById(req : any, callback : any) {
        try {
            const userData: IUser = await user.findOne({ _id: req.user._id, accountType:{ $in: [1, 2] } });
            if (!userData) {
                return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'InvalidAccount', code: HttpCodes['UNAUTHORIZED'], data: {} });
            }
            const userId = await user.findOne({_id : req.params.id});
            if (!userId) {
                return callback(null, { status: HttpCodes['API_FAILURE'], msg: "UserNotFound", code: HttpCodes['NOT_FOUND'], data: {} })
            }
            const resJson = {
                email : userId?.email,
                ownerName : userId?.ownerName,
                companyName : userId?.companyName,
                supervisor1Name : userId?.supervisor1Name,
                supervisor1Number : userId?.supervisor1Number,
                supervisor2Name : userId?.supervisor2Name,
                supervisor2Number : userId?.supervisor2Number,
                ownerAddress : userId?.ownerAddress,
                siteAddress : userId?.siteAddress,
                phoneNumber : userId?.phoneNumber,
                aadharCardNo : userId?.aadharCardNo,
                panCardNo : userId?.panCardNo,
                chequeNo : userId?.chequeNo,
                // profile : userId?.profile,
                // aadharCard : userId?.aadharCard,
                // panCard : userId?.panCard,
                // cheque : userId?.cheque,
            }
            return callback(null, { 'status': HttpCodes['API_SUCCESS'], 'msg': 'usersgetsuccess', code: HttpCodes['BAD_REQUEST'], data: resJson });
        } catch (error) {
            console.log(error);
            return callback(null, { 'status': HttpCodes['API_FAILURE'], 'msg': 'SomethingWrong', code: HttpCodes['BAD_REQUEST'], data: {} });
        }
    }
}
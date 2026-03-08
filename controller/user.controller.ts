"use strict";
import adminService from "../services/user.service";
import commonHelper from "../helper/common";
const { commonResponse } = new commonHelper();
import { Request, Response } from 'express';

export default class admiinController {

    adminService : adminService
    constructor () {
        this.adminService = new adminService();
        this.createUser  = this.createUser.bind(this);
        this.editUser  = this.editUser.bind(this);
        this.deleteUser  = this.deleteUser.bind(this);
        this.getAllUsers  = this.getAllUsers.bind(this);
    }

        
    async createUser(req: Request, res: Response) {
        this.adminService.createUser(req, async (error : any, result : any) => {
            await  commonResponse(res,error,result);
        })
    }
    async editUser(req: Request, res: Response) {
        this.adminService.editUser(req, async (error : any, result : any) => {
            await  commonResponse(res,error,result);
        })
    }
    async deleteUser(req: Request, res: Response) {
        this.adminService.deleteUser(req, async (error : any, result : any) => {
            await  commonResponse(res,error,result);
        })
    }
    async getAllUsers(req: Request, res: Response) {
        this.adminService.getAllUsers(req, async (error : any, result : any) => {
            await  commonResponse(res,error,result);
        })
    }
}
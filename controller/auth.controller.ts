"use strict";
import authService from "../services/auth.service";
import commonHelper from "../helper/common";
const { commonResponse } = new commonHelper();
import { Request, Response } from 'express';

export default class authServices {

    authService : authService
    constructor () {
        this.authService = new authService();
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);

    }
    
    async login(req: Request, res: Response) {
        this.authService.login(req, async (error : any, result : any) => {
            await  commonResponse(res,error,result);
        })
    }
    
  
    async logout(req: Request, res: Response) {
        this.authService.logout(req, async (error : any, result : any) => {
            await  commonResponse(res,error,result);
        })
    }

}


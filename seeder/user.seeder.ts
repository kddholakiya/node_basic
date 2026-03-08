// import mongoose , {model} from "mongoose";
// import user,{IUser} from "../model/user";
// import CommanController from "../helper/common";
// const {getEpoch} = new CommanController;
// import {config} from 'dotenv';
import bcrypt from "bcrypt";

// config();


// const documents = [
//     {
//         "email": "admin@admin.com",
//         "name": "keval",
//         "companyName": "Company",
//         "password": "Admin@123",
//         "profile": "image",
//         "phoneNumber": 55651515145,
//         "address": "Ahmedabad",
//         "panCardNo": "hdysgsv544516",
//         "aadharCardNo": 561511115844,
//         "chequeNo": "65464wesa",
//         "accountType": 1
//     }
// ]

// export default class UserSeeder {
//     constructor() {
//         this.seedDb = this.seedDb.bind(this);
//     }

//     async  seedDb() {
//         return new Promise(async (resolve, reject) => {
//             try {
//                 await user.deleteMany();
//                 for(const ele of documents) {
//                     let data =ele;
//                     const hashedPassword = await bcrypt.hash(data.password, 10);
//                     data.password = hashedPassword;
//                     const userData = new user(data);
//                     console.log(userData, "user data");
                    
//                     await userData.save();
//                     resolve(1);
//                 }
//             } catch (error) {
//                 console.log(error, "error in user seeder");
//                 resolve(0);
//             }
//         })
//     }
// }
















import mongoose, { models } from 'mongoose';
import user, { IUser } from '../model/user';
import CommanController from "../helper/common";
const { getEpoch } = new CommanController();
import { config } from 'dotenv';


// Load environment variables from .env file
config();

// Use environment variables
const { DB_URL, Stripe_SecretKey } = process.env;
// console.log(process.env.DB_URL,"process.env.DB_URL");

const documents = [
    {
        "email": "admin@admin.com",
        "name": "keval",
        "companyName": "Company",
        "password": "Admin@123",
        "profile": "image",
        "phoneNumber": 55651515145,
        "address": "Ahmedabad",
        "panCardNo": "hdysgsv544516",
        "aadharCardNo": 561511115844,
        "chequeNo": "65464wesa",
        "accountType": 1
    }
]

export default class UserSeeder {
  constructor() {
    this.seedDB = this.seedDB.bind(this);
  }
  async seedDB() {
    console.log("in user")
 
    return new Promise(async (resolve, reject) => {
      try {
        // Load seed data
        await user.deleteMany({});

        for (const ele of documents) {
        let data = ele;
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        const userData: IUser = new user(data);
        let saveData = await userData.save();        }
        resolve(1);
      } catch (error) {
        console.log(error, "error in user seeder");
        resolve(0);
      }
    })

  }
}
import { model, Schema, Model, Document, Types, ObjectId } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId
  email: String
  password : String
  ownerName: String
  companyName: String
  supervisor1Name: String
  supervisor1Number : Number
  supervisor2Name: String
  supervisor2Number : Number
  phoneNumber : Number
  ownerAddress: String
  siteAddress: String
  profile: String
  aadharCardNo: Number
  panCardNo: String
  chequeNo: String
  aadharCard : String
  panCard: String
  cheque: String
  accountType: Number
  isDelete: Boolean
  createdAt: Number
  updatedAt: Number
  authToken: String
  deletedAt: Number
  lastLoginAt: Number
}

const userSchema: Schema = new Schema({

  email: {
    type: String,
    unique : true,
    require : true
  },
  password : {
    type: String,
  },
  ownerName: {
    type: String,
    require : true
  },
  companyName: {
    type: String,
    require : true
  },
  supervisor1Name: {
    type: String,
    require : true
  },
  supervisor1Number: {
    type: Number,
    require : true
  },
  supervisor2Name: {
    type: String
  },
  supervisor2Number: {
    type:  Number
  },
  ownerAddress: {
    type: String
  },
  phoneNumber : {
    type : String,
    require : true
  },
  siteAddress: {
    type: String
  },
  profile: {
    type: String
  },
  aadharCardNo: {
    type: Number
  },
  panCardNo: {
    type: String
  },
  chequeNo: {
    type: String
  },
  aadharCard : {
    type : String
  },
  panCard: {
    type: String
  },
  cheque: {
    type: String
  },
  accountType: {
    type: Number
  },
  isDelete: {
    type: String,
    default : false
  },
  createdAt: {
    type: Number,
    require : true
  },
  updatedAt: {
    type: Number
  },
  authToken: {
    type: String
  },
  deletedAt: {
    type: Number
  },
  lastLoginAt: {
    type: Number
  },

},
  // { timestamps: true }
);

const user: Model<IUser> = model<IUser>('users', userSchema);
export default user;

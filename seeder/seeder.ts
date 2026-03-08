import mongoose ,{model} from "mongoose";
import { config } from "dotenv";
mongoose.set('strictQuery' , false)
require('dotenv').config()
import UserSeeder from './user.seeder';

let userSeeder = new UserSeeder();
var DB_URL = process.env.DB_URL;
config();

MongodbConnection().then(() => {
    console.log("database connected suceessfully!");
    seedDB();
  }).catch((err) => {
    console.log("Failed to connect Database !!!!", err);
    process.exit(1);
  });

  async function MongodbConnection() {
    // Set up Mongoose connection
    await mongoose.connect(DB_URL);
  }

  async function seedDB() {
    let user = await userSeeder.seedDB();

    mongoose.connection.close();
    process.exit(1);
  }
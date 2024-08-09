import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\MONGODB CONNECTED!\nDB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error(`MONGODB CONNECTION FAILED: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
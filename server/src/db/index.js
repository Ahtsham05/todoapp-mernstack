import mongoose from "mongoose";
import { DBNAME } from "../constants.js";

const dbConnection = async () => {
    try {
        const db = mongoose.connect(`${process.env.DATABASE_URI}/${DBNAME}?retryWrites=true&w=majority`)
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database Connection Failed", error);
        process.exit(1);
    }
}

export default dbConnection
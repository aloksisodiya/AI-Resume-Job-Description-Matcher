import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async ()=>{
    try {
        mongoose.connection.on(
            'connected', () => console.log("Database Connected")
        );
        await mongoose.connect(`${process.env.MONGODB_URI}/resume_ai`);
    } 
    catch (error) {
        console.error(
            "Database connection failed:", error.message
        );
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;


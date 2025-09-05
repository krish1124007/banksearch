import mongoose from "mongoose";



async function connectDB()
{
    try {
        const connect =  await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Database connect successfully");
        return connect;
    } catch (error) {
        console.log("Something error is generate while connecting db");
    }
}


export { connectDB }
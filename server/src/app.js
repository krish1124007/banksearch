import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import { bank_router } from "./routes/bank.routes.js";
import { admin_router } from "./routes/admin.routes.js";
import { user_router } from "./routes/user.routes.js";
dotenv.config({});



const app = express();
//middlewares
app.use(express.json());
app.use(cors({
    origin:"*"
}))

//routers
app.get('/',(req,res)=>{
    return res.json({'message':"hey this is working"})
})
app.use('/api/v1/bank',bank_router);
app.use('/api/v1/admin',admin_router);
app.use('/api/v1/user',user_router);


export {app};

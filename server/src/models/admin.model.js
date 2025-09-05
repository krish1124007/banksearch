import mongoose from "mongoose"
import bcrypt  from "bcrypt"
import jwt from "jsonwebtoken"

const AdminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        uniqe:true
    },
    password:{
        type:String,
        required:true
    }
})

AdminSchema.pre("save",async function(next){
    if(!this.isModified("password"))
    {
       return next();
    }

    this.password  = await bcrypt.hash(this.password,10);
    next();
})

AdminSchema.methods.comparePassword = async function(password){
     return await bcrypt.compare(password , this.password)
}

AdminSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.JWT_SECRATE_CODE,
    {
        expiresIn:process.env.JWT_EXPIRES
    }
)
}

export const Admin  = mongoose.model('Admin' ,AdminSchema);

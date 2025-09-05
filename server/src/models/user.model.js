import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
  name:{
     type:String,
      required:true
  },
  contact_number:{
    type:String,
    required:true
  },
  search_objects:[String]
}) 



export const User = mongoose.model("User" , userSchema);

import mongoose from "mongoose"


const userSchema = new mongoose.Schema({
  name:{
     type:String,
      required:false
  },
  contact_number:{
    type:String,
    required:false
  },
  search_objects:[String]
}) 



export const User = mongoose.model("User" , userSchema);

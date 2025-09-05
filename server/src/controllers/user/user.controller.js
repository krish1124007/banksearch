import {User} from "../../models/user.model.js";
import { ApiResponse } from "../../utils/apiresponse.js";
import { asyncHandler } from "../../utils/asynchandler.js";



const saveUserInforamtion = asyncHandler(async(req,res)=>{
  const {name , contact_number ,search_objects } = req.body;
  if(!name && !contact_number)
  {
    return res.status(400)
    .json(
      new ApiResponse(400,"please enter the username and password",{success:false , data:"usernameAndPasswordNullError"})
    )
  }

  const isUserExist =  await User.findOne({name , contact_number});

  if(isUserExist)
  {
    const parsedObject = JSON.stringify(req.body.search_objects[0]);
  
    isUserExist.search_objects.push(parsedObject);
    isUserExist.save();
    return res.status(200)
    .json(
      new ApiResponse(200,"user object update successfully",{success:true , data:"userupdates"})
    )
  }

  const userInfoSave = await User.create({name , contact_number});
  if(search_objects && search_objects.length > 0)
  {
    const parsedObject = JSON.stringify(req.body.search_objects[0]);
  
    userInfoSave.search_objects.push(parsedObject);
    userInfoSave.save();
  }

  if(!userInfoSave)
  {
    return res.status(500)
    .json(
      new ApiResponse(500 ,"something problem with the save user data" ,{success:false , data:"userObjectNotSaveError"})
    )
  }

    return res.status(200)
    .json(
      new ApiResponse(200,"user object save successfully",{success:true , data:userInfoSave})
    )
  
})

const getUserInformation = asyncHandler(async(req , res)=>{
    const {_id} = req.params;
    if(!_id)
    {
      return res.status(400)
      .json(
        new ApiResponse(400,"please enter the user id",{success:false , data:"userIdNullError"})
      )
    }
    const userInfo = await User.findById(_id);
    if(!userInfo)
    {
      return res.status(404)
      .json(
        new ApiResponse(404,"user not found",{success:false , data:"userNotFoundError"})
      )
    }
   
    return res.status(200)
    .json(
      new ApiResponse(200,"user information found successfully",{success:true , data:userInfo})
    )
})

const getAllUserInformation = asyncHandler(async(req , res)=>{
    const userInfo = await User.find({});
    if(!userInfo || userInfo.length === 0)
    {
      return res.status(404)
      .json(
        new ApiResponse(404,"user not found",{success:false , data:"userNotFoundError"})
      )
    }
    return res.status(200)
    .json(
      new ApiResponse(200,"user information found successfully",{success:true , data:userInfo})
    )
})

const deleteAlluser = asyncHandler(async(req,res)=>{
  const del = await User.deleteMany({});

  return res.status(200)
  .json(
    new ApiResponse(200, "all user delete successfully" , {success:true , data:"delete successfully"})
  )
})

export {
    saveUserInforamtion,
    getUserInformation,
    getAllUserInformation,
    deleteAlluser
}
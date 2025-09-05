import { Admin } from "../../models/admin.model.js";
import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiResponse } from "../../utils/apiresponse.js"

const createAdmin = asyncHandler(async(req,res)=>{
    const {username,password} = req.body;
    
    const createadmin = await Admin.create({username:username,password:password});

    return res.status(200)
    .json(
        new ApiResponse(200,"admin create successfully", {success:true , data:createadmin})
    )
})

const loginAdmin = asyncHandler(async(req,res)=>{
    const {username , password} = req.body;

    if(!username || !password)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,"please enter the username and password both",{success:false , data:"UsernameAndPasswordNullError"})
        )
    }

    const find_user = await Admin.findOne({username:username});

    if(!find_user)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,"usernasme is incorrect",{success:false , data:"UsernameIncorrectError"})
        )
    }

    const passwordCheck = await find_user.comparePassword(password);

    if(!passwordCheck)
    {
        return res.status(400)
        .json(
            new ApiResponse(400,"password is incorrect" ,{success:false , data:"PasswordIncorrectError"})
        )
    }

    const access_token = await find_user.generateAccessToken();

    if(!access_token)
    {
        return res.status(500)
        .json(
            new ApiResponse(500,"something problem to generate Accesstoken",{success:false , data:"AccessTokenNotGenearateError"})
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(200,"user login successfully" ,{success:true , data:access_token})
    )
})

export {
    loginAdmin,
    createAdmin
}


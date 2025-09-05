import { ApiResponse } from "./apiresponse.js";

async function objectMaker(object_instance_name ,creation_data,res)
{
   
    const obj = await object_instance_name.create(creation_data);
    if(obj == {})
    {
       return res.status(400)
       .json(
        new ApiResponse(400,"please fillup correct data" , {success:false , data:"HomeloneNotCreateError"})
       )
    }
    return obj._id;

}

export { objectMaker };

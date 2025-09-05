import { app } from "./app.js";
import { connectDB } from "./db/index.js"

connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`app listing on the port ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log(err);  
})



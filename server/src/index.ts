import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./db";

connectDB().then(() => {
    // listen for errors
    app.on("error",(error)=>{
        console.log("error : ",error);
        throw error;
    })

    //start the app if successful connection
    app.listen(process.env.PORT, () => {
        console.log(`⚙️  Server is running on port : ${process.env.PORT}`);
    }) 
}).catch((error) => {
    console.log("MONGODB connection FAILED : ",error);
})
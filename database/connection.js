import mongoose from "mongoose";

const connectMongo = async() => {
    try{
       const {connection} =  mongoose.connect(process.env.MONGODB_URI) 

       if (connection.readyState == 1) {
        return Promise.resolve(true)
       }

    } catch(error){
        return Promises.reject(error);
    }
}

export default connectMongo;

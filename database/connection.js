import mongoose from "mongoose";


mongoose.set('strictQuery', false);

const connectMongo = async() => {
    try{
       const connection =  mongoose.connect(process.env.MONGODB_URI) 

       if (connection.readyState === 1) {
        return Promise.resolve(true)
       }

    } catch(error){
        return Promise.reject(error);
    }
}

export default connectMongo;

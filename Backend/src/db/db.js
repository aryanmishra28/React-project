const mongoose=require('mongoose');

function connectDB(){
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('MONGO_URI is not defined. Please set it in Backend/.env');
        process.exit(1);
    }
    mongoose.connect(mongoUri,{
    }).then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });
}
module.exports = connectDB;
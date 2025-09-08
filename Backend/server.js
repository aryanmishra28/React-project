// start server
const app=require('./src/app');
const connectDB=require('./src/db/db');
require('dotenv').config(); // Load environment variables from .env file

connectDB(); // Connect to the database

app.listen(3000,()=>{
    console.log("server started at port 3000");
});
const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log('Connected to MongoDB...');
    })
    .catch((error)=>{
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);  // Exit the process with an error code 1
    })
}
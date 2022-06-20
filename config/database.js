const mongoose = require('mongoose');

const {MONGO_URI} = process.env;

exports.connect = async () => {
    // Connect to MongoDB
    try {
        await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    }
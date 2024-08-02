const mongoose = require('mongoose');

let isConnected = false;

const connect = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('Database connection established');
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
};

module.exports = connect;
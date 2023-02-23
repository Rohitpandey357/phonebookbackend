require('dotenv').config();

const mongoose = require('mongoose');

mongoose.set('strictQuery',false)
    
const dbUrl = process.env.MONGODB_URI;

console.log('Connecting to' + dbUrl);

mongoose.connect(dbUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB', err));

const personSchema = new mongoose.Schema({
    name: {
        type : String,
        minLength : 3,
        required: true
    },
    number: {
        type : String,
        minLength : 8,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person', personSchema)
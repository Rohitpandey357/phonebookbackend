const mongoose = require('mongoose');

    if (process.argv.length<3) {
        console.log('give password as argument');
        process.exit(1)
    }
    
    const password = process.argv[2]
    //console.log(password)
    
    const dbUrl = `mongodb+srv://phonebook:${password}@cluster0.nkys2oh.mongodb.net/?retryWrites=true&w=majority`;
    
    mongoose.set('strictQuery',false)
    mongoose.connect(dbUrl)
    
    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })
    
    const Person = mongoose.model('Person', personSchema)

    if(process.argv.length == 3) {
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person)
            })
            mongoose.connection.close()
            process.exit(0);
        })
    }

    const person = new Person({
        name : process.argv[3],
        number : process.argv[4]
    })
    
    person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook!`)
        mongoose.connection.close()
    })

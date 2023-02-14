require('dotenv').config();

const express = require('express')
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

app.use(express.json());
app.use(morgan('tiny'))
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const Person = require('./models/person');

// root of the server
app.get('/', (request, response) => {
    response.send('<h1>Hello!</h1>');
})

// gets all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
})

// gives information about phonebook
app.get('/info', (request, response) => {
  response.send(`<h3>Phonebook has info of ${persons.length} people<h3>
        <h3>${new Date()}</h3>        
  `);
})

//gets a specific person with a specific id
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person);
  })
})

//deletes a person by id
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
  .then(person => {
    response.status(204).json(person);
  })
})

// adds a person to the phonebook
app.post('/api/persons', (request, response) => {
  const body = request.body;
  if(!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name and number are required' 
    });
  }

  const person = new Person({
    name : body.name,
    number : body.number
  })
  person.save().then(savedPerson => {
    console.log(savedPerson)
    return response.status(201).json(savedPerson);
  })
});


const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
const express = require('express')
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dbUrl = 'mongodb+srv://phonebook:phonebook@cluster0.nkys2oh.mongodb.net/?retryWrites=true&w=majority';

mongoose.set('strictQuery', false);

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

app.use(express.json());
app.use(morgan('tiny'))
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// root of the server
app.get('/', (request, response) => {
    response.send('<h1>Hello!</h1>');
})

// gets all persons
app.get('/api/persons', (request, response) => {
    response.json(persons);
})

// gives information about phonebook
app.get('/info', (request, response) => {
  response.send(`<h3>Phonebook has info of ${persons.length} people<h3>
        <h3>${new Date()}</h3>        
  `);
})

//gets a specific person with a specific id
app.get('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const person = persons.find(p => p.id === id);
  if(person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

//deletes a person by id
app.delete('/api/persons/:id', (request, response) => {
  const id = parseInt(request.params.id);
  persons = persons.filter(p => p.id !== id);
  
  response.status(204).end();
})

// adds a person to the phonebook
app.post('/api/persons', (request, response) => {
  const person = request.body;
  if(!person.name || !person.number) {
    return response.status(400).json({ 
      error: 'name and number are required' 
    });
  } else if(persons.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: 'name already exists'
    })
  }
  person.id = Math.floor(Math.random() * 10000).toString();
  persons.push(person);
  response.status(201).json(person);
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
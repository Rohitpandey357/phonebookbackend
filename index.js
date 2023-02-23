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
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
  .catch(error => next(error));
})

// gives information about phonebook
app.get('/info', (request, response, next) => {
  Person.countDocuments().then(count => {
    response.send(`<h3>Phonebook has info of ${count} people<h3>
        <h3>${new Date()}</h3>`)
  })
  .catch(error => next(error));
  
})

//gets a specific person with a specific id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  })
  .catch(error => next(error));
})

//deletes a person by id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(person => {
    response.status(204).json(person);
  })
  .catch(error => next(error))
})

// adds a person to the phonebook
app.post('/api/persons', (request, response, next) => {
  
  const body = request.body;
  const person = new Person({
    name : body.name,
    number : body.number
  })

  person.save().then(savedPerson => {
    console.log(savedPerson)
    return response.status(201).json(savedPerson);
  })
  .catch(error => next(error));
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name : body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, 
      {new: true, runValidators: true, context: 'query'}
    )
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error)); 
})

//unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndpoint);

//invalid id
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id', id : `${request.params.id}`})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
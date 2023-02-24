const personsRouter = require('express').Router();
const Person = require('../models/person');

// gets all persons
personsRouter.get('/', (request, response, next) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  })
    .catch((error) => next(error));
});

// gives information about phonebook
personsRouter.get('/info', (request, response, next) => {
  Person.countDocuments().then((count) => {
    response.send(`<h3>Phonebook has info of ${count} people<h3>
          <h3>${new Date()}</h3>`);
  })
    .catch((error) => next(error));
});

// gets a specific person with a specific id
personsRouter.get('/:id', (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  })
    .catch((error) => next(error));
});

// deletes a person by id
personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((person) => {
      response.status(204).json(person);
    })
    .catch((error) => next(error));
});

// adds a person to the phonebook
personsRouter.post('/', (request, response, next) => {
  const { body } = request;
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    console.log(savedPerson);
    return response.status(201).json(savedPerson);
  })
    .catch((error) => next(error));
});

personsRouter.put('/:id', (request, response, next) => {
  const { body } = request;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(cors())

app.use(bodyParser.json())

morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  },
]

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.count({}).then(count => {
    const personInfo = `Puhelinluettelossa ${count} henkilön tiedot`
    response.send(`<p>${personInfo}</p><p>${Date()}</p>`)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()      
    }
  }).catch(error => next(error))
})

const generateId = () => {
  return Math.floor(Math.random() * 999999)
}

app.post('/api/persons', (request, response, next) => {
  const {name, number} = request.body

  if (name === undefined) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (number === undefined) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = new Person({
    name, number
  })

  person.save().then(person => {
    response.json(person)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  if (name === undefined) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (number === undefined) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person = {
    name, number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new:true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson.toJSON())
      } else {
        response.status(404).end()      
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    console.log('deleted', result)
    response.status(204).end();
  }).catch(error => next(error))
});

app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(Person.format(person))
        })
        .catch(error => {
            console.log(error)
            response.status(404).end()
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/info', (request, response) => {
    const amount = persons.length
    response.send("puhelinluettelossa " + amount + " henkilön tiedot<br><br>" + new Date())
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }
    Person
        .findOne({ name: body.name })
        .then(result => {
            if (result === null) {
                const person = new Person({
                    name: body.name,
                    number: body.number
                })
                person
                    .save()
                    .then(savedPerson => {
                        response.json(Person.format(savedPerson))
                    })
                    .catch(error => {
                        console.log(error)
                        response.status(404).end()
                    })
            }
            else {
                response.status(400).json({ error: 'person already exists' })
            }
        })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
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

const formatPerson = (person) => {
    return {
        id: person._id,
        name: person.name,
        number: person.number
    }
}

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(formatPerson))
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(formatPerson(person))
        })
})

app.get('/info', (request, response) => {
    const amount = persons.length
    response.send("puhelinluettelossa " + amount + " henkilön tiedot<br><br>" + new Date())
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (persons.map(a => a.name).includes(body.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    if (body.name === undefined) {
        return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            response.json(formatPerson(savedPerson))
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const express = require('express')
const app = express()

let numbers = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Martti Tienari',
        number: '040-123456',
    },
    {
        id: 3,
        name: 'Arto Järvinen',
        number: '040-123456',
    },
    {
        id: 4,
        name: 'Lea Kutvonen',
        number: '040-123456',
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/numbers', (request, response) => {
    response.json(numbers)
})

app.get('/api/numbers/:id', (request, response) => {
    const id = Number(request.params.id)
    const number = numbers.find(number => number.id === id)

    if (number) {
        response.json(number)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const amount = numbers.length
    response.send("puhelinluettelossa " + amount + " henkilön tiedot<br><br>" + new Date())
})

app.delete('/numbers/:id', (request, response) => {
    const id = Number(request.params.id)
    numbers = numbers.filter(number => number.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
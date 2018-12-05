const mongoose = require('mongoose')

const url = ''

mongoose.connect(url)

const Person = mongoose.model('Person', {
    id: Number,
    name: String,
    number: String
})

if (process.argv.length > 2) {
    const person = new Person({
        id: Math.floor(Math.random() * 99999),
        name: process.argv[2],
        number: process.argv[3]
    })
    person
        .save()
        .then(response => {
            console.log('person saved!')
            mongoose.connection.close()
        })
}
else {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
}
const mongoose = require('mongoose')

const user = 'student'
const password = process.argv[2]

const url = `mongodb://${user}:${password}@ds127995.mlab.com:27995/fullstackopen`
mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('puhelinluettelo')

    result.forEach(({ name, number }) => {
      console.log(name, number)
    })

    mongoose.connection.close()
  })
  return
}

const name = process.argv[3]
const number = process.argv[4]

const person = new Person({
  name,
  number
})

person.save().then(({ name, number }) => {
  console.log('lisätään', name, 'numero', number, 'luetteloon')
  mongoose.connection.close()
})
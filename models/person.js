const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

mongoose.connect(url, {useNewUrlParser: true})
.then(result => console.log('Connected to MongoDB'))
.catch(error => console.log('Failed to connect to MongoDB'))

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  number: { type: String, required: true }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
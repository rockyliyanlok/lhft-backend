const mongoose = require('mongoose')

const schema = mongoose.Schema({
	symbol: String,
	price: Number,
}, {
  timestamps: { 
    createdAt: true,
    updatedAt: false
  }
})

module.exports = mongoose.model('History', schema)

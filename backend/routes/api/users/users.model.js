const {Schema, model} = require('mongoose');
const scheme = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
      },
    emailAddress: {
        type: String,
        trim: true,
        required: true
    },
    accountNumber: {
      type: Number,
      required: true
    },
    identifyNumber: {
      type: String,
      default: null
    },
   
}, {timestamps: true, versionKey: false})
module.exports = model('Users', scheme, 'users');
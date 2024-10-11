const mongoose = require('mongoose')
const { v4 } = require('uuid')


const OTPSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4
    },
    email: {
        type: String
    },
    OTP: {
        type: Number
    },
    created: {
        type: String
    },
    used: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


const SaveOTP = mongoose.model('otp', OTPSchema);

module.exports = {
    SaveOTP
}




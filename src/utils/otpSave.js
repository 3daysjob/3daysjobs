const { SaveOTP } = require('../models/otp.model')
const moment = require('moment')


const saveOTP = async (data) => {
    const { email, OTP } = data
    const findEmail = await SaveOTP.findOne({ email })
    const timeStamp = moment()
    if (findEmail) {
        const update = await SaveOTP.findByIdAndUpdate({ _id: findEmail._id }, { OTP: OTP, created: timeStamp, used: false })
        return update
    } else {
        const creation = await SaveOTP.create({ email: email, OTP: OTP, created: timeStamp })
        return creation
    }

}



module.exports = {
    saveOTP
}
const mongoose = require('mongoose')
// const bcrypt = require('bcryptjs')

//? Create a new schema for the user
const userSchema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   required: true,
    // },
    // email: {
    //   type: String,
    //   unique: true,
    // },
    // password: {
    //   type: String,
    //   required: true,
    // },
    jwtToken: {
      type: String,
    },
  },
  { timestamps: true }
)

//? Hash the password before saving the user
// userSchema.pre('save', async function (next) {
//   const user = this

//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 10)
//   }

//   next()
// })

//? Compare the password with the hashed password
// userSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password)
// }

module.exports = mongoose.model('User', userSchema)

const bcrypt = require('@node-rs/bcrypt')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password:{
        type: String
    }
})

  //Password hash middleware
  userSchema.pre("save", async function save(next) {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    try {
      user.password = await bcrypt.hash(user.password, 10);
      next();
    } catch (err) {
      next(err);
    }
  });

  /**
   * Helper method for validating user's password.
   */
  userSchema.methods.comparePassword = async function comparePassword(
    candidatePassword,
    cb
  ) {
    try {
      cb(null, await bcrypt.verify(candidatePassword, this.password));
    } catch (err) {
      cb(err);
    }
  };

  const user = mongoose.model("User", userSchema);

  module.exports = user;
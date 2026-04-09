const { Schema, model } = require("mongoose")
const plm = require("passport-local-mongoose")

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
  }
)

UserSchema.plugin(plm)
module.exports = model("User", UserSchema)

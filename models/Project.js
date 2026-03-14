const { Schema, model } = require("mongoose")

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    categories: Array,
    place: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      rquired: true,
    },
    images: Array,
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model("Project", ProjectSchema)

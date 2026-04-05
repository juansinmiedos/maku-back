const { Schema, model, ObjectId } = require("mongoose")

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
      required: true,
    },
    images: Array,
    relatedProjects: [{
      type: ObjectId,
      ref: "Project"
    }],
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model("Project", ProjectSchema)

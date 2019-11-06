const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema(
  {
    workoutName: { type: String, required: true, unique: true },
    trainer: { type: String, required: true },
    timeExpectedToComplete: { type: String },
    muscleGroup: {
      type: String,
      enum: [
        "full body, legs, chest, back, tricep, quads, hamstrings, bicep, shoulders,abs"
      ],
      default: "ful body"
    },
    setOne: {
      type: Array
    },
    setTwo: {
      type: Array
    },
    setThree: {
      type: Array
    },
    setFour: {
      type: Array
    },
    setFive: {
      type: Array
    },
    setSix: {
      type: Array
    },
    setSeven: {
      type: Array
    },
    setEight: {
      type: Array
    },
    setNine: {
      type: Array
    },
    setTen: {
      type: Array
    },
    setEleven: {
      type: Array
    },
    setTwelve: {
      type: Array
    },
    timesViewed: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Workout = mongoose.model("Workout", workoutSchema);
module.exports = Workout;

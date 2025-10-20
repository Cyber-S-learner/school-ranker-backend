import mongoose from "mongoose";

const DivisionSchema = new mongoose.Schema({
  first: Number,
  second: Number,
  third: Number
}, { _id: false });

const StreamSchema = new mongoose.Schema({
  registered: Number,
  appeared: Number,
  passed: Number,
  passPercentage: Number,
  divisions: DivisionSchema
}, { _id: false });

const SchoolSchema = new mongoose.Schema({
  schoolCode: { type: String, required: true, unique: true },
  schoolName: String,
  district: String,
  streams: {
    tenth: StreamSchema,
    science: StreamSchema,
    commerce: StreamSchema,
    arts: StreamSchema
  }
});

// ⚠️ Explicitly specify collection name “schools”
const School = mongoose.model("School", SchoolSchema, "schools");

export default School;

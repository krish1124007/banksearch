import mongoose from "mongoose";

// Reusable schema for age details
const AgeCriteriaSchema = new mongoose.Schema({
    min_age: {
        type: Number,
        required: true
    },
    max_age: {
        type: Number,
        required: true
    },
    extension_age_period: {
        type: Number, // number of years/months as extension
        default: 0
    }
}, { _id: false });

// Main schema for age criteria of both employment types
const EmploymentAgeCriteriaSchema = new mongoose.Schema({
    salaried: {
        type: AgeCriteriaSchema,
        required: true
    },
    self_employed: {
        type: AgeCriteriaSchema,
        required: true
    }
});

export const AgeCriteria = mongoose.model("AgeCriteria", EmploymentAgeCriteriaSchema);

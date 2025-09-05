import mongoose from "mongoose";

// Reusable schema for each insurance type
const InsuranceDetailSchema = new mongoose.Schema({
    mandatory: {
        type: Boolean,
        required: true,
        default: false
    },
    full: {
        type: Boolean,
        required: true,
        default: false
    },
    less_tensor: {
        type: Boolean,
        required: true,
        default: false
    },
    lumsum: {
        type: Boolean,
        required: true,
        default: false
    }
}, { _id: false }); // Disable _id for subdocuments

// Main Insurance schema
const InsuranceSchema = new mongoose.Schema({
    life_insurance: {
        type: InsuranceDetailSchema,
        required: true
    },
    property_insurance: {
        type: InsuranceDetailSchema,
        required: true
    },
    health_insurance: {
        type: InsuranceDetailSchema,
        required: true
    }
});

export const Insurance = mongoose.model("Insurance", InsuranceSchema);

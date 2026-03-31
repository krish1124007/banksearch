import mongoose from "mongoose";

const CaseStudySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const CaseStudy = mongoose.model("CaseStudy", CaseStudySchema);

import mongoose from "mongoose";

// FOIR Slab Schema
const FOIRSlabSchema = new mongoose.Schema({
    income_range: { type: String, required: true }, // e.g., "Upto 30k"
    foir_gross: { type: String, required: true },   // e.g., "40%"
    foir_net: { type: String, required: true }      // e.g., "50%"
}, { _id: false });

// Salaried Policy Schema
const SalariedPolicySchema = new mongoose.Schema({
    foir_slabs: {
        type: [FOIRSlabSchema],
        required: true
    },
    cash_salary_accepted: {
        type: Boolean,
        required: true
    },
    additional_income: {
        rent: { type: Boolean, required: true },
        future_rental: { type: Boolean, required: true },
        incentive: { type: Boolean, required: true }
    },
    company_type: {
        MNC: { type: Boolean, default: false },
        Govt: { type: Boolean, default: false },
        PvtLtd: { type: Boolean, default: false },
        LLP: { type: Boolean, default: false },
        Partnership: { type: Boolean, default: false },
        Trust: { type: Boolean, default: false },
        Individual: { type: Boolean, default: false }
    },
    deduction: {
        PF: { type: Boolean, default: false },
        PT: { type: Boolean, default: false },
        no_deduction: { type: Boolean, default: false }
    }
}, { _id: false });

// Self-Employed Policy Schema
const SelfEmployedPolicySchema = new mongoose.Schema({
    banking_surrogate: { type: Boolean, default: false },
    gst_surrogate: { type: Boolean, default: false },
    rtr_surrogate: { type: Boolean, default: false },
    industry_margin_surrogate: { type: Boolean, default: false },
    gross_profit_surrogate: { type: Boolean, default: false },
    lip: { type: Boolean, default: false },
    low_ltv: { type: Boolean, default: false },
    foir: { type: Boolean, default: false },
    combo: { type: Boolean, default: false },
    not_selected_text_1: { type: String },
    not_selected_text_2: { type: String }
}, { _id: false });

// CIBIL Schema
const CIBILSchema = new mongoose.Schema({
    min_score: {
        type: Number,
        required: true
    },
    call_accepted: {
        type: Boolean,
        required: true
    },
    accepted_type: {
        type: [String], // e.g., ["Old", "Recent"]
        enum: ["Old", "Recent"],
        default: []
    },
    current_bounce_accepted: {
        type: Boolean,
        required: true
    }
}, { _id: false });

// Main Policy Schema
const PolicySchema = new mongoose.Schema({
    salaried: {
        type: SalariedPolicySchema,
        required: true
    },
    self_employed: {
        type: SelfEmployedPolicySchema,
        required: true
    },
    cibil: {
        type: CIBILSchema,
        required: true
    },
    usp_description: {
        type: String,
        required: false
    }
});


export const Policy = mongoose.model("Policy", PolicySchema);

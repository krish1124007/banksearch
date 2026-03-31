import mongoose from "mongoose";

// FOIR Slab Schema
const FOIRSlabSchema = new mongoose.Schema({
    income_range: { type: String }, // e.g., "Upto 30k"
    foir_gross: { type: String },   // e.g., "40%"
    foir_net: { type: String }      // e.g., "50%"
}, { _id: false });

// Salaried Policy Schema
const SalariedPolicySchema = new mongoose.Schema({
    foir_slabs: {
        type: [FOIRSlabSchema]
    },
    cash_salary_accepted: {
        type: Boolean
    },
    additional_income: {
        rent: { type: Boolean },
        future_rental: { type: Boolean },
        incentive: { type: Boolean }
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

// Banking Surrogate Details Schema
const BankingSurrogateDetailsSchema = new mongoose.Schema({
    dates: { type: String }, // 6 numbers with comma e.g. "1,5,10,15,20,25"
    period: { type: String, enum: ['6_month', '9_month', '1_year'], default: '6_month' },
    foir_of_abb: { type: Number }, // in %
    max_club_account: { type: Number } // in number
}, { _id: false });

// LIP Details Schema
const LIPDetailsSchema = new mongoose.Schema({
    max_multiple: { type: Number },
    foir: { type: Number }
}, { _id: false });

// DOD Details Schema
const DODDetailsSchema = new mongoose.Schema({
    renewal_charges: { type: Boolean, default: false },
    renewal_charges_value: { type: Number, default: 0 }, // Amount or %
    renewal_charges_type: { type: String, enum: ['amount', 'percentage'], default: 'amount' },
    utilization_ratio_quarterly: { type: Number }, // in %
    turnover_ratio_applicable: { type: Boolean, default: false }
}, { _id: false });

// Self-Employed Policy Schema
const SelfEmployedPolicySchema = new mongoose.Schema({
    banking_surrogate: { type: Boolean, default: false },
    banking_surrogate_details: { type: BankingSurrogateDetailsSchema },
    gst_surrogate: { type: Boolean, default: false },
    gst_surrogate_ratio: { type: Number, default: 0 },
    rtr_surrogate: { type: Boolean, default: false },
    rtr_surrogate_ratio: { type: Number, default: 0 },
    industry_margin_surrogate: { type: Boolean, default: false },
    industry_margin_surrogate_ratio: { type: Number, default: 0 },
    gross_profit_surrogate: { type: Boolean, default: false },
    gross_profit_surrogate_ratio: { type: Number, default: 0 },
    lip: { type: Boolean, default: false },
    lip_details: { type: LIPDetailsSchema },
    low_ltv: { type: Boolean, default: false },
    low_ltv_ratio: { type: Number },
    low_ltv_max_amount: { type: Number },
    foir: { type: Boolean, default: false },
    se_foir_slabs: { type: [FOIRSlabSchema], default: [] },
    combo: { type: Boolean, default: false },
    abb_required: { type: Boolean, default: false },
    abb_ratio: { type: Number },
    dod: { type: Boolean, default: false },
    dod_details: { type: DODDetailsSchema },
    itr_required: { type: String, enum: ['1_year', '2_year', '3_year'], default: '2_year' },
    bcp_years: { type: Number }, // Business Continuity Proof - years old
    not_selected_text_1: { type: String },
    not_selected_text_2: { type: String }
}, { _id: false });

// CIBIL Schema
const CIBILSchema = new mongoose.Schema({
    min_score: {
        type: Number
    },
    call_accepted: {
        type: Boolean
    },
    accepted_type: {
        type: [String], // e.g., ["Old", "Recent"]
        enum: ["Old", "Recent"],
        default: []
    },
    current_bounce_accepted: {
        type: Boolean
    }
}, { _id: false });

// Main Policy Schema
const PolicySchema = new mongoose.Schema({
    salaried: {
        type: SalariedPolicySchema
    },
    self_employed: {
        type: SelfEmployedPolicySchema
    },
    cibil: {
        type: CIBILSchema
    },
    usp_description: {
        type: String
    }
});


export const Policy = mongoose.model("Policy", PolicySchema);

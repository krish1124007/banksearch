import mongoose from "mongoose";

const BankSchema = new mongoose.Schema({
    bank_details: {
        bank_name: {
            type: String,
            required: true
        },
        bank_sm_name: {
            type: String
        },
        bank_sm_contact_number: {
            type: String
        },
        bank_rsm_name: {
            type: String
        },
        bank_rsm_contact_number: {
            type: String
        }
    },

    home_loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HomeLone"
    },
    mortgage_loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MortgageLoan"
    },
    commercial_loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommercialPurchase"
    },
    industrial_loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IndustrialPurchase"
    },
    construction_finance_loan: {
        type: Boolean
    },
    cgtmse_loan: {
        type: Boolean
    },
    machinary_loan: {
        type: Boolean
    },
    login_fees: {
        login_salaried: {
            type: Number
        },
        login_self_employed: {
            type: Number
        }
    },
    insurance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Insurance"
    },
    tenor_salaried: {
        to: {
            type: Number
        },
        from: {
            type: Number
        }
    },
    tenor_self_employed: {
        to: {
            type: Number
        },
        from: {
            type: Number
        }
    },
    geo_limit: {
        type: Number
    },
    age: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AgeCriteria"
    },
    legal_charges: {
        type: Number,
        default: 0
    },
    processing_fees: {
        type: Number,
        default: 0
    },
    valuation_charges: {
        type: Number,
        default: 0
    },
    extra_work: {
        type: Number,
        default: 0
    },
    // Extra work disbursement - customer account or 3rd party account
    extra_work_disbursement: {
        type: [String],
        enum: ['customer_account', '3rd_party_account'],
        default: []
    },
    parallel_funding: {
        enabled: { type: Boolean, default: false },
        stage_percentage: { type: Number, default: 0 }
    },
    margin_money: {
        required: { type: Boolean, default: false },
        ratio: { type: Number, default: 0 } // in %
    },
    dod: {
        type: Number,
        default: 0
    },
    policy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Policy"
    },
    additional_notes: {
        type: String,
        default: ""
    }
})


export const Bank = mongoose.model("Bank", BankSchema)
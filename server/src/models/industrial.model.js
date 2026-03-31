import mongoose from "mongoose";

const IndustrialPurchaseSchema = new mongoose.Schema({
    industrial_loan: {
        type: Boolean,
        default: false
    },
    builder_purchase: {
        type: Boolean,
        default: false
    },
    resale: {
        type: Boolean,
        default: false
    },
    interest_rate: {
        salaried: {
            from: {
                type: Number
            },
            to: {
                type: Number
            },
            foir: {
                type: Number
            }
        },
        non_salaried: {
            from: {
                type: Number
            },
            to: {
                type: Number
            },
            foir: {
                type: Number
            }
        }
    },
    LTV: {
        type: String
    },
    loan_ticket_size: {
        to: {
            type: Number,
            default: 0
        },
        from: {
            type: Number,
            default: 0
        }
    }
});

export const IndustrialPurchase = mongoose.model("IndustrialPurchase", IndustrialPurchaseSchema);

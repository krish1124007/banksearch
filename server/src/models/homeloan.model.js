import mongoose from "mongoose";

const HomeLoanSchema = new mongoose.Schema({
    home_loan: {
        type: Boolean,
        default: false
    },
    under_construction: {
        type: Boolean,
        default: false
    },
    ready_possession: {
        type: Boolean,
        default: false
    },
    resale: {
        type: Boolean,
        default: false
    },
    balance_transfer: {
        type: Boolean,
        default: false
    },
    balance_transfer_and_topup: {
        type: Boolean,
        default: false
    },
    plot_purchase: {
        type: Boolean,
        default: false
    },
    plot_plus_construction: {
        type: Boolean,
        default: false
    },
    pg: {
        type: Boolean,
        default: false
    },
    city_area: {
        type: Boolean,
        default: false
    },
    old_age_property: {
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
    nir_home_loan: {
        salary_in_dollar: {
            type: Boolean,
            default: false
        },
        visa_type: {
            type: String
        }
    },
    layout_plan: {
        type: Number
    },
    unit_plan: {
        type: Number
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
})

export const HomeLoan = mongoose.model('HomeLoan', HomeLoanSchema)

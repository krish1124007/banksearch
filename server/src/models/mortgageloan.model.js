import mongoose from "mongoose";

const MortgageLoanSchema = new mongoose.Schema({
    // Residential
    mortgage_loan: {
        type: Boolean,
        default: false
    },
    residential_self_occupied: {
        type: Boolean,
        default: false
    },
    residential_rented: {
        type: Boolean,
        default: false
    },
    residential_vacant: {
        type: Boolean,
        default: false
    },

    // Commercial
    commercial_self_occupied: {
        type: Boolean,
        default: false
    },
    commercial_rented: {
        type: Boolean,
        default: false
    },
    commercial_vacant: {
        type: Boolean,
        default: false
    },

    // Industrial
    industrial_self_occupied: {
        type: Boolean,
        default: false
    },
    industrial_rented: {
        type: Boolean,
        default: false
    },
    industrial_vacant: {
        type: Boolean,
        default: false
    },

    // Plot types
    plot_residential: {
        type: Boolean,
        default: false
    },
    plot_commercial: {
        type: Boolean,
        default: false
    },
    plot_industrial: {
        type: Boolean,
        default: false
    },

    // Godown
    godown_self_occupied: {
        type: Boolean,
        default: false
    },
    godown_rented: {
        type: Boolean,
        default: false
    },
    godown_vacant: {
        type: Boolean,
        default: false
    },

    // Warehouse
    warehouse_self_occupied: {
        type: Boolean,
        default: false
    },
    warehouse_rented: {
        type: Boolean,
        default: false
    },
    warehouse_vacant: {
        type: Boolean,
        default: false
    },

    // School
    school_self_occupied: {
        type: Boolean,
        default: false
    },
    school_rented: {
        type: Boolean,
        default: false
    },

    // PG (Paying Guest)
    pg_self_occupied: {
        type: Boolean,
        default: false
    },
    pg_rented: {
        type: Boolean,
        default: false
    },
    pg_vacant: {
        type: Boolean,
        default: false
    },

    // Hospital
    hospital_self_occupied: {
        type: Boolean,
        default: false
    },
    hospital_rented: {
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

export const MortgageLoan = mongoose.model("MortgageLoan", MortgageLoanSchema);

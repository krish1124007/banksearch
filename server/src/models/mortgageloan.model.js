import mongoose from "mongoose";

const MortgageLoanSchema = new mongoose.Schema({
    // Residential
    mortgage_loan:{
        type:Boolean,
        required:true,
        default:false
    },
    residential_self_occupied: {
        type: Boolean,
        required: true,
        default: false
    },
    residential_rented: {
        type: Boolean,
        required: true,
        default: false
    },
    residential_vacant: {
        type: Boolean,
        required: true,
        default: false
    },

    // Commercial
    commercial_self_occupied: {
        type: Boolean,
        required: true,
        default: false
    },
    commercial_rented: {
        type: Boolean,
        required: true,
        default: false
    },
    commercial_vacant: {
        type: Boolean,
        required: true,
        default: false
    },

    // Industrial
    industrial_self_occupied: {
        type: Boolean,
        required: true,
        default: false
    },
    industrial_rented: {
        type: Boolean,
        required: true,
        default: false
    },
    industrial_vacant: {
        type: Boolean,
        required: true,
        default: false
    },

    // Plot types
    plot_residential: {
        type: Boolean,
        required: true,
        default: false
    },
    plot_commercial: {
        type: Boolean,
        required: true,
        default: false
    },
    plot_industrial: {
        type: Boolean,
        required: true,
        default: false
    },

    // Godown
    godown_self_occupied: {
        type: Boolean,
        required: true,
        default: false
    },
    godown_rented: {
        type: Boolean,
        required: true,
        default: false
    },
    godown_vacant: {
        type: Boolean,
        required: true,
        default: false
    },

    // Warehouse
    warehouse_self_occupied: {
        type: Boolean,
        required: true,
        default: false
    },
    warehouse_rented: {
        type: Boolean,
        required: true,
        default: false
    },
    warehouse_vacant: {
        type: Boolean,
        required: true,
        default: false
    },

    // School
    school_self_occupied: {
        type: Boolean,
        required: true,
        default: false
    },
    school_rented: {
        type: Boolean,
        required: true,
        default: false
    },

    // PG (Paying Guest)
    pg_self_occupied: {
        type: Boolean,
        required: true,
        default: false
    },
    pg_rented: {
        type: Boolean,
        required: true,
        default: false
    },
    pg_vacant: {
        type: Boolean,
        required: true,
        default: false
    },

    // Hospital
    hospital_self_occupied: {
        type: Boolean,
        required: true,
        default: false
    },
    hospital_rented: {
        type: Boolean,
        required: true,
        default: false
    },
    interest_rate: {
        salaried: {
            from: {
                type: Number,
                required: true
            },
            to: {
                type: Number,
                required: true
            },
            foir:{
                type:Number,
                required:true
            }
        },
        non_salaried: {
            from: {
                type: Number,
                required: true
            },
            to: {
                type: Number,
                required: true
            },
            foir:{
                type:Number,
                required:true
            }
        }


    },
  LTV:{
    type:String
  }
    ,
    loan_ticket_size:{
        to:{
            type:Number,
            default:0
        },
        from:{
            type:Number,
            default:0
        }
    }
});

export const MortgageLoan = mongoose.model("MortgageLoan", MortgageLoanSchema);

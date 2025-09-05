import mongoose from "mongoose";

const HomeLoanSchema = new mongoose.Schema({
    home_loan: {
        type: Boolean,
        required: true,
        default: false
    },
    under_construction: {
        type: Boolean,
        required: true,
        default: false
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    },
    resale: {
        type: Boolean,
        required: true,
        default: false
    },
    balance_transfer: {
        type: Boolean,
        required: true,
        default: false
    },
    balance_transfer_and_topup: {
        type: Boolean,
        required: true,
        default: false
    },
    plot_purchase: {
        type: Boolean,
        require: true,
        default: false
    },
    plot_plus_construction:
    {
        type: Boolean,
        require: true,
        default: false
    },
    pg: {
        type: Boolean,
        require: true,
        default: false
    },
    city_area: {
        type: Boolean,
        require: true,
        default: false
    },
    old_age_property: {
        type: Boolean,
        require: true,
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
    nir_home_loan:{
        salary_in_dollar:{
            type:Boolean,
            default:false
        },
        visa_type:{
            type:String
        }
    },
    layout_plan:{
        type:Number,
        required:false
    },
    unit_plan:{
        type:Number,
        required:false
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
})

export const HomeLoan = mongoose.model('HomeLoan', HomeLoanSchema)

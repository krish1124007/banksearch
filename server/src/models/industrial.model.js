import mongoose from "mongoose";

const IndustrialPurchaseSchema = new mongoose.Schema({
    industrial_loan:{
        type:Boolean,
        default:false
    },
    builder_purchase: {
        type: Boolean,
        required: true,
        default: false
    },
    resale: {
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

export const IndustrialPurchase = mongoose.model("IndustrialPurchase", IndustrialPurchaseSchema);

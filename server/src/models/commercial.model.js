import mongoose from "mongoose";

const CommercialPurchaseSchema = new mongoose.Schema({
    commercial_loan:{
        type:Boolean,
        required:true,
        default:false
    },
    under_construction: {
        type: Boolean,
        required: true,
        default: false
    },
    builder_purchase_ready: {
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

export const CommercialPurchase = mongoose.model("CommercialPurchase", CommercialPurchaseSchema);

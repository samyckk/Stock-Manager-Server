import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: {
        type: [String],
        required: true
    },
    rates: {
        type: [Number],
        required: true
    },
    weights: {
        type: [Number],
        required: true
    },
    profits: {
        type: [Number],
    }
},
{
    timestamps: true
})

export default mongoose.model('Recipt', UserSchema);
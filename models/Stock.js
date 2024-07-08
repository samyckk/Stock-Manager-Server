import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    purchase: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
},
{
    timestamps: true
})

export default mongoose.model('Stock', UserSchema);
import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    contactInfo: { type: String, required: true },
    representative: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

const Hostel = mongoose.model('Hostel', hostelSchema);
export default Hostel;

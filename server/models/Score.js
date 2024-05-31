import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    score: { type: Number, required: true }
}, {
    timestamps: true
});

const Score = mongoose.model('Score', scoreSchema);
export default Score;

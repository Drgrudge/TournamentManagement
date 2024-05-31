import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true }, // Change this line
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);
export default Team;

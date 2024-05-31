import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  participation: { type: String, required: true, enum: ['Solo', 'Team'] },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
import Event from '../models/Event.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Hostel from '../models/Hostel.js';

// Participate in a solo event
export const participateSolo = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      console.error('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.participation !== 'Solo') {
      console.error('This event is not a solo event');
      return res.status(400).json({ message: 'This event is not a solo event' });
    }

    const user = await User.findById(userId).populate('hostel');
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    event.participants.push(userId);
    await event.save();

    res.json({ message: 'Successfully registered for the solo event' });
  } catch (error) {
    console.error('Error registering for solo event:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a team for a team event
export const createTeam = async (req, res) => {
  const { eventId, teamName } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      console.error('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.participation !== 'Team') {
      console.error('This event is not a team event');
      return res.status(400).json({ message: 'This event is not a team event' });
    }

    const user = await User.findById(userId).populate('hostel');
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'HostelRepresentative') {
      console.error('Only hostel representatives can create teams');
      return res.status(403).json({ message: 'Only hostel representatives can create teams' });
    }

    const team = new Team({ name: teamName, event: eventId, members: [userId], hostel: user.hostel._id });
    await team.save();

    event.teams.push(team._id);
    await event.save();

    res.json({ message: 'Successfully created the team', team });
  } catch (error) {
    console.error('Error creating team:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add user to a team
export const addUserToTeam = async (req, res) => {
  const { teamId } = req.params;
  const { userId } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    team.members.push(userId);
    await team.save();

    res.json({ message: 'Successfully added user to the team', team });
  } catch (error) {
    console.error('Error adding user to team:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

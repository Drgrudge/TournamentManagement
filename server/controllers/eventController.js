import Event from '../models/Event.js';
import Team from '../models/Team.js';

// Create a new event
export const createEvent = async (req, res) => {
  const { name, type, date, venue, participation } = req.body;

  try {
    const event = new Event({ name, type, date, venue, participation });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit an event
export const editEvent = async (req, res) => {
  const { id } = req.params;
  const { name, type, date, venue, participation } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.name = name || event.name;
    event.type = type || event.type;
    event.date = date || event.date;
    event.venue = venue || event.venue;
    event.participation = participation || event.participation;

    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Participate in a solo event
export const participateSolo = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.participants.push(userId);
    await event.save();
    res.json({ message: 'Successfully registered for the solo event' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a team for an event
export const createTeam = async (req, res) => {
  const { name, eventId, hostel } = req.body;

  console.log('Received payload:', req.body); // Log the payload

  try {
    // Check if all required fields are provided
    if (!name || !eventId || !hostel) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create the team
    const team = new Team({ name, event: eventId, hostel });
    await team.save();

    // Update the event with the new team
    event.teams.push(team._id);
    await event.save();

    res.json({ message: 'Successfully created the team' });
  } catch (error) {
    console.error('Error creating team:', error); // Log the full error object
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
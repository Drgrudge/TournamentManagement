import Hostel from '../models/Hostel.js';

export const createHostel = async (req, res) => {
    const { name, location, contactInfo, representative } = req.body;
    try {
        const hostel = new Hostel({ name, location, contactInfo, representative });
        await hostel.save();
        res.status(201).json(hostel);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getHostels = async (req, res) => {
    try {
        const hostels = await Hostel.find().populate('representative', 'name email');
        res.json(hostels);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

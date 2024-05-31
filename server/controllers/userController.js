import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Hostel from '../models/Hostel.js';

// Register a new user
export const register = async (req, res) => {
  const { name, email, password, role, hostel } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword, role, hostel });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostel: user.hostel, // Include hostel information
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostel: user.hostel, // Include hostel information
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Change user password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role _id hostel');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Assign or demote hostel representative
export const assignHostelRepresentative = async (req, res) => {
  const { userId, hostelId, action } = req.body; // action can be 'assign' or 'demote'
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'assign') {
      user.role = 'HostelRepresentative';
    } else if (action === 'demote') {
      user.role = 'HostelBoarder';
    }
    await user.save();

    if (action === 'assign') {
      const hostel = await Hostel.findById(hostelId);
      if (!hostel) {
        return res.status(404).json({ message: 'Hostel not found' });
      }
      hostel.representative = userId;
      await hostel.save();
    } else if (action === 'demote') {
      const hostel = await Hostel.findOne({ representative: userId });
      if (hostel) {
        hostel.representative = null;
        await hostel.save();
      }
    }

    res.json({ message: `User ${action === 'assign' ? 'assigned as' : 'demoted from'} representative successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users by hostel
export const getUsersByHostel = async (req, res) => {
  const { hostelId } = req.params;
  try {
    const users = await User.find({ hostel: hostelId, role: 'HostelBoarder' });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users by hostel:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

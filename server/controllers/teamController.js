import Team from '../models/Team.js';
import User from '../models/User.js';

export const createTeam = async (req, res) => {
  const { name, event, members, hostel } = req.body;
  try {
    const team = new Team({ name, event, members, hostel });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('event', 'name').populate('hostel', 'name').populate('members', 'name email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addMemberToTeam = async (req, res) => {
  const { teamId } = req.params;
  const { userIds } = req.body;

  try {
    const team = await Team.findById(teamId).populate('hostel');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const users = await User.find({ _id: { $in: userIds }, hostel: team.hostel._id });
    if (users.length !== userIds.length) {
      return res.status(400).json({ message: 'Some users do not belong to the same hostel as the team' });
    }

    const newMembers = userIds.filter(userId => !team.members.includes(userId));
    if (newMembers.length === 0) {
      return res.status(400).json({ message: 'All users are already members of the team' });
    }

    team.members.push(...newMembers);
    await team.save();

    res.json({ message: 'Users added to team successfully', team });
  } catch (error) {
    console.error('Error adding users to team:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteMemberFromTeam = async (req, res) => {
  const { teamId, userId } = req.params;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const memberIndex = team.members.indexOf(userId);
    if (memberIndex === -1) {
      return res.status(404).json({ message: 'Member not found in the team' });
    }

    team.members.splice(memberIndex, 1);
    await team.save();

    res.json({ message: 'Member removed from team successfully', team });
  } catch (error) {
    console.error('Error removing member from team:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const replaceMemberInTeam = async (req, res) => {
  const { teamId, oldUserId, newUserId } = req.params;

  try {
    const team = await Team.findById(teamId).populate('hostel');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const oldMemberIndex = team.members.indexOf(oldUserId);
    if (oldMemberIndex === -1) {
      return res.status(404).json({ message: 'Old member not found in the team' });
    }

    const newUser = await User.findById(newUserId);
    if (!newUser || !team.hostel._id.equals(newUser.hostel)) {
      return res.status(400).json({ message: 'New user does not belong to the same hostel as the team' });
    }

    team.members[oldMemberIndex] = newUserId;
    await team.save();

    res.json({ message: 'Member replaced in team successfully', team });
  } catch (error) {
    console.error('Error replacing member in team:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

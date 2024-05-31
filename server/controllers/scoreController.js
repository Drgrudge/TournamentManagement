import Score from '../models/Score.js';

export const addScore = async (req, res) => {
    const { event, team, score } = req.body;
    try {
        const newScore = new Score({ event, team, score });
        await newScore.save();
        res.status(201).json(newScore);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getScores = async (req, res) => {
    try {
        const scores = await Score.find().populate('event', 'name').populate('team', 'name');
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

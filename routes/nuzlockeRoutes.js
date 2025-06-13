import express from 'express';
import NuzlockeRun from '../models/nuzlockeRun.js'; // Import the NuzlockeRun model

const router = express.Router();

/**
 * @route GET /api/nuzlocke/runs
 * @desc Get all Nuzlocke runs for the authenticated user
 * @access Private (requires JWT)
 */
router.get('/runs', async (req, res) => {
    try {
        // req.userId is set by the authenticateToken middleware
        const runs = await NuzlockeRun.find({ userId: req.userId }).sort({ createdAt: -1 }); // Sort by creation date
        res.json(runs);
    } catch (err) {
        console.error('Error fetching runs:', err);
        res.status(500).json({ error: 'Server error while fetching Nuzlocke runs.', details: err.message });
    }
});


/**
 * @route POST /api/nuzlocke/runs
 * @desc Create a new Nuzlocke run
 * @access Private (requires JWT)
 */
router.post('/runs', async (req, res) => {
    try {
        // The userId is automatically added from the authenticated request
        const newRun = new NuzlockeRun({ ...req.body, userId: req.userId });
        await newRun.save();
        res.status(201).json(newRun); // Respond with the newly created run
    } catch (err) {
        console.error('Error creating run:', err);
        res.status(400).json({ error: 'Failed to create Nuzlocke run.', details: err.message });
    }
});

/**
 * @route PUT /api/nuzlocke/runs/:id
 * @desc Update an existing Nuzlocke run
 * @access Private (requires JWT)
 */
router.put('/runs/:id', async (req, res) => {
    try {
        const run = await NuzlockeRun.findById(req.params.id);

        if (!run) {
            return res.status(404).json({ error: 'Nuzlocke run not found.' });
        }

        // Ensure the run belongs to the authenticated user
        if (run.userId.toString() !== req.userId) {
            return res.sendStatus(403); // Forbidden
        }

        // Instead of Object.assign(run, req.body), explicitly define what fields can be updated.
        // This prevents malicious users from trying to modify sensitive fields like 'userId' or 'createdAt'.
        const {
            gameVersion, runName, currentRoute, encounters,
            boxPokemon, gravePokemon, badges, rivalsDefeated, bossesDefeated
        } = req.body;

        if (gameVersion !== undefined) run.gameVersion = gameVersion;
        if (runName !== undefined) run.runName = runName;
        if (currentRoute !== undefined) run.currentRoute = currentRoute;
        if (encounters !== undefined) run.encounters = encounters;
        if (boxPokemon !== undefined) run.boxPokemon = boxPokemon;
        if (gravePokemon !== undefined) run.gravePokemon = gravePokemon;
        if (badges !== undefined) run.badges = badges;
        if (rivalsDefeated !== undefined) run.rivalsDefeated = rivalsDefeated;
        if (bossesDefeated !== undefined) run.bossesDefeated = bossesDefeated;

        // Save the updated run
        await run.save();
        res.json(run);
    } catch (err) {
        console.error('Error updating run:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid run ID format.' });
        }
        res.status(500).json({ error: 'Server error while updating Nuzlocke run.', details: err.message });
    }
});

/**
 * @route DELETE /api/nuzlocke/runs/:id
 * @desc Delete a Nuzlocke run
 * @access Private (requires JWT)
 */
router.delete('/runs/:id', async (req, res) => {
    try {
        const run = await NuzlockeRun.findById(req.params.id);

        if (!run) {
            return res.status(404).json({ error: 'Nuzlocke run not found.' });
        }

        // Ensure the run belongs to the authenticated user
        if (run.userId.toString() !== req.userId) {
            return res.sendStatus(403); // Forbidden
        }

        // Delete the run
        await run.deleteOne(); // Use deleteOne for newer Mongoose versions

        res.json({ message: 'Nuzlocke run deleted successfully!' });
    } catch (err) {
        console.error('Error deleting run:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid run ID format.' });
        }
        res.status(500).json({ error: 'Server error while deleting Nuzlocke run.', details: err.message });
    }
});

export default router;
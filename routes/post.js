const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

router.use(passport.authenticate('jwt', { session: false }));

// Create post
router.post(
    '/',
    [
        body('title', 'Title is required').not().isEmpty(),
        body('body', 'Body is required').not().isEmpty(),
        body('geoLocation.latitude', 'Latitude is required').isFloat(),
        body('geoLocation.longitude', 'Longitude is required').isFloat()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, body, geoLocation } = req.body;
            const post = await Post.create({
                title,
                body,
                createdBy: req.user.id,
                geoLocation
            });

            res.json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Read posts by authenticated user
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({ where: { createdBy: req.user.id } });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update post
router.put('/:id', [
    body('title', 'Title is required').not().isEmpty(),
    body('body', 'Body is required').not().isEmpty(),
    body('geoLocation.latitude', 'Latitude is required').isFloat(),
    body('geoLocation.longitude', 'Longitude is required').isFloat()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const post = await Post.findOne({ where: { id: req.params.id, createdBy: req.user.id } });

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const { title, body, geoLocation } = req.body;

        post.title = title;
        post.body = body;
        post.geoLocation = geoLocation;

        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id, createdBy: req.user.id } });

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        await post.destroy();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Retrieve posts by geo location
router.get('/geo', [
    body('latitude', 'Latitude is required').isFloat(),
    body('longitude', 'Longitude is required').isFloat()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude } = req.body;

    try {
        const posts = await Post.findAll({
            where: {
                geoLocation: {
                    latitude,
                    longitude
                }
            }
        });

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Get count of active and inactive posts
router.get('/count', async (req, res) => {
    try {
        const activeCount = await Post.count({ where: { active: true } });
        const inactiveCount = await Post.count({ where: { active: false } });

        res.json({ active: activeCount, inactive: inactiveCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

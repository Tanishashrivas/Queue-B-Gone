const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const UserController = require('../Controller/userController');


router.get('/', UserController.getUser);
router.get('/:rollno', UserController.getUserByRollno);

// Route to add a new candidate
router.post('/', UserController.addUser);


module.exports = router;
const express = require('express');
const router = express.Router();
const UserController = require('../Controller/userController');


router.get('/', UserController.getUser);
router.get('/:rollno', UserController.getUserByRollno);
router.get('/fingerprint/:fingerprint', UserController.getUserByfingerprint);

router.post('/', UserController.addUser);
router.post('/:rollno', UserController.updateUser);

module.exports = router;
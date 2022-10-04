const express = require('express');
const locationController = require('../controllers/locationController');
const router = express.Router();

router.post('/', locationController.createNewLocation);
router.get('/', locationController.getAllLocations);
router.put('/:id', locationController.updateLocation);


router.post('/trans', locationController.createTransaction);

module.exports = router;
const express = require('express');
const equipController = require('../controllers/equipController');
const router = express.Router();

// Get all departments
// =====================================================================
router.get('/deps', equipController.getDepartments);

// Get categories by department
// =====================================================================
router.get('/deps/cats/:id', equipController.getCategoriesByDep);

// Get models by category
// =====================================================================
router.get('/cats/:idCat', equipController.getModelsByCat);

// Get all categories
// =====================================================================
router.get('/cats', equipController.getCategories);

// Get models by id array
// =====================================================================
router.post('/models', equipController.getModels);

module.exports = router;
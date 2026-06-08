const express = require('express')
const router = express.Router()

console.log('=== DEBUGGING fragments.js ===');

// Check fragments.controller
const fragmentsController = require('../Controllers/fragments.controller');
console.log('fragmentsController type:', typeof fragmentsController);
console.log('fragmentsController keys:', Object.keys(fragmentsController));

const { getFragments, dropFragment, retireFragment, pulseFragment } = fragmentsController;

console.log('getFragments type:', typeof getFragments);
console.log('dropFragment type:', typeof dropFragment);
console.log('retireFragment type:', typeof retireFragment);
console.log('pulseFragment type:', typeof pulseFragment);

// Check middleware
const protect = require('../Middleware/auth.middleware');
console.log('protect type:', typeof protect);

console.log('===========================');

// Only define routes if handlers are valid
if (typeof getFragments !== 'function') console.error('ERROR: getFragments is not a function');
if (typeof dropFragment !== 'function') console.error('ERROR: dropFragment is not a function');
if (typeof retireFragment !== 'function') console.error('ERROR: retireFragment is not a function');
if (typeof pulseFragment !== 'function') console.error('ERROR: pulseFragment is not a function');
if (typeof protect !== 'function') console.error('ERROR: protect is not a function');

router.get('/', getFragments)
router.post('/', protect, dropFragment)
router.patch('/:id', protect, retireFragment)
router.post('/:id/pulse', protect, pulseFragment)

module.exports = router
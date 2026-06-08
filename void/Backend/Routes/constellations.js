const express = require('express')
const router = express.Router()
const { getFragments, dropFragment, retireFragment, pulseFragment } = require('../Controllers/fragments.controller')
const protect = require('../Middleware/auth.middleware')

router.get('/', getFragments)
router.post('/', protect, dropFragment)
router.patch('/:id', protect, retireFragment)
router.post('/:id/pulse', protect, pulseFragment)

module.exports = router
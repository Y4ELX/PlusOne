const express = require('express');
const router = express.Router();

router.use('/', require('./rt_routes'))
router.use('/', require('./rt_views'))

module.exports = router;
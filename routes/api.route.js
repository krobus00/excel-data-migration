const { getAllData, uploadBuku } = require('../controllers/api.controller')
const { upload } = require('../middlewares/upload')

const router = require('express').Router()

router.get('/', getAllData)
router.post('/', upload, uploadBuku)
module.exports = router

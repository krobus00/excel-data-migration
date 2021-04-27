const express = require('express')
const multer = require('multer')
const path = require('path')
const { unlinkAsync } = require('../helpers/deleteFile')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'ppm') {
      cb(null, 'uploads/')
    } else {
      cb(null, false)
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    )
  },
})
const checkFileType = (file, cb) => {
  if (file.fieldname === 'ppm') {
    if (
      file.mimetype.includes('excel') ||
      file.mimetype.includes('spreadsheetml')
    ) {
      cb(null, true)
    } else {
      cb('Extension not allowed', false)
    }
  } else {
    cb('Unknow form', false)
  }
}

const upload = (req, res, next) => {
  multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb)
    },
  }).fields([
    {
      name: 'ppm',
      maxCount: 15,
    },
  ])(req, res, (err) => {
    if (err) {
      if (req.files.ppm)
        req.files.ppm.forEach(async (element) => {
          await unlinkAsync(element.path)
        })
      if (err.code) {
        return res.rest.notAcceptable(err.code)
      }
      return res.rest.notAcceptable(err)
    } else {
      next()
    }
  })
}

module.exports = {
  upload,
}

const db = require('../models')
const { unlinkAsync } = require('../helpers/deleteFile')
const readXlsxFile = require('read-excel-file/node')

const getAllData = (req, res, next) => {
  db.Buku.findAll()
    .then((bukus) => {
      res.rest.success({ data: bukus })
    })
    .catch((error) => next(error))
}
const uploadBuku = async (req, res, next) => {
  try {
    readXlsxFile(req.files.ppm[0].path).then(async (rows) => {
      // skip header
      rows.shift()

      let newData = []

      rows.forEach((row) => {
        newData.push({
          judul: row[1],
          penerbit: row[2],
          deskripsi: row[3],
        })
      })
      db.Buku.bulkCreate(newData)
        .then((result) => {
          if (!result) return res.rest.badRequest()
          return res.rest.success()
        })
        .catch((error) => {
          next(error)
        })
    })
  } catch (error) {
    next(error)
  }
}
module.exports = { getAllData, uploadBuku }

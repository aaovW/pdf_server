const express = require('express');
const {homeview, generatePdf} = require('../controllers/homeController')
const pdfControlller =  require('../controllers/pdfControlller');

const router = express.Router();

router.get('/', homeview);
router.get('/generate', generatePdf);
router.get('/pdf', pdfControlller.generatePdf2);
router.post('/uploadReport', pdfControlller.generateReport)

module.exports={
    routes: router
}

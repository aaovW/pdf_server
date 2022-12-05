const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const jsPDF = require('jspdf');

const homeview = (req, res, next )=>{
    res.render('home');

}

const generatePdf = (req, res, next) => {
    
    const html = fs.readFileSync(path.join(__dirname, "../views/template.html"),  "utf8")
    const boostrap = fs.readFileSync(path.join(__dirname, "../public/css/bootstrap-4.3.1-dist/css/bootstrap.min.css"), "utf8");
    const charts = fs.readFileSync(path.join(__dirname, "../public/chart.js"), "utf8");
    var doc = jsPDF;

    doc.fromHTML(html)
   
    doc.addJS(charts);
    doc.save('ass.pdf')

}
module.exports = {
    homeview,
    generatePdf
}
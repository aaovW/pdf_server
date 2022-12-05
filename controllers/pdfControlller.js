const puppeteer = require("puppeteer"); 
const hbs = require("handlebars");
const path = require('path')
const fs = require('fs');
const { json } = require("express");
const pdfService = require('../services/pdfService');


const compile = async (templateName, data) => {
	const filePath = path.join(__dirname, "templates", `${templateName}.hbs`);
	if (!filePath) {
		throw new Error(`Could not find ${templateName}.hbs in generatePDF`);
	}
	const html = fs.readFileSync(filePath,{encoding: "utf-8"});
	return hbs.compile(html)(data);
};


let browser;
const generatePDF = async (fileName, data) => {
	try {
		if (!browser) {
			browser = await puppeteer.launch({
				args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage"
				],
				headless: true,
			})
		}

        const context = await browser.createIncognitoBrowserContext();
		const page = await context.newPage();
        hbs.registerHelper("json", function(data) {
            return JSON.stringify(data);
          });

		const style = hbs.compile( fs.readFileSync(
            path.join(__dirname,'templates', "style.hbs"), "utf-8")
			);
        hbs.registerPartial("Mystyle",style);
		const content = await compile(fileName, data);



        await page.goto(`data: text/html, ${content}`, {
			waitUntil: "networkidle0"
		});
		await page.setContent(content);
		page.emulateMedia = ("screen");

        const pdf = await page.pdf({
			format: "A4",
			printBackground: true,
		});

		await context.close();
		return pdf;


	} catch (err) {
        console.log(err)
    }
}
generatePdf2 = (async(req, res) => {
    try{
        const d = {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
            };
        const pdf =  await generatePDF("./pdf", {'hola': 'wllo', 'data': (d)});
        fs.writeFileSync('aaa.pdf', pdf)
        res.contentType("application/pdf");
        res.send(pdf);
    } catch(e) {
        console.log('assasa', e)
    }


})


generateReport = (req, res) => {

	var companyId = '12121221';
    const {type, method, content, imagesToReplace, emails} = req.body
    const clientTimeZone = '-05:00'

	console.log(type)
	pdfService.exportReport({
		type,
        method,
        content,
        imagesToReplace,
        clientTimeZone,
        emails,
        companyId
	}).then((response) => {
		res.contentType("application/pdf");
		res.send(response);
	}).catch(e => {
		console.log('aqui en el catch del controller')
		res.status(500).json(e);
	});


}
module.exports ={
    generatePdf2,
	generateReport
}

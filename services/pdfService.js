const puppeteer = require("puppeteer"); 
const hbs = require("handlebars");
const path = require('path')
const fs = require('fs');
let browser;


function exportReport({type, method, content, imagesToReplace, clientTimeZone, emails, companyId}) {
	console.log('qqqqqqq11')

	return makeReport({
		type,
		method,
		content,
		imagesToReplace
	})

}

const compile = async (templateName, data) => {
	const filePath = path.join(__dirname, "../controllers/templates", `${templateName}.hbs`);
	console.log(filePath)
	if (!filePath) {
		throw new Error(`Could not find ${templateName}.hbs in generatePDF`);
	}
	const html = fs.readFileSync(filePath,{encoding: "utf-8"});
	return hbs.compile(html)(data);
};


const generatePDF = async (fileName, data) => {
	console.log('qqqqqqq')

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
            path.join(__dirname,'../controllers/templates', "style.hbs"), "utf-8")
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
		console.log('qqqqqqq')
		return pdf;


	} catch (err) {
        console.log(err)
    }
}

async function makeReport({type, method, content, imagesToReplace}) {
	console.log('111111111111', type)

    switch (type) {
        case "route-list":
            return _generateRouteListReport({});
        case "route-individual":
            break;
        case "delivery":
            break;
        case 'case "fast-list':
            break;
        case 'fast-individual':
            break;
        case 'previewReport':
            break;
    }

}

function _generateRouteListReport({routeList, status, driver, date}) {
	console.log('assaassa')
	return generatePDF('portada', {'a': 'as'})

}

module.exports = {
    exportReport
}

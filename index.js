const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
var morgan = require('morgan')
var bodyParser = require('body-parser')

const homeRoutes = require("./routes/home-routes")




const app = express();
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser)
app.use(urlencodedParser)

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(homeRoutes.routes);
const port = 3000;

app.listen(port, ()=> console.log(`Watch on http://localhost:${port}`));


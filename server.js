require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const app = express();

app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true,     // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false // Only put nodes in array if >1
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(process.env.APP_PORT, () => {
    console.log('server is running at http://localhost:' + process.env.APP_PORT);
});

const transactionRouter = require('./api/transactions/transactions.router');
//const mysmsRouter = require('./api/mysms/mysms.router');

app.use('/api/v1', transactionRouter);
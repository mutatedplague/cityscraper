const cheerio = require('cheerio');
const request = require('request-promise');
const express = require('express');
const app = express();
const port = 3000;

let data = [];
var retailPriceRegexp = /\$(\d+)/;

async function main() {
    const result = await request.get("https://www.capitalcityonlineauction.com/cgi-bin/mnlist.cgi?ccoa314/category/ALL");
    const $ = cheerio.load(result);
    $("#DataTable > tbody > tr:not(:first-child)").each((index, element) => {
        const tds = $(element).find('td');
        let item = {};
        let description = $(tds[2]).text();
        // item['retailPrice'] = retailPriceRegexp.exec(description);
        item['image'] = $(tds[1]).find('img').attr('src');
        item['bids'] = $(tds[3]).text();
        item['currentAmount'] = $(tds[5]).text();
        item['nextRequiredBid'] = $(tds[6]).text();
        item['description'] = description;

        data.push(item);
    });
}

main();

app.get('/', (req, res) => {
    res.json(data);
})

app.listen(port, () => {
    console.log(`CityScraper app listening at http://localhost:${port}`)
})
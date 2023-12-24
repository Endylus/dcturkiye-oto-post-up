const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const moment = require('moment');
moment.locale('tr');
var chalk = require('chalk');
const { cookie, token } = require("./config.js");

async function bumpPost(postUrl) {
    if (!postUrl) return;
    const postId = postUrl.split('/').filter(Boolean).pop();

    const apiUrl = `https://dcturkiye.com/konular/${postId}/bump`;
    const requestBody = `_xfRequestUri=/konular/${postId}&_xfWithData=1&_xfToken=${token}&_xfResponseType=json`;

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": cookie,
        },
        body: requestBody,
    }).catch(err => {
        console.log(`>> Error: An error occured while fetching data from the API. Please try again later.`);
        return;
    });

    const json = await response?.json();
    let dataMessage = json?.message ? chalk.green(json.message[0]) : chalk.red(json.errors[0]);
    let datPost = postId.split('.')[0].split('-').join(' ');
    console.log(`${chalk.hex('#05cbf7')(`[${moment().format('LTS')}]`)} - [${chalk.hex('#8106bf')(chalk.underline(datPost))}] | ${chalk.yellow(dataMessage)}`);    
}

async function main() {
    const filePath = path.resolve(__dirname, 'postUrl.txt');
    const urls = (fs.readFileSync(filePath, 'utf8')).split(/\r?\n/);

    for (const url of urls) {
        bumpPost(url);
        await delay(500);
    }
    console.log(`${chalk.hex('#05cbf7')(`[${moment().format('LTS')}]`)} - [${chalk.blue('Bump işlemi tamamlandı. Yeni bump işlemi için 24 saat bekleniyor.')}]`);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    main();
    setTimeout(main, 86400000);
})();
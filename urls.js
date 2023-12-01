const fs = require('fs');
const axios = require('axios');
const url = require('url');

const fileName = process.argv[2];

if (!fileName) {
  console.error('Please provide a file name.');
  process.exit(1);
}

fs.readFile(fileName, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file ${fileName}: ${err.message}`);
    process.exit(1);
  }

  const urls = data.split('\n').filter(line => line.trim() !== '');
  urls.forEach(processUrl);
});

function processUrl(siteUrl) {
  axios.get(siteUrl)
    .then(response => {
      const hostname = new URL(siteUrl).hostname;
      fs.writeFile(hostname, response.data, 'utf8', err => {
        if (err) {
          console.error(`Error writing to file ${hostname}: ${err.message}`);
        } else {
          console.log(`Wrote to ${hostname}`);
        }
      });
    })
    .catch(error => {
      console.error(`Couldn't download ${siteUrl}: ${error.message}`);
    });
}
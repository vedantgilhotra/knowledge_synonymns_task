const cron = require('node-cron');
const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const constants = require("./constants");
const fetch = require("node-fetch");


app = express();

const getCountryName = (country_code) => {
  return new Promise((resolve, reject) => {
    var requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country_code }),
      credentials: 'include'
    };
    fetch(constants.SERVER_URL + "getCountryCode", requestOptions)
      .then(data => data.json())
      .then(response => {
        if (response.success === true) {
          if (response.error) {
            reject(response.error);
          }
          if (response.data) {
            resolve(response.data);
          }
        }
        else {
          reject("error receiving country code");
        }
      })
  })
}

const readData = () => {
  console.log('running task now');
  fs.createReadStream('sample-csv.csv')
    .pipe(csv())
    .on('data', (row) => {
      getCountryName(row.country_code).then(result => {
        console.log("country is:", result);
      }).catch(error => {
        console.log(error);
      })
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

const initializeTasks = () => {
  readData();
  // Schedule tasks to be run on the server.
  cron.schedule('* * * * *', readData); 
}

initializeTasks();

app.listen(3000);

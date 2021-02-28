const cron = require('node-cron');
const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const constants = require("./constants");
const fetch = require("node-fetch");

var entries = [];

app = express();

const addDate = () => {
  var d =new Date();
  return d.toISOString();
}

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
          reject(response.error);
        }
      })
  })
}

const processUserInformation = (rowData) => {
  return new Promise((resolve,reject) => {
    var requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rowData }),
      credentials: 'include'
    };
    fetch(constants.SERVER_URL + "processUserInformation", requestOptions)
    .then(data => data.json())
    .then(response => {
      if(response.success === true){
        if(response.error){
          reject(response.error);
        }
        if(response.data){
          resolve(response.data);
        }
      }
      else{
        reject(response.error);
      }
    })
  })
}

const readData = () => {
  console.log('running cron task now.'+` ${addDate()}`);
  fs.createReadStream('sample-csv.csv')
    .pipe(csv())
    .on('data', (row) => {
      entries.push(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed'+` ${addDate()}`);
      processGatheredData();
    });
}

const processGatheredData = async () => {
  console.log("Processing information gathered"+` ${addDate()}`);
  while(entries.length > 0){
    try {
      await processEntry(entries[0]);
    } catch (error) {
      
    }
    entries.splice(0,1);
  }
  console.log("Completed processing of gathered data"+` ${addDate()}`);
}

const processEntry = (row) => {
  return new Promise((resolve,reject) => {
    console.log(`At ${addDate()} initiating processing for entry:`,row);
    getCountryName(row.country_code).then(result => {
      console.log("country is:", result +` ${addDate()}`);
      row.country = result;
      delete row.country_code
      processUserInformation(row).then(result => {
        console.log(result+` ${addDate()}`);
        resolve("success");
      }).catch(error => {
        console.log(error+` ${addDate()}`);
        reject("failure");
      })
    }).catch(error => {
      console.log(error+` ${addDate()}`);
      reject("failure");
    })
  })
}

const initializeTasks = () => {
  readData();
  // Schedule tasks to be run on the server.
  cron.schedule('* * * * *', readData); 
}

initializeTasks();

app.listen(3000);

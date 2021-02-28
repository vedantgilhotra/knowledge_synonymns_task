const express = require("express");
const app = express();
const dbconn = require("../databases/sqlite");
const fs = require("fs");
const csv = require('csv-parser');
const UserData = dbconn.UserData;

const addDate = () => {
    var d =new Date();
    return d.toISOString();
  }

var COUNTRY_CODES = null;

const readCountryCodes = () => {
    return new Promise((resolve,reject) => {
        try {
            console.log("Beggining to process master file for country codes"+` ${addDate()}`);
            COUNTRY_CODES = {};
            fs.createReadStream('master.csv')
            .pipe(csv())
            .on('data', (row) => {
              COUNTRY_CODES[row.country_code] = row.country;
            })
            .on('end', () => {
              console.log('Country codes file successfully processed'+` ${addDate()}`);
              resolve({});
            });
           } catch (error) {
               console.log(error+` ${addDate()}`);
               reject(error);
           }
    })
}


const getCountryCode = async (req,res) => {
    try {
            console.log("country code received:",req.body.country_code)+` ${addDate()}`
            var country_code = req.body.country_code;
            if(!country_code){
                console.log("invalid entry without country_code"+` ${addDate()}`);  
                return res.status(200).json({
                    success:true,
                    error:"Invalid entry without country_code"
                }) 
            }
            else{
                if(COUNTRY_CODES[country_code]){
                    console.log("Found country name for corresponding country code:",COUNTRY_CODES[country_code]+` ${addDate()}`);
                   return res.status(200).json({
                        success:true,
                        data:COUNTRY_CODES[country_code]
                    })
                }
                console.log("Invalid country code"+` ${addDate()}`)
                   return res.status(200).json({
                        success:true,
                        error:"Invalid country code"
                    })
            }
    } catch (error) {
        console.log(error+` ${addDate()}`)
        res.status(500).json({
            success:false,
            error:error,
        })
    }
}

const processUserInformation = (req,res) => {
    try {
        console.log("user information received:",req.body.rowData+` ${addDate()}`);
        var rowData = req.body.rowData;
        if(rowData.external_code){
            UserData.findOne({
                where:{
                    external_code:rowData.external_code
                }
            }).then(userData => {
                if (userData != null) {
                    console.log("corresponding external code available"+` ${addDate()}`)
                    userData.update(
                        rowData,
                        { where: { id: userData.dataValues.id } }
                    ).then(updatedUserData => {
                        res.status(200).json({
                            success: true,
                            data: "Update entry"
                        })
                    })
                }
                else{
                    console.log("corresponsing external_code not found,creating new entry"+` ${addDate()}`);
                    UserData.create(rowData).then(createdUserData => {
                        res.status(200).json({
                            success:true,
                            data:"created new entry"
                        })
                    })
                }
            })
        }
    } catch (error) {
        console.log(error+` ${addDate()}`);
        res.status(500).json({
            success:false,
            error:error,
        })
    }
}


module.exports = {
    getCountryCode,
    readCountryCodes,
    processUserInformation,
}

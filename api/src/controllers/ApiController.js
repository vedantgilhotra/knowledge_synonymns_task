const express = require("express");
const app = express();
const dbconn = require("../databases/sqlite");
const fs = require("fs");
const csv = require('csv-parser');
const UserData = dbconn.UserData;

var COUNTRY_CODES = null;

const readCountryCodes = () => {
    return new Promise((resolve,reject) => {
        try {
            COUNTRY_CODES = {};
            fs.createReadStream('master.csv')
            .pipe(csv())
            .on('data', (row) => {
              COUNTRY_CODES[row.country_code] = row.country;
            })
            .on('end', () => {
              console.log('Country codes file successfully processed');
              resolve({});
            });
           } catch (error) {
               console.log(error);
               reject(error);
           }
    })
}


const getCountryCode = async (req,res) => {
    try {
            var country_code = req.body.country_code;
            if(!country_code){
                console.log("invalid entry without country_code");  
                return res.status(200).json({
                    success:true,
                    error:"Invalid entry without country_code"
                }) 
            }
            else{
                if(COUNTRY_CODES[country_code]){
                   return res.status(200).json({
                        success:true,
                        data:COUNTRY_CODES[country_code]
                    })
                }
                   return res.status(200).json({
                        success:true,
                        error:"Invalid country code"
                    })
            }
    } catch (error) {
        res.status(500).json({
            success:false,
            error:error,
        })
    }
}

const processUserInformation = (req,res) => {
    try {
        var rowData = req.body.rowData;
        if(rowData.external_code){
            UserData.findOne({
                where:{
                    external_code:rowData.external_code
                }
            }).then(userData => {
                if (userData != null) {
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

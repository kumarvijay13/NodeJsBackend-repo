const { json } = require("body-parser");
const {google} = require("googleapis");
const express = require("express");
const router = express.Router();
const ConvertToJson = require("../util/ConvertToJson");
const googlesheetConfig = require("./googleSheetConfig");
//Get Particular row
router.delete("/:email",async (req,res,next) =>{

    try{
    
        const client = googlesheetConfig.client;
        const googlesheet =  await google.sheets({version:"v4",auth:client});
        //Read rows from spreadsheet
        const Rows = await googlesheet.spreadsheets.values.get({
            auth:googlesheetConfig.auth,
            spreadsheetId:googlesheetConfig.spreadsheetID,
            range:"Sheet1",    
        });
        
        const result = ConvertToJson.ConvertToJson(Rows.data.values);
        
        //Checking the index of the updating rows
        const requestedEmail = req.params.email;
        var index =2;
        var rowIndex =-1;
        var ResponesObject =null;
        for (var property in result)
        {
          const billingEmail = result[property].email;
          if(requestedEmail ==billingEmail)
          {
            rowIndex =index;
            ResponesObject = result[property]
          }
          index++;
        }
        
        if(rowIndex >-1)
        {
            console.log("Working"+" "+rowIndex);
             await googlesheet.spreadsheets.batchUpdate({
                auth: googlesheetConfig.auth,
                spreadsheetId: googlesheetConfig.spreadsheetID,
                resource: {
                  "requests": 
                  [
                    {
                      "deleteRange": 
                      {
                        "range": 
                        {
                          "sheetId": 0, // gid
                          "startRowIndex": rowIndex-1,
                          "endRowIndex": rowIndex
                        },
                        "shiftDimension": "ROWS"
                      }
                    }
                  ]
                }
              }, (response) => {
               
              })

              const NewRows = await googlesheet.spreadsheets.values.get({
                auth:googlesheetConfig.auth,
                spreadsheetId:googlesheetConfig.spreadsheetID,
                range:"Sheet1",    
            });
            
              const NewData = ConvertToJson.ConvertToJson(NewRows.data.values);
              res.status(200).json({response:"Billing deleted successfully",Data:NewData});
        }
    }
    catch(error){
    console.log('Error',error.toString());
    }
    
    });

    module.exports = router;
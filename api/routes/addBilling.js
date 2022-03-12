const { json } = require("body-parser");
const express = require("express");
const router = express.Router();
const {google} = require("googleapis");
const ConvertToJson = require("../util/ConvertToJson");
const googlesheetConfig = require("./googleSheetConfig");

router.post("/",async(req,res,next) =>{
try
{
      console.log(req.body);
      const googlesheet =  await google.sheets({version:"v4",auth:googlesheetConfig.client});
      //Appending new row in sheet
      await googlesheet.spreadsheets.values.append({
        auth:googlesheetConfig.auth,
        spreadsheetId:googlesheetConfig.spreadsheetID,
        range:"Sheet1", 
        valueInputOption:"USER_ENTERED",
        resource:{ values:[
            [
                req.body.name,req.body.email,req.body.billing_amount,req.body.entry_date,req.body.billing_date,req.body.occurance
            ]
          ]
        }
      });
     

    //Fetching all the rows and sending back in response
    const Rows = await googlesheet.spreadsheets.values.get({
      auth:googlesheetConfig.auth,
      spreadsheetId:googlesheetConfig.spreadsheetID,
      range:"Sheet1",    
     });

     const SheetData = ConvertToJson.ConvertToJson(Rows.data.values);
    res.status(200).json({response:"Billing information saved successfully",data:SheetData});
}
catch(error)
{
     console.log('Error',error.toString());
     res.status(501).json({response:error});
}

});

module.exports = router;
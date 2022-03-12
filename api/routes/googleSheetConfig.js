const {google} = require("googleapis");
const config = require("../../config");

const auth =  new google.auth.GoogleAuth({

  keyFile:config.keyFile,
  scopes:config.scopes
});

//const client = auth.getClient();
exports.auth =auth;
exports.client =auth.getClient();
exports.spreadsheetID =config.spreadsheetID;



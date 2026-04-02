const { google } = require("googleapis")
const nodemailer = require("nodemailer")

const credentials = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URL,
  token_uri: process.env.GOOGLE_TOKEN_URL,
  auth_provider_x509_cert_url: process.env.GOOGLE_PROVIDER_CERT,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "me@gmail.com",
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
})

const sendForm = async(req, res) => {
  try {
    // const sheets = google.sheets({ version: "v4", auth })
    // const values = [
    //   req.body.firstName,
    //   req.body.lastName,
    //   req.body.phoneNumber,
    //   req.body.email,
    //   req.body.businessName,
    //   req.body.website,
    //   req.body.businessType,
    //   req.body.instagram,
    //   req.body.brand,
    //   req.body.reference,
    //   req.body.naming,
    //   req.body.branding,
    //   req.body.visualIdentity,
    //   req.body.socialMediaStrategy,
    //   req.body.websiteCommerce,
    //   req.body.contentCreation,
    //   req.body.marketing,
    //   req.body.packaging,
    //   req.body.other,
    //   req.body.budget,
    // ]
    // await sheets.spreadsheets.values.append({
    //   spreadsheetId: process.env.GOOGLE_SHEET_ID,
    //   range: "Hoja 1!A2",
    //   valueInputOption: "RAW",
    //   requestBody: { values: [ values ] },
    // })

    // envio correo al cliente

    // envio correo a encargado de maku
    res.sendStatus(200)
  } catch(error) {
    res.status(500).json({error})
  }
}

module.exports = { sendForm }

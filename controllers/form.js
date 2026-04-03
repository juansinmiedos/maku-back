const { google } = require("googleapis")
const nodemailer = require("nodemailer")

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

const credentials = {
  type: "service_account",
  project_id: "maku-formulario",
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: "website@maku-formulario.iam.gserviceaccount.com",
  client_id: "101018582271401793637",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/website%40maku-formulario.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sendForm = async(req, res) => {
  try {
    const sheets = google.sheets({ version: "v4", auth })
    const values = [
      req.body.firstName,
      req.body.lastName,
      req.body.phoneNumber,
      req.body.email,
      req.body.businessName,
      req.body.website,
      req.body.businessType,
      req.body.instagram,
      req.body.brand,
      req.body.reference,
      req.body.naming,
      req.body.branding,
      req.body.visualIdentity,
      req.body.socialMediaStrategy,
      req.body.websiteCommerce,
      req.body.contentCreation,
      req.body.marketing,
      req.body.packaging,
      req.body.other,
      req.body.budget,
    ]
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Hoja 1!A2",
      valueInputOption: "RAW",
      requestBody: { values: [ values ] },
    })

    // envio correo al cliente

    // envio correo a encargado de maku
    res.sendStatus(200)
  } catch(error) {
    res.status(500).json({error})
  }
}

module.exports = { sendForm }

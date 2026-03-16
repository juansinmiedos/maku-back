import { google } from "googleapis"
import fs from "fs"

const credentials = JSON.parse(fs.readFileSync("google-sheets-key.json", "utf8"))

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
    res.send(200)
  } catch(error) {
    res.status(500).json({error})
  }
}

export { sendForm }

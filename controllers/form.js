const { google } = require("googleapis")
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
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

const rowToHtml = (label, value) => `
<tr>
  <td style="border-bottom:1px solid #e5e7eb; font-weight:bold; width:40%; background:#f9fafb;">
    ${label}
  </td>
  <td style="border-bottom:1px solid #e5e7eb;">
    ${value || "-"}
  </td>
</tr>
`

const buildAdminHtml = values => `
<div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
    
    <!-- Header -->
    <tr>
      <td style="background:#111827; color:#ffffff; padding:20px; text-align:center;">
        <h2 style="margin:0;">🚀 Nueva solicitud recibida</h2>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:20px;">
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          
          ${rowToHtml("Nombre", values[0] + " " + values[1])}
          ${rowToHtml("Teléfono", values[2])}
          ${rowToHtml("Email", `<a href="mailto:${values[3]}">${values[3]}</a>`)}
          ${rowToHtml("Empresa", values[4])}
          ${rowToHtml("Sitio web", `<a href="${values[5]}">${values[5]}</a>`)}
          ${rowToHtml("Tipo de negocio", values[6])}
          ${rowToHtml("Instagram", values[7])}
          ${rowToHtml("Marca", values[8])}
          ${rowToHtml("Referencia", values[9])}
          ${rowToHtml("Naming", values[10])}
          ${rowToHtml("Branding", values[11])}
          ${rowToHtml("Identidad visual", values[12])}
          ${rowToHtml("Estrategia redes", values[13])}
          ${rowToHtml("Web / eCommerce", values[14])}
          ${rowToHtml("Contenido", values[15])}
          ${rowToHtml("Marketing", values[16])}
          ${rowToHtml("Packaging", values[17])}
          ${rowToHtml("Otro", values[18])}
          ${rowToHtml("Presupuesto", `<strong style="color:#16a34a;">${values[19]}</strong>`)}

        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#6b7280;">
        Enviado automáticamente desde tu formulario web
      </td>
    </tr>

  </table>
</div>
`

const buildClientHtml = values => `
<div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden;">
    
    <!-- Header -->
    <tr>
      <td style="background:#111827; color:#ffffff; padding:20px; text-align:center;">
        <h2 style="margin:0;">¡Gracias por contactarnos! 🙌</h2>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:20px; color:#374151;">
        <p>Hola <strong>${values[0]}</strong>,</p>

        <p>
          Hemos recibido tu solicitud correctamente. Nuestro equipo revisará tu información y te contactará lo antes posible.
        </p>

        <p style="margin-top:20px;">
          Aquí tienes un resumen de lo que nos enviaste:
        </p>

        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; margin-top:10px;">
          ${rowToHtml("Nombre", values[0] + " " + values[1])}
          ${rowToHtml("Empresa", values[4])}
          ${rowToHtml("Email", values[3])}
          ${rowToHtml("Teléfono", values[2])}
          ${rowToHtml("Servicio", values[6])}
          ${rowToHtml("Presupuesto", values[19])}
        </table>

        <p style="margin-top:20px;">
          Si tienes información adicional, puedes responder directamente a este correo.
        </p>

        <p style="margin-top:20px;">
          Saludos,<br>
          <strong>Equipo Maku</strong>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f9fafb; text-align:center; padding:15px; font-size:12px; color:#6b7280;">
        Este es un mensaje automático — no necesitas hacer nada más 🙂
      </td>
    </tr>

  </table>
</div>
`

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

    // Envio correo al cliente
    await transporter.sendMail({
      from: '"Maku" <juanvidaldom@gmail.com>',
      to: values[3],
      subject: "Recibimos tu solicitud 🙌",
      html: buildClientHtml(values),
    })

    // Envio correo a encargado de maku
    await transporter.sendMail({
      from: '"Maku" <juanvidaldom@gmail.com>',
      to: "juanvidaldom@gmail.com",
      subject: "Tienes un nuevo lead del sitio web 🚀",
      html: buildAdminHtml(values)
    })

    res.sendStatus(200)
  } catch(error) {
    res.status(500).json({error})
  }
}

module.exports = { sendForm }

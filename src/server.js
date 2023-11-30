const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

transporter.verify().then(() => {
	console.log("Ready for send emails");
});

app.post("/send-email", async (req, res) => {
	try {
		const { name, email, message } = req.body;

		console.log(req.body);
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: process.env.MY_EMAIL,
			subject: `Contact from ${name}`,
			text: `Contact to ${email} and the message is:${message}`,
		};

		const info = await transporter.sendMail(mailOptions);

		console.log("Correo electrónico enviado: " + info.response);
		res.status(200).send("Correo electrónico enviado con éxito");
	} catch (error) {
		console.error("Error al enviar el correo electrónico", error);
		res.status(500).send("Error al enviar el correo electrónico");
	}
});
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

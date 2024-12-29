const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(require('cors')());

// Endpoint to send verification email
app.post('/send-verification', (req, res) => {
    const { email, code } = req.body;

    // Create a transporter for Nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
            user: 'dylanerspamer21@gmail.com', // Your email
            pass: 'Clearly9?'      // Your email password or app password
        }
    });

    let mailOptions = {
        from: 'dylanerspamer21@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Your verification code is: ${code}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email.');
        }
        res.status(200).send('Email sent.');
    });
});

// Start server on port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

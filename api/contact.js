// api/contact.js
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    // SMTP Configuration (Gmail ke liye)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Aapka Gmail address
            pass: process.env.EMAIL_PASS  // Aapka Gmail App Password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Email aapke hi account se send hoga
        to: process.env.EMAIL_USER,   // Email aapko hi receive hoga
        replyTo: email,               // Jab aap 'Reply' dabayenge, toh user ki email id par jayega
        subject: `Portfolio Contact: Message from ${name}`,
        text: `You have a new message from your portfolio website!\n\nName: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

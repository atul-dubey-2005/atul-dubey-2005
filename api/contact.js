import nodemailer from 'nodemailer';

const MAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0,max) : '';

// Vercel serverless function. Never expose SMTP credentials to the browser.
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow','POST');
    return res.status(405).json({error:'Method not allowed'});
  }
  const name = clean(req.body?.name,80);
  const email = clean(req.body?.email,200);
  const message = clean(req.body?.message,3000);
  if (!name || !MAIL_RE.test(email) || !message) return res.status(400).json({error:'A valid name, email and message are required.'});
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(503).json({error:'Email delivery has not been configured.'});
  }
  try {
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}
    });
    await transporter.sendMail({
      from:process.env.EMAIL_USER,
      to:process.env.EMAIL_USER,
      replyTo:email,
      subject:`Portfolio enquiry from ${name.replace(/[\r\n]/g,' ')}`,
      text:`New message from the Atul Dubey portfolio:\n\nName: ${name}\nEmail: ${email}\n\n${message}`
    });
    return res.status(200).json({success:true});
  } catch (error) {
    console.error('Contact email delivery failed:',error?.message);
    return res.status(502).json({error:'Could not send the email. Try the direct email link.'});
  }
}

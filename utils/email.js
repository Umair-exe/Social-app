const nodemailer = require('nodemailer');

const sendMail = async (user) => {

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });

    let mailDetails = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Account Created',
        text: `<h1>Welcome ${user.name} your account has been created</h1>`
    };

    try {
        let done = await mailTransporter.sendMail(mailDetails);
        return done? true: false;
        
    } catch (error) {
        console.log(error);

    }
}

module.exports = sendMail;

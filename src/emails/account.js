const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'maniemuhammed620@gmail.com',
        subject: 'Thanks for joining in',
        text: `Hello ${name} welcome to Manie Task manger app`
    })
}

const exitEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from: 'maniemuhammed620@gmail.com',
        subject: 'Sorry to see you go',
        text: `Goodbye ${name} 
        we are sad you are leaving our app,
        is there anything we could have done to keep you using our app we would appreciate your feedback.  `
    })
}

module.exports = { welcomeEmail, exitEmail } 
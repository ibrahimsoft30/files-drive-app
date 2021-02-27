const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRED_API_KEY);

const sendVerificationEmail = async (email, name, code) => {
    const msg = {
        to: email,
        from: 'ibrahimdevtests@gmail.com',
        subject: 'Verfiy Your Account',
        text: `Hellow and wellcom ${name} there is one step left to complete verfiy your account 
        with This Code ${code} Good Lock :>`
    }

    try {
        await sgMail.send(msg);
    } catch (e) {
        // console.log('#RROR',e);
    }
}

module.exports = sendVerificationEmail;
import nodemailer, { Transporter } from "nodemailer";

const EMAIL_ID: string = process.env.EMAIL_ID as string;
const EMAIL_PASS: string = process.env.EMAIL_PASS as string;

export const sendMail = async (email: string, type: 'otp' | 'approval' | 'rejection', otp?: string, reason?: string): Promise<boolean> => {
 
    const transporter: Transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_ID,
            pass: EMAIL_PASS
        }
    });

    let mailOptions = {};

    if (type === 'otp') {
        mailOptions = {
            from: EMAIL_ID,
            to: email,
            subject: "OTP Verification",
            html: `
            <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100px; overflow: auto; line-height: 2">
                <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                    <p style="font-size: 1.1em">Hi,</p>
                    <p>Thank you for choosing FitFusion. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p>
                    <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${otp}</h2>
                    <p style="font-size: 0.9em;">Regards,<br />FitFusion</p>
                    <hr style="border: none; border-top: 1px solid #eee" />
                </div>
            </div>`
        };
    } else if (type === 'rejection') {
        mailOptions = {
            from: EMAIL_ID,
            to: email,
            subject: "Rejection Mail",
            html: `
            <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100px; overflow: auto; line-height: 2">
                <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                    <p style="font-size: 1.1em">Hi,</p>
                    <p>We regret to inform you that your application to FitFusion has been rejected.</p>
                    <p>Reason: ${reason}</p>
                    <p style="font-size: 0.9em;">Regards,<br />FitFusion</p>
                    <hr style="border: none; border-top: 1px solid #eee" />
                </div>
            </div>`
        };
    } else if (type === 'approval') {
        mailOptions = {
            from: EMAIL_ID,
            to: email,
            subject: "Approval Mail",
            html: `
            <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100px; overflow: auto; line-height: 2">
                <div style="margin: 50px auto; width: 70%; padding: 20px 0">
                    <p style="font-size: 1.1em">Hi,</p>
                    <p>Congratulations! Your application to FitFusion has been approved. We're excited to have you onboard!</p>
                    <p style="font-size: 0.9em;">Regards,<br />FitFusion</p>
                    <hr style="border: none; border-top: 1px solid #eee" />
                </div>
            </div>`
        };
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log(`${type} mail sent to ${email}`);
        return true;
    } catch (error) {
        console.log(`Error in sending ${type} mail: `, error);
        return false;
    }
};

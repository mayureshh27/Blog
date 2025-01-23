import nodemailer from "nodemailer";

export const sendVerificationEmail = async (userEmail, token) => {
    try {
        // Configure the transporter for sending emails
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER, // Your Gmail account
                pass: process.env.GMAIL_PASSWORD, // Your Gmail app password
            },
        });

        // Generate the verification link
        const verificationLink = `${process.env.EXEC_URL}/user/verifyemail?token=${token}`;

        // Email options
        const mailOptions = {
            from: `"BlogCircuitOfficial" <${process.env.GMAIL_USER}>`, // Sender address
            to: userEmail, // Recipient address
            subject: "Please Verify Your Email-BlogCircuitOfficial",
            html: `
                <h3>Welcome to BlogCircuitOfficial:)</h3>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationLink}" target="_blank">${verificationLink}</a>
                <p>If you did not sign up for this account, please ignore this email.</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${userEmail}`);
    } catch (error) {
        console.error("Error sending verification email:", error.message);
        throw new Error("Failed to send verification email");
    }
};

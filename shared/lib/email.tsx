import { render } from "@react-email/components";
import nodemailer from "nodemailer";

// In production, use your email service (SendGrid, Resend, etc.)
// For development, use nodemailer with your email credentials
const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.SMTP_PASSWORD,
    user: process.env.SMTP_USER,
  },
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
});

export async function sendEmail({
  to,
  subject,
  react,
  text,
}: {
  to: string;
  subject: string;
  react?: React.ReactElement;
  text?: string;
}) {
  try {
    const html = react ? await render(react) : undefined;

    const response = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@hackathonhub.com",
      html,
      subject,
      text,
      to,
    });

    console.log("[v0] Email sent:", response.messageId);
    return response;
  } catch (error) {
    console.error("[v0] Email send failed:", error);
    throw error;
  }
}

export async function sendWelcomeEmail(
  email: string,
  name: string,
  userType: "participant" | "organizer"
) {
  const { WelcomeEmail } = await import("@/emails/welcome");

  return sendEmail({
    react: <WelcomeEmail name={name} email={email} userType={userType} />,
    subject: "Welcome to Hackra!",
    to: email,
  });
}

export async function sendHackathonConfirmationEmail(
  email: string,
  participantName: string,
  hackathonTitle: string,
  hackathonSlug: string,
  startDate: string,
  endDate: string,
  location: string
) {
  const { HackathonConfirmationEmail } =
    await import("@/emails/hackathon-confirmation");

  return sendEmail({
    react: (
      <HackathonConfirmationEmail
        participantName={participantName}
        hackathonTitle={hackathonTitle}
        hackathonSlug={hackathonSlug}
        startDate={startDate}
        endDate={endDate}
        location={location}
      />
    ),
    subject: `Registration confirmed for ${hackathonTitle}!`,
    to: email,
  });
}

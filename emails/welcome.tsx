import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  email: string;
  userType: "participant" | "organizer";
}

export function WelcomeEmail({ name, userType }: WelcomeEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://hackra.localhost";

  return (
    <Html>
      <Head />
      <Preview>Welcome to Hackra!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>Welcome to Hackra! 🚀</Text>
            <Text style={paragraph}>Hi {name},</Text>
            <Text style={paragraph}>
              Thank you for joining Hackra! We&apos;re excited to have you as a{" "}
              {userType} in our community.
            </Text>

            {userType === "participant" && (
              <>
                <Text style={paragraph}>You can now:</Text>
                <Text style={paragraph}>
                  • Browse and discover amazing hackathons
                  <br />• Register for events that interest you
                  <br />• Connect with other developers
                  <br />• Win prizes and build cool projects
                </Text>
              </>
            )}

            {userType === "organizer" && (
              <>
                <Text style={paragraph}>You can now:</Text>
                <Text style={paragraph}>
                  • Create and manage your hackathon events
                  <br />• Customize event pages with colors and branding
                  <br />• Track participants and manage registrations
                  <br />• Share your events across social media
                </Text>
              </>
            )}

            <Section style={buttonContainer}>
              <Button style={button} href={baseUrl}>
                Get Started
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Questions? Reply to this email or visit our support page.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  marginBottom: "64px",
  padding: "20px 0 48px",
};

const box = {
  padding: "0 48px",
};

const heading = {
  fontSize: "32px",
  fontWeight: "700",
  margin: "24px 0 0 0",
};

const paragraph = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "16px 0",
  textAlign: "left" as const,
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "3px",
  color: "#fff",
  display: "block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 20px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

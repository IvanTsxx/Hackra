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
import { format } from "date-fns";
import React from "react";

interface HackathonConfirmationEmailProps {
  participantName: string;
  hackathonTitle: string;
  hackathonSlug: string;
  startDate: string;
  endDate: string;
  location: string;
}

export function HackathonConfirmationEmail({
  participantName,
  hackathonTitle,
  hackathonSlug,
  startDate,
  endDate,
  location,
}: HackathonConfirmationEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const hackathonUrl = `${baseUrl}/hackathons/${hackathonSlug}`;

  const start = new Date(startDate);
  const end = new Date(endDate);

  return (
    <Html>
      <Head />
      <Preview>You&apos;re registered for {hackathonTitle}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>Registration Confirmed! ✨</Text>
            <Text style={paragraph}>Hi {participantName},</Text>
            <Text style={paragraph}>
              Your registration for <strong>{hackathonTitle}</strong> is
              confirmed!
            </Text>

            <Section style={eventBox}>
              <Text style={eventTitle}>{hackathonTitle}</Text>
              <Text style={eventDetail}>
                📅 {format(start, "MMMM dd, yyyy")} -{" "}
                {format(end, "MMMM dd, yyyy")}
              </Text>
              <Text style={eventDetail}>📍 {location}</Text>
            </Section>

            <Text style={paragraph}>What&apos;s next?</Text>
            <Text style={paragraph}>
              • Mark your calendar for the event
              <br />• Review the hackathon details and requirements
              <br />• Start thinking about your project idea
              <br />• Connect with other participants
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={hackathonUrl}>
                View Event Details
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              See you at {hackathonTitle}! Have an amazing experience!
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

const eventBox = {
  backgroundColor: "#f0f0f0",
  borderRadius: "8px",
  margin: "20px 0",
  padding: "20px",
};

const eventTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px 0",
};

const eventDetail = {
  color: "#666",
  fontSize: "14px",
  margin: "8px 0",
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

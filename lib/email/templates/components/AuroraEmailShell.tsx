import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties, ReactNode } from "react";
import { SUPPORT_EMAIL } from "@/lib/email/constants";

type AuroraEmailShellProps = {
  previewText: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  appUrl: string;
  ctaHref?: string;
  ctaLabel?: string;
  children: ReactNode;
};

function joinUrl(baseUrl: string, pathname: string) {
  return `${baseUrl.replace(/\/+$/, "")}/${pathname.replace(/^\/+/, "")}`;
}

export function AuroraEmailShell({
  previewText,
  eyebrow,
  title,
  subtitle,
  appUrl,
  ctaHref,
  ctaLabel,
  children,
}: AuroraEmailShellProps) {
  const logoUrl = joinUrl(appUrl, "/logo.png");

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.heroSection}>
            <Img
              src={logoUrl}
              alt="Aurora logo"
              width="56"
              height="56"
              style={styles.logo}
            />
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSubtitle}>{subtitle}</Text>
            {ctaHref && ctaLabel ? (
              <Button href={ctaHref} style={styles.button}>
                {ctaLabel}
              </Button>
            ) : null}
          </Section>

          <Section style={styles.contentSection}>{children}</Section>

          <Hr style={styles.divider} />

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              This transactional email was sent by Aurora.
            </Text>
            <Text style={styles.footerText}>
              Need help? Reach us at {SUPPORT_EMAIL}
            </Text>
            <Text style={styles.footerMuted}>
              Aurora, Earth's Beauty, Captured in Crystal.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, CSSProperties> = {
  body: {
    margin: 0,
    padding: "24px 12px",
    backgroundColor: "#f6f3f4",
    color: "#171717",
    fontFamily:
      "'Google Sans Flex', 'Avenir Next', 'Segoe UI', Helvetica, Arial, sans-serif",
  },
  container: {
    maxWidth: "640px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    border: "1px solid #ece7e8",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 8px 30px rgba(129, 26, 33, 0.07)",
  },
  heroSection: {
    padding: "40px 36px 28px",
    background:
      "linear-gradient(130deg, #1e1e1e 0%, #2a1114 42%, #811A21 100%)",
    color: "#ffffff",
  },
  logo: {
    borderRadius: "14px",
    marginBottom: "18px",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  eyebrow: {
    margin: "0 0 8px",
    fontSize: "11px",
    letterSpacing: "1.6px",
    textTransform: "uppercase",
    color: "#f6d8da",
    fontWeight: 600,
  },
  heroTitle: {
    margin: "0",
    fontSize: "34px",
    lineHeight: "1.15",
    fontWeight: 650,
    color: "#ffffff",
  },
  heroSubtitle: {
    margin: "14px 0 0",
    fontSize: "15px",
    lineHeight: "1.55",
    color: "#f4ebed",
  },
  button: {
    marginTop: "24px",
    display: "inline-block",
    backgroundColor: "#ffffff",
    color: "#811A21",
    borderRadius: "999px",
    fontSize: "13px",
    textDecoration: "none",
    fontWeight: 700,
    padding: "12px 20px",
  },
  contentSection: {
    padding: "28px 36px 14px",
  },
  divider: {
    borderColor: "#ece7e8",
    margin: "10px 36px",
  },
  footer: {
    padding: "8px 36px 28px",
  },
  footerText: {
    margin: "0 0 6px",
    color: "#4b4b4b",
    fontSize: "12px",
    lineHeight: "1.5",
  },
  footerMuted: {
    margin: "14px 0 0",
    color: "#8a8a8a",
    fontSize: "12px",
    lineHeight: "1.5",
  },
};

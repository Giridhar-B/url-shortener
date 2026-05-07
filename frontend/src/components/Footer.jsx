import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Title */}
        <h2 style={styles.title}>URL Shortener</h2>

        {/* Icons */}
        <div style={styles.icons}>
          <a
            href="https://github.com/Giridhar-B/url-shortener"
            target="_blank"
            rel="noreferrer"
            style={styles.iconBtn}
          >
            <FaGithub size={17} />
          </a>

          <a
            href="https://www.linkedin.com/in/giridhar-balasubramanian"
            target="_blank"
            rel="noreferrer"
            style={styles.iconBtn}
          >
            <FaLinkedin size={17} />
          </a>

          <a href="mailto:giridhar7703@gmail.com" style={styles.iconBtn}>
            <FaEnvelope size={17} />
          </a>
        </div>

        {/* Divider */}
        <div style={styles.line} />

        {/* Copyright */}
        <p style={styles.bottom}>
          © 2026 URL Shortener — Built with MERN Stack
        </p>
      </div>
    </footer>
  );
};

export default Footer;

/* ---------------- STYLES ---------------- */

const styles = {
  footer: {
    // background: "#f8fafc",
    background: "#F7F7F7",
    color: "#334155",
    marginTop: "40px",
    padding: "25px 20px",
    borderTop: "1px solid #e2e8f0",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
  },

  title: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    letterSpacing: "0.4px",
  },

  icons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "14px",
  },

  iconBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#1e293b",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    transition: "0.2s ease",
  },

  line: {
    height: "1px",
    width: "100%",
    background: "#e2e8f0",
    margin: "14px 0",
  },

  bottom: {
    color: "#64748b",
    fontSize: "13px",
  },
};
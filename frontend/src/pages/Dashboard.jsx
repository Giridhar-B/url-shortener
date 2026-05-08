import { useEffect, useState, useRef } from "react";
import {
  getLinks,
  getGlobalAnalytics,
  createShortUrl,
  deleteLink,
  toggleLink,
} from "../services/linkService";

import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  Link2,
  MousePointerClick,
  Activity,
  Copy,
  Trash2,
  Power,
  BarChart3,
  Download,
  ExternalLink,
  Plus,
} from "lucide-react";

// FRONTEND ENV BASE URL
const BASE_URL = import.meta.env.VITE_REDIRECT_BASE_URL;

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
  });

  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState("");

  const qrRefs = useRef({});

  useEffect(() => {
    fetchLinks();
    fetchStats();

    // AUTO REFRESH EVERY 5 SECONDS
    const interval = setInterval(() => {
      fetchLinks();
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await getLinks();
      setLinks(res.data);
    } catch {
      showToast("Failed to load links");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getGlobalAnalytics();
      setStats(res.data);
    } catch {
      console.error("Stats error");
    }
  };

  const handleShorten = async () => {
    if (!url) return showToast("Enter a URL");

    try {
      setLoading(true);

      await createShortUrl({ url, name });

      setUrl("");
      setName("");

      showToast("Short link created");

      fetchLinks();
      fetchStats();
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this link?");
    if (!confirm) return;

    try {
      await deleteLink(id);

      showToast("Link deleted");

      fetchLinks();
      fetchStats();
    } catch {
      showToast("Delete failed");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleLink(id);

      showToast("Status updated");

      fetchLinks();
      fetchStats();
    } catch {
      showToast("Update failed");
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);

    setCopiedId(id);

    showToast("Copied!");

    setTimeout(() => setCopiedId(null), 1500);
  };

  const downloadQR = (shortId) => {
    const canvas = qrRefs.current[shortId];

    if (!canvas) return;

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");

    link.href = url;
    link.download = `${shortId}-qr.png`;

    link.click();

    showToast("QR downloaded");
  };

  const showToast = (msg) => {
    setToast(msg);

    setTimeout(() => setToast(""), 2000);
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* TOAST */}
        {toast && <div style={styles.toast}>{toast}</div>}

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Dashboard</h1>

            <p style={styles.subHeading}>
              Manage your shortened links and analytics
            </p>
          </div>
        </div>

        {/* CREATE CARD */}
        <div style={styles.createCard}>
          <div style={styles.createTop}>
            <div style={styles.createIconBox}>
              <Plus size={20} color="#4f46e5" />
            </div>

            <div>
              <h2 style={styles.cardTitle}>Create Short Link</h2>

              <p style={styles.cardSub}>
                Paste your long URL and generate a short one instantly
              </p>
            </div>
          </div>

          <input
            type="text"
            placeholder="https://example.com/very-long-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.inputFull}
          />

          <div style={styles.row}>
            <input
              type="text"
              placeholder="Custom name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />

            <button
              onClick={handleShorten}
              style={{
                ...styles.primaryBtn,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating..." : "Create Link"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>
          <StatCard
            title="Total Links"
            value={stats.totalLinks}
            icon={<Link2 size={22} />}
            color="#4f46e5"
          />

          <StatCard
            title="Total Clicks"
            value={stats.totalClicks}
            icon={<MousePointerClick size={22} />}
            color="#059669"
          />

          <StatCard
            title="Active Links"
            value={stats.activeLinks}
            icon={<Activity size={22} />}
            color="#dc2626"
          />
        </div>

        {/* LINKS */}
        <div style={styles.linksContainer}>
          <div style={styles.linksHeader}>
            <h2 style={{ margin: 0 }}>Your Links</h2>

            <div style={styles.linkCount}>
              {links.length} {links.length === 1 ? "Link" : "Links"}
            </div>
          </div>

          {links.length === 0 ? (
            <div style={styles.emptyState}>
              <Link2 size={55} color="#94a3b8" />

              <h3 style={{ marginBottom: "8px" }}>
                No links created yet
              </h3>

              <p style={{ color: "#64748b" }}>
                Create your first short link to get started
              </p>
            </div>
          ) : (
            links.map((link) => {
              const shortUrl = `${BASE_URL}/r/${link.shortId}`;

              return (
                <div key={link._id} style={styles.linkCard}>
                  {/* LEFT */}
                  <div style={styles.leftSection}>
                    <div style={styles.linkTop}>
                      <h3 style={styles.linkName}>
                        {link.name || "Untitled"}
                      </h3>

                      <span
                        style={{
                          ...styles.statusBadge,
                          background: link.isActive
                            ? "#dcfce7"
                            : "#fee2e2",

                          color: link.isActive
                            ? "#166534"
                            : "#b91c1c",
                        }}
                      >
                        {link.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p style={styles.originalUrl}>
                      {link.originalUrl}
                    </p>

                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.shortUrl}
                    >
                      {shortUrl}

                      <ExternalLink size={14} />
                    </a>

                    <div style={styles.metaRow}>
                      <span style={styles.clickBadge}>
                        <MousePointerClick size={14} />

                        {link.clicks} Clicks
                      </span>

                      <span style={styles.dateText}>
                        {new Date(
                          link.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* QR */}
                  <div style={styles.qrBox}>
                    <QRCodeCanvas
                      value={shortUrl}
                      size={85}
                      ref={(el) =>
                        (qrRefs.current[link.shortId] = el)
                      }
                    />
                  </div>

                  {/* ACTIONS */}
                  <div style={styles.actions}>
                    {/* COPY */}
                    <div
                      style={{ position: "relative" }}
                      onMouseEnter={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 1;
                          tooltip.style.visibility = "visible";
                          tooltip.style.right = "60px";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 0;
                          tooltip.style.visibility = "hidden";
                          tooltip.style.right = "55px";
                        }
                      }}
                    >
                      <button
                        onClick={() =>
                          copyToClipboard(shortUrl, link.shortId)
                        }
                        style={styles.actionBtn}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "#dbeafe";

                          e.currentTarget.style.transform =
                            "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "#f1f5f9";

                          e.currentTarget.style.transform =
                            "translateY(0)";
                        }}
                      >
                        <Copy size={17} />
                      </button>

                      <div
                        style={styles.tooltip}
                        className="tooltip"
                      >
                        Copy Link
                      </div>
                    </div>

                    {/* ANALYTICS */}
                    <div
                      style={{ position: "relative" }}
                      onMouseEnter={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 1;
                          tooltip.style.visibility = "visible";
                          tooltip.style.right = "60px";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 0;
                          tooltip.style.visibility = "hidden";
                          tooltip.style.right = "55px";
                        }
                      }}
                    >
                      <a
                        href={`/analytics/${link.shortId}`}
                        style={{
                          ...styles.actionBtn,
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "#ddd6fe";

                          e.currentTarget.style.transform =
                            "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "#f1f5f9";

                          e.currentTarget.style.transform =
                            "translateY(0)";
                        }}
                      >
                        <BarChart3 size={17} />
                      </a>

                      <div
                        style={styles.tooltip}
                        className="tooltip"
                      >
                        Analytics
                      </div>
                    </div>

                    {/* DOWNLOAD */}
                    <div
                      style={{ position: "relative" }}
                      onMouseEnter={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 1;
                          tooltip.style.visibility = "visible";
                          tooltip.style.right = "60px";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 0;
                          tooltip.style.visibility = "hidden";
                          tooltip.style.right = "55px";
                        }
                      }}
                    >
                      <button
                        onClick={() => downloadQR(link.shortId)}
                        style={styles.actionBtn}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "#dcfce7";

                          e.currentTarget.style.transform =
                            "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "#f1f5f9";

                          e.currentTarget.style.transform =
                            "translateY(0)";
                        }}
                      >
                        <Download size={17} />
                      </button>

                      <div
                        style={styles.tooltip}
                        className="tooltip"
                      >
                        Download QR
                      </div>
                    </div>

                    {/* TOGGLE */}
                    <div
                      style={{ position: "relative" }}
                      onMouseEnter={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 1;
                          tooltip.style.visibility = "visible";
                          tooltip.style.right = "60px";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 0;
                          tooltip.style.visibility = "hidden";
                          tooltip.style.right = "55px";
                        }
                      }}
                    >
                      <button
                        onClick={() => handleToggle(link._id)}
                        style={styles.actionBtn}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "#fef3c7";

                          e.currentTarget.style.transform =
                            "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "#f1f5f9";

                          e.currentTarget.style.transform =
                            "translateY(0)";
                        }}
                      >
                        <Power size={17} />
                      </button>

                      <div
                        style={styles.tooltip}
                        className="tooltip"
                      >
                        {link.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </div>
                    </div>

                    {/* DELETE */}
                    <div
                      style={{ position: "relative" }}
                      onMouseEnter={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 1;
                          tooltip.style.visibility = "visible";
                          tooltip.style.right = "60px";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const tooltip =
                          e.currentTarget.querySelector(".tooltip");

                        if (tooltip) {
                          tooltip.style.opacity = 0;
                          tooltip.style.visibility = "hidden";
                          tooltip.style.right = "55px";
                        }
                      }}
                    >
                      <button
                        onClick={() => handleDelete(link._id)}
                        style={{
                          ...styles.actionBtn,
                          background: "#fee2e2",
                          color: "#dc2626",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "#fecaca";

                          e.currentTarget.style.transform =
                            "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "#fee2e2";

                          e.currentTarget.style.transform =
                            "translateY(0)";
                        }}
                      >
                        <Trash2 size={17} />
                      </button>

                      <div
                        style={styles.tooltip}
                        className="tooltip"
                      >
                        Delete Link
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;

/* STAT CARD */
const StatCard = ({ title, value, icon, color }) => (
  <div style={styles.statCard}>
    <div
      style={{
        ...styles.statIcon,
        background: `${color}15`,
        color,
      }}
    >
      {icon}
    </div>

    <div>
      <p style={styles.statTitle}>{title}</p>

      <h2 style={styles.statValue}>{value}</h2>
    </div>
  </div>
);

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "30px",
  },

  header: {
    marginBottom: "25px",
  },

  heading: {
    margin: 0,
    fontSize: "34px",
    fontWeight: "700",
    color: "#0f172a",
  },

  subHeading: {
    marginTop: "6px",
    color: "#64748b",
  },

  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#111827",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "10px",
    zIndex: 1000,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },

  createCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "24px",
    marginBottom: "30px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },

  createTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
  },

  createIconBox: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#111827",
  },

  cardSub: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  inputFull: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #dbeafe",
    fontSize: "15px",
    marginBottom: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  row: {
    display: "flex",
    gap: "12px",
  },

  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #dbeafe",
    fontSize: "15px",
    outline: "none",
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "0 24px",
    fontWeight: "600",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  statCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },

  statIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statTitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  statValue: {
    margin: "4px 0 0",
    fontSize: "28px",
    color: "#0f172a",
  },

  linksContainer: {
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },

  linksHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  linkCount: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  },

  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
  },

  linkCard: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    marginBottom: "16px",
    alignItems: "center",
  },

  leftSection: {
    flex: 1,
  },

  linkTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  linkName: {
    margin: 0,
    fontSize: "18px",
    color: "#111827",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  originalUrl: {
    margin: "0 0 10px",
    color: "#64748b",
    fontSize: "14px",
    wordBreak: "break-word",
  },

  shortUrl: {
    color: "#4f46e5",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "600",
    marginBottom: "12px",
    wordBreak: "break-all",
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  clickBadge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  dateText: {
    color: "#6b7280",
    fontSize: "13px",
  },

  qrBox: {
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "16px",
  },

  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  actionBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    border: "none",
    background: "#f1f5f9",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#334155",
    transition: "all 0.25s ease",
    position: "relative",
  },

  tooltip: {
    position: "absolute",
    right: "55px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "#0f172a",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
    opacity: 0,
    visibility: "hidden",
    transition: "all 0.2s ease",
    pointerEvents: "none",
    zIndex: 20,
  },
};

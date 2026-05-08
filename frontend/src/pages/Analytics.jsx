import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getAnalytics } from "../services/linkService";

import Footer from "../components/Footer";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

import Navbar from "../components/Navbar";

import {
  MousePointerClick,
  Activity,
  CalendarDays,
  TrendingUp,
  BarChart3,
  ExternalLink,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_REDIRECT_BASE_URL;

const Analytics = () => {
  const { code } = useParams();

  const [data, setData] = useState([]);

  const [meta, setMeta] = useState({
    totalClicks: 0,
    createdAt: "",
    isActive: false,
  });

  const [range, setRange] = useState("7");

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, code]);

  const fetchAnalytics = async (currentRange) => {
    try {
      const res = await getAnalytics(code, currentRange);

      setData(res.data.data || []);

      setMeta({
        totalClicks: res.data.totalClicks,
        createdAt: res.data.createdAt,
        isActive: res.data.isActive,
        name: res.data.name,
        originalUrl: res.data.originalUrl,
        shortCode: res.data.shortCode,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // CUSTOM TOOLTIP
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipDate}>
            {new Date(label).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

          <p style={styles.tooltipClicks}>
            {payload[0].value} Clicks
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Analytics</h1>

            <p style={styles.subHeading}>
              Track link performance and click activity
            </p>
          </div>

          <div
            style={{
              ...styles.statusBadge,
              background: meta.isActive
                ? "#dcfce7"
                : "#fee2e2",

              color: meta.isActive
                ? "#166534"
                : "#b91c1c",
            }}
          >
            <Activity size={15} />

            {meta.isActive ? "Active" : "Inactive"}
          </div>
        </div>

        {/* LINK INFO CARD */}
        <div style={styles.linkInfoCard}>
          <div>
            <p style={styles.linkLabel}>Tracking Link</p>

            <h2 style={styles.linkName}>
              {meta.name || "Untitled Link"}
            </h2>

            <a
              href={`${BASE_URL}/r/${meta.shortCode}`}
              target="_blank"
              rel="noreferrer"
              style={styles.shortUrl}
            >
              {BASE_URL}/r/{meta.shortCode}

              <ExternalLink size={15} />
            </a>

            <p style={styles.originalUrl}>
              {meta.originalUrl}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>
          <StatCard
            icon={<MousePointerClick size={22} />}
            title="Total Clicks"
            value={meta.totalClicks}
            color="#4f46e5"
          />

          <StatCard
            icon={<TrendingUp size={22} />}
            title="Performance"
            value={
              meta.totalClicks > 0
                ? "Growing"
                : "No Activity"
            }
            color="#059669"
          />

          <StatCard
            icon={<CalendarDays size={22} />}
            title="Created On"
            value={
              meta.createdAt
                ? new Date(meta.createdAt).toLocaleDateString(
                    "en-IN"
                  )
                : "-"
            }
            color="#ea580c"
          />
        </div>

        {/* FILTERS */}
        <div style={styles.filterWrapper}>
          {["7", "30", "all"].map((item) => {
            const active = range === item;

            return (
              <button
                key={item}
                onClick={() => setRange(item)}
                style={{
                  ...styles.filterBtn,
                  background: active
                    ? "#4f46e5"
                    : "#fff",

                  color: active ? "#fff" : "#475569",

                  boxShadow: active
                    ? "0 10px 20px rgba(79,70,229,0.2)"
                    : "none",
                }}
              >
                {item === "all"
                  ? "All Time"
                  : `${item} Days`}
              </button>
            );
          })}
        </div>

        {/* CHART CARD */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
              <h2 style={styles.chartTitle}>
                Click Analytics
              </h2>

              <p style={styles.chartSub}>
                Daily click activity for your shortened link
              </p>
            </div>

            <div style={styles.chartIcon}>
              <BarChart3 size={20} />
            </div>
          </div>

          {data.length === 0 ? (
            <div style={styles.emptyState}>
              <BarChart3 size={55} color="#94a3b8" />

              <h3 style={{ marginBottom: "10px" }}>
                No analytics available
              </h3>

              <p style={{ color: "#64748b" }}>
                No clicks recorded for this period
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorClicks"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#4f46e5"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="#4f46e5"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(value) => {
                    const [y, m, d] = value.split("-");

                    return `${d}/${m}`;
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  domain={[0, "dataMax + 2"]}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#cbd5e1",
                    strokeWidth: 1,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#4f46e5"
                  fill="url(#colorClicks)"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#4f46e5",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Analytics;

/* STAT CARD */
const StatCard = ({
  icon,
  title,
  value,
  color,
}) => (
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "15px",
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

  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "600",
    fontSize: "14px",
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
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },

  statIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statTitle: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
  },

  statValue: {
    margin: "6px 0 0",
    fontSize: "26px",
    color: "#0f172a",
    fontWeight: "700",
  },

  filterWrapper: {
    display: "flex",
    gap: "12px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  filterBtn: {
    border: "1px solid #e2e8f0",
    padding: "10px 18px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s",
  },

  chartCard: {
    background: "#fff",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },

  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  chartTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#0f172a",
  },

  chartSub: {
    marginTop: "5px",
    color: "#64748b",
    fontSize: "14px",
  },

  chartIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "16px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  tooltip: {
    background: "#fff",
    padding: "12px 14px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },

  tooltipDate: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  },

  tooltipClicks: {
    margin: "6px 0 0",
    fontWeight: "700",
    color: "#0f172a",
  },

  emptyState: {
    height: "350px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  linkInfoCard: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "28px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  },

  linkLabel: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  linkName: {
    margin: "0 0 10px",
    fontSize: "28px",
    color: "#0f172a",
    fontWeight: "700",
  },

  shortUrl: {
    color: "#4f46e5",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "600",
    marginBottom: "10px",
    fontSize: "16px",
  },

  originalUrl: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
    wordBreak: "break-word",
  },
};

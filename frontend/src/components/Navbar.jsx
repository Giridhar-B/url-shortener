import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authService";

import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Link2,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);

  const dropdownRef = useRef(null);

  
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () =>
      window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav style={styles.navbar}>
      {/* LEFT */}
      <div style={styles.leftSection}>
        {/* LOGO */}
        <div
          style={styles.logoWrapper}
          onClick={() => navigate("/")}
        >
          <div style={styles.logoIcon}>
            <Link2 size={18} />
          </div>

          <div>
            <h2 style={styles.logo}>URL Shortener</h2>
            <p style={styles.logoSub}>Smart Link Management</p>
          </div>
        </div>

        {/* NAV BUTTON */}
        <button
          onClick={() => navigate("/")}
          style={{
            ...styles.navBtn,
            background:
              location.pathname === "/"
                ? "#eef2ff"
                : "transparent",
            color:
              location.pathname === "/"
                ? "#4f46e5"
                : "#475569",
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== "/") {
              e.currentTarget.style.background = "#f8fafc";
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== "/") {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
      </div>

      {/* RIGHT PROFILE */}
      <div
        style={styles.profileWrapper}
        ref={dropdownRef}
      >
        <button
          style={styles.profileBtn}
          onClick={(e) => {
            e.stopPropagation();
            setShowProfile(!showProfile);
          }}
        >
          <div style={styles.avatar}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div style={styles.profileInfo}>
            <span style={styles.profileName}>
              {user?.name || "User"}
            </span>

            <span style={styles.profileEmail}>
              {user?.email || "user@email.com"}
            </span>
          </div>

          <ChevronDown
            size={18}
            style={{
              transition: "0.2s",
              transform: showProfile
                ? "rotate(180deg)"
                : "rotate(0deg)",
            }}
          />
        </button>

        {/* DROPDOWN */}
        {showProfile && (
          <div style={styles.dropdown}>
            {/* USER INFO */}
            <div style={styles.dropdownHeader}>
              <div style={styles.dropdownAvatar}>
                <User size={18} />
              </div>

              <div>
                <p style={styles.dropdownName}>
                  {user?.name || "User"}
                </p>

                <p style={styles.dropdownEmail}>
                  {user?.email || "No Email"}
                </p>
              </div>
            </div>

            <div style={styles.divider}></div>

            {/* LOGOUT */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              style={styles.logoutBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fee2e2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

const styles = {
  navbar: {
    height: "78px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },

  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },

  logoIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(79,70,229,0.25)",
  },

  logo: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
  },

  logoSub: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  },

  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "0.2s",
  },

  profileWrapper: {
    position: "relative",
  },

  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "1px solid #e2e8f0",
    background: "#fff",
    borderRadius: "16px",
    padding: "8px 12px",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "15px",
  },

  profileInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  profileName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
  },

  profileEmail: {
    fontSize: "12px",
    color: "#64748b",
  },

  dropdown: {
    position: "absolute",
    top: "72px",
    right: 0,
    width: "260px",
    background: "#fff",
    borderRadius: "20px",
    padding: "18px",
    boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
    border: "1px solid #e2e8f0",
    animation: "fadeIn 0.2s ease",
  },

  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  dropdownAvatar: {
    width: "45px",
    height: "45px",
    borderRadius: "14px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4f46e5",
  },

  dropdownName: {
    margin: 0,
    fontWeight: "700",
    color: "#0f172a",
  },

  dropdownEmail: {
    margin: "3px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },

  divider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "16px 0",
  },

  logoutBtn: {
    width: "100%",
    border: "none",
    background: "transparent",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "600",
    color: "#dc2626",
    transition: "0.2s",
  },
};
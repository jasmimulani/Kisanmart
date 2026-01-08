import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";

const ContactUs = () => {
  const { axios } = useAppContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(formData).some((v) => !v.trim())) {
      toast.error("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/contact/contact", formData);
      if (data.success) {
        toast.success("Your request has been received successfully.");
        setFormData({
          name: "",
          email: "",
          contact: "",
          message: "",
        });
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={container}>
        {/* LEFT PANEL */}
        <aside style={leftPanel}>
          <h2 style={brand}>KisanMart</h2>
          <p style={tagline}>
            A digital agriculture marketplace providing quality seeds,
            fertilizers, tools, and farming solutions.
          </p>

          <div style={infoBlock}>
            <InfoRow icon={<FaPhoneAlt />} text="+91 98765 43210" />
            <InfoRow icon={<FaEnvelope />} text="support@kisanmart.com" />
            <InfoRow
              icon={<FaMapMarkerAlt />}
              text="Mumbai, Maharashtra, India"
            />
          </div>

          <div style={businessBox}>
            <strong>Business Hours</strong>
            <p>
              Monday – Saturday
              <br />
              9:00 AM – 6:00 PM
            </p>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <section style={rightPanel}>
          <h3 style={formTitle}>Contact Support</h3>
          <p style={formDesc}>
            Submit your inquiry and our support team will respond within one
            business day.
          </p>

          <form onSubmit={handleSubmit} style={form}>
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <InputField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <InputField
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
            />

            <div style={{ marginBottom: "22px" }}>
              <label style={labelStyle}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={textarea}
                placeholder="Describe your inquiry clearly"
              />
            </div>

            <button type="submit" disabled={loading} style={button}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

/* ---------------- Reusable Components ---------------- */

const InputField = ({ label, name, value, onChange }) => (
  <div style={{ marginBottom: "22px" }}>
    <label style={labelStyle}>{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      style={input}
      placeholder={label}
    />
  </div>
);

const InfoRow = ({ icon, text }) => (
  <div style={infoRow}>
    <span style={{ color: "#2e7d32" }}>{icon}</span>
    <span>{text}</span>
  </div>
);

/* ---------------- Styles ---------------- */

const page = {
  minHeight: "100vh",
  background: "#f4f6f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const container = {
  width: "1100px",
  background: "#ffffff",
  display: "flex",
  border: "1px solid #e0e0e0",
};

const leftPanel = {
  width: "35%",
  padding: "40px",
  borderRight: "1px solid #e0e0e0",
  background: "#fafafa",
};

const rightPanel = {
  width: "65%",
  padding: "40px 50px",
};

const brand = {
  fontSize: "26px",
  fontWeight: "700",
  color: "#1b5e20",
};

const tagline = {
  marginTop: "12px",
  fontSize: "14px",
  color: "#555",
  lineHeight: "1.6",
};

const infoBlock = {
  marginTop: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const infoRow = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "14px",
  color: "#333",
};

const businessBox = {
  marginTop: "40px",
  fontSize: "14px",
  color: "#444",
};

const formTitle = {
  fontSize: "22px",
  fontWeight: "600",
  marginBottom: "6px",
};

const formDesc = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "30px",
};

const form = {
  maxWidth: "520px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#333",
};

const input = {
  width: "100%",
  padding: "11px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const textarea = {
  width: "100%",
  height: "120px",
  padding: "11px",
  border: "1px solid #ccc",
  fontSize: "14px",
  resize: "none",
};

const button = {
  padding: "12px 22px",
  background: "#1b5e20",
  color: "#fff",
  border: "none",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

export default ContactUs;

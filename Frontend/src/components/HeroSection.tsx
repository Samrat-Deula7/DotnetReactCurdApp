import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

const shortcuts = [
  {
    to: "/getall",
    icon: "☷",
    title: "Browse directory",
    text: "See everyone and filter by name or ID.",
  },
  {
    to: "/getbyid",
    icon: "⌕",
    title: "Find a person",
    text: "Jump to a specific record with its ID.",
  },
  {
    to: "/update",
    icon: "✎",
    title: "Edit a record",
    text: "Update the name on an existing record.",
  },
];

export default function HeroSection() {
  return (
    <Dashboard
      title="Overview"
      description="Your workspace for managing people records."
      action={
        <Link className="pd-button" to="/add">
          + Add person
        </Link>
      }
    >
      <section className="pd-panel pd-hero">
        <div className="pd-hero-content">
          <p className="pd-kicker">DIRECTORY WORKSPACE</p>
          <h2>Manage your people directory</h2>
          <p>Browse records, find someone by ID, or add a new person.</p>
          <Link className="pd-button" to="/getall">
            Open directory →
          </Link>
        </div>
      </section>
      <section className="pd-shortcuts">
        <h2>Quick actions</h2>
        <div className="pd-cards">
          {shortcuts.map(({ to, icon, title, text }) => (
            <Link className="pd-panel pd-card" key={to} to={to}>
              <span className="pd-card-icon" aria-hidden="true">
                {icon}
              </span>
              <strong>{title}</strong>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </section>
    </Dashboard>
  );
}

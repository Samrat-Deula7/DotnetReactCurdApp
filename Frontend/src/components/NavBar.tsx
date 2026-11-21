import { NavLink } from "react-router-dom";

const links = [
  ["/", "⌂", "Overview"],
  ["/getall", "☷", "All people"],
  ["/getbyid", "⌕", "Find by ID"],
  ["/add", "+", "Add person"],
  ["/update", "✎", "Edit person"],
  ["/delete", "−", "Delete person"],
];

export default function NavBar() {
  return (
    <aside className="pd-sidebar">
      <NavLink to="/" className="pd-brand">
        <span>PD</span> PeopleDesk
      </NavLink>
      <div className="pd-workspace">
        <small>WORKSPACE</small>
        <strong>People directory</strong>
      </div>
      <nav aria-label="Main navigation">
        <small>DIRECTORY</small>
        {links.map(([path, icon, label]) => (
          <NavLink key={path} to={path} end>
            <span aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="pd-sidebar-footer">Directory workspace</div>
    </aside>
  );
}

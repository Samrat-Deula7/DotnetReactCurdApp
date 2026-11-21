import type { ReactNode } from "react";
import NavBar from "./NavBar";
import "./dashboard.css";

type DashboardProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
};

export default function Dashboard({
  title,
  description,
  action,
  children,
}: DashboardProps) {
  return (
    <div className="pd-shell">
      <NavBar />
      <main className="pd-main">
        <header className="pd-header">
          <div>
            <p className="pd-kicker">PEOPLE DIRECTORY</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {action}
        </header>
        {children}
      </main>
    </div>
  );
}

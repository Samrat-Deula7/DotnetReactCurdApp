import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import { peopleRequest } from "./peopleApi";
import type { Person } from "./peopleApi";

export default function GetAllPeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    peopleRequest<Person[]>("", { signal: controller.signal })
      .then((records) => {
        if (!controller.signal.aborted) setPeople(records);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setPending(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const search = query.trim().toLowerCase();
  const visible = people.filter((person) =>
    `${person.firstName} ${person.lastName} #${person.id}`
      .toLowerCase()
      .includes(search),
  );

  return (
    <Dashboard
      title="All people"
      description="Browse and manage records in your directory."
      action={
        <Link className="pd-button" to="/add">
          + Add person
        </Link>
      }
    >
      <div className="pd-panel pd-toolbar">
        <label>
          Search directory
          <input
            type="search"
            placeholder="Search by name or ID…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        {!pending && !error && (
          <span role="status">
            {visible.length} of {people.length} records
          </span>
        )}
      </div>
      {pending ? (
        <p className="pd-panel pd-empty" role="status">
          Loading directory…
        </p>
      ) : error ? (
        <div className="pd-panel pd-empty">
          <p role="alert">{error}</p>
          <button
            className="pd-button pd-secondary"
            onClick={() => {
              setPending(true);
              setError("");
              setAttempt(attempt + 1);
            }}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="pd-panel pd-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length ? (
                visible.map((person) => (
                  <tr key={person.id}>
                    <td>#{person.id}</td>
                    <td>
                      <strong>
                        {person.firstName} {person.lastName}
                      </strong>
                    </td>
                    <td className="pd-row-actions">
                      <Link to={`/getbyid?id=${person.id}`}>View</Link>
                      <Link to={`/update?id=${person.id}`}>Edit</Link>
                      <Link to={`/delete?id=${person.id}`}>Delete</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="pd-empty">
                    {people.length
                      ? "No records match your search."
                      : "No people yet. Add a person to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Dashboard>
  );
}

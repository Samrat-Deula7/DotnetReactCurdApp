import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import { peopleRequest } from "./peopleApi";
import type { Person } from "./peopleApi";

const settings = {
  POST: ["Add person", "Create a new record in the directory.", "Save person"],
  GET: [
    "Find by ID",
    "Look up an individual record using its directory ID.",
    "Find person",
  ],
  PUT: [
    "Edit person",
    "Enter the record ID and the full replacement name.",
    "Save changes",
  ],
  DELETE: [
    "Delete person",
    "Permanently remove a record using its directory ID.",
    "Delete person",
  ],
} as const;

export default function PersonForm({
  method,
}: {
  method: keyof typeof settings;
}) {
  const [params] = useSearchParams();
  const [id, setId] = useState(params.get("id") ?? "");
  const [result, setResult] = useState<Person>();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [title, description, action] = settings[method];
  const needsName = method === "POST" || method === "PUT";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const personId = Number(id);
    setError("");
    setNotice("");
    setResult(undefined);
    if (needsName && (!firstName || !lastName)) {
      setError("Enter both a first name and a last name.");
      return;
    }
    if (
      method === "DELETE" &&
      !window.confirm(`Permanently delete person #${personId}?`)
    )
      return;
    setPending(true);
    try {
      const person = await peopleRequest<Person | undefined>(
        method === "POST" ? "" : `/${personId}`,
        {
          method,
          ...(needsName && {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName,
              lastName,
              ...(method === "PUT" && { id: personId }),
            }),
          }),
        },
      );
      setResult(person);
      if (method === "POST") {
        setNotice("Person added to the directory.");
        form.reset();
      }
      if (method === "PUT") setNotice(`Person #${personId} was updated.`);
      if (method === "DELETE") {
        setNotice(`Person #${personId} was deleted.`);
        setId("");
      }
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Dashboard
      title={title}
      description={description}
      action={
        <Link className="pd-button pd-secondary" to="/getall">
          ← All people
        </Link>
      }
    >
      <section className="pd-panel pd-form-panel">
        <h2>{method === "GET" ? "Record lookup" : "Record details"}</h2>
        <form onSubmit={submit}>
          <fieldset disabled={pending}>
            {method !== "POST" && (
              <label>
                Person ID
                <input
                  type="number"
                  min="1"
                  max="2147483647"
                  step="1"
                  required
                  value={id}
                  onChange={(event) => setId(event.target.value)}
                  placeholder="e.g. 1"
                />
              </label>
            )}
            {needsName && (
              <div className="pd-fields">
                <label>
                  First name
                  <input
                    name="firstName"
                    autoComplete="given-name"
                    required
                    placeholder="e.g. Namu"
                  />
                </label>
                <label>
                  Last name
                  <input
                    name="lastName"
                    autoComplete="family-name"
                    required
                    placeholder="e.g. Shrestha"
                  />
                </label>
              </div>
            )}
            {method === "DELETE" && (
              <p className="pd-warning">This action cannot be undone.</p>
            )}
            <button
              className={`pd-button ${method === "DELETE" ? "pd-danger" : ""}`}
              type="submit"
            >
              {pending ? "Working…" : action}
            </button>
          </fieldset>
        </form>
        {error && (
          <p className="pd-warning" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="pd-notice" role="status">
            {notice}
          </p>
        )}
        {result && (
          <div className="pd-notice" role={notice ? undefined : "status"}>
            <strong>
              {result.firstName} {result.lastName}
            </strong>{" "}
            · ID #{result.id}
          </div>
        )}
      </section>
    </Dashboard>
  );
}

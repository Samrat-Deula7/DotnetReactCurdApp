export type Person = { id: number; firstName: string; lastName: string };

const endpoint =
  import.meta.env.VITE_PEOPLE_API_URL || "http://localhost:5170/api/people";

export async function peopleRequest<Result>(
  path = "",
  options?: RequestInit,
): Promise<Result> {
  let response: Response;
  try {
    response = await fetch(`${endpoint.replace(/\/$/, "")}${path}`, options);
  } catch (error) {
    if (options?.signal?.aborted) throw error;
    throw new Error(
      "Could not reach the People API. Check that the backend is running and allows this frontend origin.",
      { cause: error },
    );
  }
  if (response.status === 404)
    throw new Error("No person was found with that ID.");
  if (!response.ok)
    throw new Error(
      `The People API could not complete the request (${response.status}).`,
    );
  return (
    response.status === 204 ? undefined : await response.json()
  ) as Result;
}

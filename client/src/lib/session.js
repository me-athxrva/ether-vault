export async function getSession() {
  const res = await fetch("http://localhost:3001/api/auth/session", {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;

  return await res.json();
}

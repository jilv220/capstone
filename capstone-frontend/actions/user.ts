export async function getUser() {
  const res = await fetch(process.env.API_URL + '/api/v1/user');
  return await res.json();
}

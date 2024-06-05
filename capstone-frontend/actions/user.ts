import KySingleton from '@/lib/kySingleton';

const ky = KySingleton.getInstance();

export async function getUser() {
  const res = await ky.get('user/me');
  if (!res.ok) return null;

  return res.json();
}

import ky from '@/lib/kySingleton';

export async function getUser() {
  let user;
  try {
    user = await ky.getInstance().get('user/me').json();
  } catch (e) {
    console.error(e);
  }

  return user;
}

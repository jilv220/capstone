import ky from '@/lib/kySingleton';

export async function getUser() {
  const res = await ky
    .getInstance()
    .extend({
      hooks: {
        beforeRequest: [
          (req) => {
            console.log(req.headers);
          },
        ],
      },
    })
    .get('user/me');

  if (!res.ok) return null;

  return res.json();
}

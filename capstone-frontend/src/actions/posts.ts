import ky from "ky";

export type PostType = {
  id: string;
  title: string;
  body: string;
};

// An fetch example (ky is just a wrapper of fetch)
export async function fetchPosts() {
  return await ky.get(
    `https://jsonplaceholder.typicode.com/posts`,
  ).json<PostType[]>();
}

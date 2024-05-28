import { fetchPosts } from '@/lib/fetch/posts';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';

const postsQueryOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: () => fetchPosts(),
});

export const Route = createFileRoute('/posts')({
  loader: ({ context: ctx }) => ctx.queryClient.ensureQueryData(postsQueryOptions),
  component: Posts,
});

function Posts() {
  const { data: posts } = useSuspenseQuery(postsQueryOptions);
  return (
    <main>
      <div className="flex gap-2 p-2">
        <ul className="list-disc pl-4">
          {posts?.map((post) => {
            return (
              <li key={post.id} className="whitespace-nowrap">
                <Link
                  // to="/posts/$postId"
                  // params={{
                  //   postId: post.id,
                  // }}
                  className="block py-1 font-bold text-blue-800 hover:text-blue-600 active:text-black"
                >
                  <div>{post.title.substring(0, 40)}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

import { fetchPosts } from '@/lib/fetch/posts';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { ErrorComponent, Link, createFileRoute } from '@tanstack/react-router';

const postsQueryOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: () => fetchPosts(),
});

export const Route = createFileRoute('/posts')({
  loader: ({ context: ctx }) => ctx.queryClient.ensureQueryData(postsQueryOptions),
  component: Posts,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
});

function Posts() {
  /**
   * Feel free to throw in the component since it will be catched by the nearest ErrorComponent
   */
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

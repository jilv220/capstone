import { getAllMessages, getConversations } from "@/actions/chat";
import { getMoodChart, getMoodCount } from "@/actions/moodLog";
import { Conversation } from "@/interfaces/chat";
import { useQueries, useQuery } from "@tanstack/react-query";

export function usePrefetchAllScreens() {
  const { data: conversations } = useQuery({
    queryKey: ['conversation'],
    queryFn: getConversations,
  });

  const toSorted = (conversations: Conversation[] | undefined) =>
    conversations ? conversations.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)) : [];

  useQueries({
    queries: [
      {
        queryKey: ['mood-log', 'mood-avg'],
        queryFn: getMoodChart,
      },
      {
        queryKey: ['mood-log', 'mood-count'],
        queryFn: getMoodCount,
      },
    ],
  });

  useQueries({
    queries: toSorted(conversations)
      .slice(0, 4)
      .map((c) => ({
        queryKey: ['conversation', c.id],
        queryFn: () => getAllMessages(c.id),
      })),
  });
}
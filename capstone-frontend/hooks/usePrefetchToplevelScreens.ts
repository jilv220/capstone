import { getAllMessages, getConversations } from "@/actions/chat";
import { getMoodChart, getMoodCount } from "@/actions/moodLog";
import { Conversation } from "@/interfaces/chat";
import { useQueries, useQuery } from "@tanstack/react-query";

export function usePrefetchToplevelScreens() {
  const { data: conversations } = useQuery({
    queryKey: ['conversation'],
    queryFn: getConversations,
  });

  const toSorted = (conversations: Conversation[] | undefined) =>
    conversations ? conversations.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)) : [];

  const prevYear = [...Array(12)].map((_, i) => i);

  useQueries({
    queries: prevYear.map((prevNMonth) => ({
      queryKey: ['mood-log', 'mood-avg', prevNMonth],
      queryFn: () => getMoodChart(prevNMonth)
    })) 
  }); 

  useQueries({
    queries: prevYear.map((prevNMonth) => ({
      queryKey: ['mood-log', 'mood-count', prevNMonth],
      queryFn: () => getMoodCount(prevNMonth)
    }))
  }) 

  useQueries({
    queries: toSorted(conversations)
      .slice(0, 4)
      .map((c) => ({
        queryKey: ['conversation', c.id],
        queryFn: () => getAllMessages(c.id),
      })),
  });
}
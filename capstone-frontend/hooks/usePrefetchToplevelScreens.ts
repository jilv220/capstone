import { useEffect } from "react";
import { getAllMessages, getConversations } from "@/actions/chat";
import { getMoodChart, getMoodCount } from "@/actions/moodLog";
import { Conversation } from "@/interfaces/chat";
import { useQueries, useQueryClient } from "@tanstack/react-query";

export function usePrefetchToplevelScreens() {
  const queryClient = useQueryClient();

  useEffect(() => {
    async function prefetchData() {
      const conversations = await queryClient.ensureQueryData({
        queryKey: ['conversation'],
        queryFn: getConversations,
      });

      const prevYear = [...Array(12)].map((_, i) => i);
      await Promise.all([
        ...prevYear.map((prevNMonth) => queryClient.prefetchQuery({
          queryKey: ['mood-log', 'mood-avg', prevNMonth],
          queryFn: () => getMoodChart(prevNMonth),
        })),
        ...prevYear.map((prevNMonth) => queryClient.prefetchQuery({
          queryKey: ['mood-log', 'mood-count', prevNMonth],
          queryFn: () => getMoodCount(prevNMonth),
        })),
      ]);

      const toSorted = (conversations: Conversation[] | undefined) =>
        conversations ? conversations.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)) : [];
      await Promise.all(
        toSorted(conversations).slice(0, 4).map((c) =>
          queryClient.prefetchQuery({
            queryKey: ['conversation', c.id],
            queryFn: () => getAllMessages(c.id),
          })
        )
      );
    }

    prefetchData()
      .catch((e) => {
        console.warn(`Prefetch failed. Reason: ${e}`)
      });
  }, [queryClient]);
}
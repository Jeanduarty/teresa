import { useMutation } from '@tanstack/react-query'

import { contentTopicsService } from '../services/content-topics-service'
import { queryClient } from '../shared/lib/query-client'
import type {
  ContentTopic,
  IdeaConversationTurnInput,
  IdeaReferenceInput,
} from '../shared/types/account-types'

export function useIdeaTopic(userId?: string) {
  const questionsMutation = useMutation<
    { questions: string[] },
    Error,
    { rawIdea: string; maxQuestions?: number }
  >({
    mutationFn: (input) => contentTopicsService.generateIdeaQuestions(input),
  })

  const generateMutation = useMutation<
    ContentTopic,
    Error,
    {
      rawIdea: string
      conversation: IdeaConversationTurnInput[]
      references: IdeaReferenceInput[]
    }
  >({
    mutationFn: (input) => contentTopicsService.generateTopicFromIdea(input),
    onSuccess: (topic) => {
      queryClient.setQueryData<ContentTopic>(
        ['content-topics', userId, topic.id],
        topic,
      )
      void queryClient.invalidateQueries({ queryKey: ['content-topics', userId, 'list'] })
      void queryClient.invalidateQueries({ queryKey: ['content-topics', 'metrics', userId] })
    },
  })

  return {
    questionsMutation,
    generateMutation,
  }
}

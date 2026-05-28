import { createContext, useContext } from 'react'

interface IdeaDialogContextValue {
  openIdeaDialog: (initialIdea?: string) => void
  openIdeaDialogAtQuestions: (rawIdea: string, questions: string[]) => void
}

export const IdeaDialogContext = createContext<IdeaDialogContextValue>({
  openIdeaDialog: () => {},
  openIdeaDialogAtQuestions: () => {},
})

export function useIdeaDialogContext() {
  return useContext(IdeaDialogContext)
}

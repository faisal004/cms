import { ChatOpenAI } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { OpenAIEmbeddings } from '@langchain/openai';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
type recentMessagesOutput = {
  text: string;
  isUserMessage: boolean;
};
export const answerRetrieval = async (
  question: string,
  collectionName: string,
  recentMessages: recentMessagesOutput[],
): Promise<string> => {
  const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-0125',
    temperature: 0.5,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    new OpenAIEmbeddings(),
    {
      url: process.env.QDRANT_URL,
      collectionName,
    },
  );
  const retriever = vectorStore.asRetriever({
    k: 3,
  });
  const retrieverPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder('chat_history'),
    ['user', '{input}'],
    [
      'user',
      'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation',
    ],
  ]);
  const retrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: retrieverPrompt,
  });

  const chatHistory = [
    ...recentMessages.map((message: recentMessagesOutput) =>
      !message.isUserMessage
        ? new HumanMessage(message.text as string)
        : new AIMessage(message.text as string),
    ),
  ];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are 100X Devs AI and online AI assistant. Your'e created by two students of cohort 1, answer the user's questions based from the following context, which is a conversation file of a MERN stack cohort class.
      Context: 
      -----------------
      {context}
      -----------------
      If specific information is not available, you can ask the user for more details.`,
    ],
    new MessagesPlaceholder('chat_history'),
    ['user', '{input}'],
  ]);

  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });
  const conversationChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: retrieverChain,
  });
  // check for question each time

  const response = await conversationChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  return response.answer;
};

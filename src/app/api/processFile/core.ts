// @ts-ignore
import webvtt from 'node-webvtt';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
const collection = new Date().getTime().toString(36);

export const parseVtt = async (url: string): Promise<string> => {
  const vttFile = await fetch(url);
  const blob = await vttFile.blob();
  const buffer = await blob.arrayBuffer();
  const vttData = Buffer.from(buffer).toString();
  const parsedVTT = webvtt.parse(vttData);
  const extractedText = parsedVTT.cues.map((cue: any) => cue.text).join(' ');
  return extractedText;
};

export const storeToDB = async (text: string): Promise<QdrantVectorStore> => {
  const docs = [new Document({ pageContent: text })];
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 20,
  });

  const chunks = await textSplitter.splitDocuments(docs);

  const index = await QdrantVectorStore.fromDocuments(chunks, embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: collection,
  });
  // you need to save this collection name in courses section
  console.log(collection);
  return index;
};

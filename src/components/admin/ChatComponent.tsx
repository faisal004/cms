import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '../ui/input';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ClipLoader from 'react-spinners/ClipLoader';
import { X } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import Image from 'next/image';

interface PreviousMessage {
  text: string;
  isUserMessage: boolean;
}

const ChatComponent = () => {
  const [message, setMessage] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messageList, setMessageList] = useLocalStorage('messageList', []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [message]);

  useEffect(() => {
    setMessageList([]);
  }, []);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newMessage = { text: message, isUserMessage: true };
    setMessageList((prevMessages: PreviousMessage[]) => [
      ...prevMessages,
      newMessage,
    ]);
    setMessage('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          history: JSON.stringify(messageList),
          collectionName: 'lu9wyhuo',
        }),
      });
      const data = await response.json();
      setMessageList((prevMessages: PreviousMessage[]) => [
        ...prevMessages,
        { text: data.answer, isUserMessage: false },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (typeof localStorage === 'undefined') {
    return null;
  }

  return (
    <div>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger className="ml-10 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded p-2 my-4">
          Chat with video
        </PopoverTrigger>
        <PopoverContent
          onInteractOutside={(e) => e.preventDefault()}
          align="start"
          className="bg-[#F4F5F6] w-[600px] h-[600px] relative flex flex-col p-0 items-center justify-center scroll"
        >
          <div className="bg-[#1584FF] w-full p-[10px] flex justify-between text-sm rounded-sm rounded-b-none">
            <div>Clarify Doubts</div>
            <div
              className="cursor-pointer"
              onClick={() => setPopoverOpen(false)}
            >
              <X className="h-5 w-5" />
            </div>
          </div>
          <div
            className="w-full h-full relative overflow-y-auto p-3"
            ref={chatContainerRef}
          >
            {messageList?.length === 0 ? (
              <p className="flex flex-col items-center absolute top-40 right-1 w-full text-black">
                Chat with this video
              </p>
            ) : (
              <div className="flex flex-col gap-y-4 w-full text-center mb-16">
                {messageList?.map((msg: PreviousMessage, index: number) =>
                  msg.isUserMessage ? (
                    <div key={index} className="chat chat-start">
                      <div className="chat-bubble bg-[#1584FF] text-white">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className=" text-left flex flex-col ">
                      <MarkdownRenderer
                        key={index}
                        content={msg.text}
                        id={index.toString()}
                      />
                      <div className="p-1 w-full flex justify-end items-end">
                        <Image
                          src="/harkirat.png"
                          alt=""
                          height={30}
                          width={30}
                        />
                      </div>
                    </div>
                  ),
                )}
                {isLoading && (
                  <div className="chat-bubble bg-slate-900 text-black w-full ml-7 rounded-br-none ">
                    <ClipLoader color="white" loading={isLoading} size={30} />
                  </div>
                )}
              </div>
            )}
          </div>
          <form onSubmit={handleSendMessage}>
            <Input
              required
              className="fixed left-0 bottom-0 pr-10 outline-none rounded-t-none text-black  focus:outline-none focus:ring  w-full focus-visible:ring-0 focus-visible: bg-slate-100"
              value={message}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setMessage(e.target.value);
              }}
            />
            <button
              disabled={isLoading}
              type="submit"
              className="fixed bottom-0 right-0 p-2 text-black  rounded-sm"
            >
              Ask
            </button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatComponent;

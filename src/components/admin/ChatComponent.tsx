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

interface PreviousMessage {
  text: string;
  isUserMessage: boolean;
}

const ChatComponent = () => {
  const [message, setMessage] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messageList, setMessageList] = useLocalStorage('messageList', []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      <Popover>
        <PopoverTrigger className="ml-10 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded p-2 my-4">
          Chat with video
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="bg-[#F4F5F6] w-[400px] h-[400px] relative flex flex-col p-0 items-center justify-center"
        >
          <div className="bg-[#1584FF] w-full p-[10px] text-sm rounded-sm rounded-b-none">
            Chat with video
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
                    <div key={index} className="chat chat-end ">
                      <div className="chat-bubble bg-[#BDBDBD] text-black ">
                        {msg.text}
                      </div>
                    </div>
                  ),
                )}
                {isLoading && (
                  <div className="chat-bubble bg-[#BDBDBD] text-black w-full ml-10 rounded-br-none ">
                    <ClipLoader color="blue" loading={isLoading} size={30} />
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

import React, { useState, useEffect, useRef } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '../ui/input';
import { MessagesSquare } from 'lucide-react';

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return defaultValue;
  });

  useEffect(() => {
    if (value === undefined) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef(null);
  const [messageList, setMessageList] = useLocalStorage('messageList', []);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [message]);
  const handleInputChange = (e: any) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    const newMessage = { text: message, isUserMessage: true };
    setMessageList((prevMessages) => [...prevMessages, newMessage]);
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
      setMessageList((prevMessages) => [
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
          className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500 to-blue-600 w-[400px] h-96 relative flex p-0 items-center justify-center"
        >
          <div
            className="w-full h-full relative overflow-y-auto p-3"
            ref={chatContainerRef}
          >
            {messageList.length === 0 ? (
              <div className="flex flex-col items-center absolute top-40 right-1 w-full">
                <MessagesSquare />
                Chat with video
              </div>
            ) : (
              <div className="flex flex-col gap-y-4 w-full text-center mb-16">
                {messageList.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 ${
                      msg.isUserMessage
                        ? 'bg-black text-white ml-10 rounded-xl rounded-br-none '
                        : 'bg-gray-300 text-black mr-10 rounded-xl rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isLoading && (
                  <p className="bg-gray-300 text-black mr-10 rounded-xl rounded-bl-none py-2">
                    Loading...
                  </p>
                )}
              </div>
            )}
          </div>

          <Input
            className="fixed w-full left-0 bottom-0 pr-10 outline-none"
            value={message}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            className="fixed bottom-0 right-0 p-2"
            onClick={handleSendMessage}
          >
            Ask
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatComponent;

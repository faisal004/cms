'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '../ui/input';
import { MessagesSquare } from 'lucide-react';
import { useState } from 'react';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messagesArray, setMessagesArray] = useState<
    { message: string; isUser: boolean }[]
  >([]);
  const handleInputChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessagesArray([
        ...messagesArray,
        { message: message.trim(), isUser: true },
      ]);
      setMessage('');
      const replyMessage = 'Hi it is a replky';
      setMessagesArray((prevMessages) => [
        ...prevMessages,
        { message: replyMessage, isUser: false },
      ]);
    }
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger className="ml-10 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded p-2 my-4">
          Chat with video
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className=" bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500 to-blue-600 w-[400px] h-96 relative flex  p-0  items-center justify-center"
        >
          <div className="w-full h-full relative overflow-y-auto p-3">
            {messagesArray.length === 0 ? (
              <div className="flex flex-col items-center absolute top-40 right-1   w-full">
                <MessagesSquare />
                Chat with video
              </div>
            ) : (
              <div className="flex flex-col gap-y-4 w-full text-center mb-16">
                {messagesArray.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2  ${
                      msg.isUser
                        ? 'bg-black text-white ml-10 rounded-xl rounded-br-none'
                        : 'bg-gray-300 text-black mr-10 rounded-xl rounded-bl-none'
                    }`}
                  >
                    {msg.message} {index}
                  </div>
                ))}
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

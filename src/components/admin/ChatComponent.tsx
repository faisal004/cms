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
          className=" bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500 to-blue-600 w-80 h-80 relative flex   items-center justify-center overflow-y-auto "
        >
          {messagesArray.length === 0 ? (
            <div className="flex flex-col items-center   w-full">
              <MessagesSquare />
              Chat with video
            </div>
          ) : null}
          {messagesArray.length > 0 ? (
            <div className="flex flex-col gap-y-4 w-full text-center my-16">
              {messagesArray.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-xl ${
                    msg.isUser
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-black'
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
          ) : (
            ''
          )}

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

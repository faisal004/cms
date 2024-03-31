import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import Image from 'next/image';

function MarkdownRenderer({ content }: { content: string }) {
  React.useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(content, (err, file) => {
        if (err) {
          console.error('Error processing content:', err);
        } else {
          const element = document.getElementById('content');

          if (element) {
            element.innerHTML = file?.value as string;
          } else {
            console.log('No content');
          }
        }
      });
  }, [content]);

  return (
    <div className="chat chat-end flex flex-row-reverse ">
      <Image src="/harkirat.png" alt="HS" height={20} width={20} />

      <div className="chat-bubble bg-[#BDBDBD] text-black" id="content"></div>
    </div>
  );
}
export default MarkdownRenderer;

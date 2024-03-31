import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

function MarkdownRenderer({ content, id }: { content: string; id: string }) {
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
          const element = document.getElementById(id);

          if (element) {
            element.innerHTML = file?.value as string;
          } else {
            console.log('No content');
          }
        }
      });
  }, [content]);

  return (
    <div
      id={id}
      className="bg-slate-900 text-white py-4 px-4 rounded-2xl rounded-br-none overflow-auto"
    />
  );
}
export default MarkdownRenderer;

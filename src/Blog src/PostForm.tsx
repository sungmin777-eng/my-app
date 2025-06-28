// src/PostForm.tsx
import React, { useState, useContext } from 'react';
import { BlogContext } from './BlogContext';

type Props = {
  onDone: () => void;
};

export default function PostForm({ onDone }: Props) {
  const ctx = useContext(BlogContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!ctx) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      ctx.addPost(title, content);
      setTitle('');
      setContent('');
      onDone();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>새 글 작성</h2>
      <div>
        <input
          placeholder="제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          placeholder="내용"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <button type="submit">등록</button>
    </form>
  );
}

// src/PostList.tsx
import React, { useContext } from 'react';
import { BlogContext, Post } from './BlogContext';

type Props = {
  onSelect: (post: Post) => void;
};

export default function PostList({ onSelect }: Props) {
  const ctx = useContext(BlogContext);
  if (!ctx) return null;

  return (
    <div>
      <h2>블로그 글 목록</h2>
      <ul>
        {ctx.posts.map(post => (
          <li key={post.id}>
            <button onClick={() => onSelect(post)}>{post.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

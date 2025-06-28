// src/PostDetail.tsx
import React from 'react';
import { Post } from './BlogContext';

type Props = {
  post: Post;
  onBack: () => void;
};

export default function PostDetail({ post, onBack }: Props) {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <button onClick={onBack}>목록으로</button>
    </div>
  );
}

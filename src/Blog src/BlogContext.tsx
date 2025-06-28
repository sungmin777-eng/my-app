// src/BlogContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

export type Post = {
  id: number;
  title: string;
  content: string;

};

type BlogContextType = {
  posts: Post[];
  addPost: (title: string, content: string) => void;
};

export const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, title: '첫 번째 글', content: '블로그에 오신 것을 환영합니다!!!' }
  ]);

  const addPost = (title: string, content: string) => {
    setPosts(prev => [
      ...prev,
      { id: Date.now(), title, content }
    ]);
  };

  return (
    <BlogContext.Provider value={{ posts, addPost }}>
      {children}
    </BlogContext.Provider>
  );
}

// src/pages/CommentPage.tsx
import React, { useState } from 'react';

interface CommentItem {
  id: number;
  label: string;
  comment: string;
}

export default function CommentPage() {
  const [items, setItems] = useState<CommentItem[]>([
    { id: 1, label: '사업명', comment: '' },
    { id: 2, label: '대상국가', comment: '' },
    { id: 3, label: '총예산', comment: '' },
    { id: 4, label: '수혜자 수', comment: '' },
    { id: 5, label: '주관부처', comment: '' },
    { id: 6, label: '사업목표', comment: '' },
  ]);

  const handleChange = (id: number, newComment: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, comment: newComment } : item
    ));
  };

  const handleSave = () => {
    console.log('저장된 코멘트:', items);
    alert('코멘트가 저장되었습니다.');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💬 코멘트 입력</h2>
      {items.map(item => (
        <div key={item.id} style={{ marginBottom: 16 }}>
          <div><strong>{item.label}</strong></div>
          <textarea
            value={item.comment}
            onChange={(e) => handleChange(item.id, e.target.value)}
            placeholder={`${item.label}에 대한 의견을 작성하세요`}
            style={{ width: '100%', minHeight: 60 }}
          />
        </div>
      ))}
      <button onClick={handleSave}>💾 저장</button>
    </div>
  );
}

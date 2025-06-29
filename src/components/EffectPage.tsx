import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

interface EffectItem {
  id: string;
  text: string;
}

export const EffectPage: React.FC = () => {
  const [effects, setEffects] = useState<EffectItem[]>([]);
  const [newEffect, setNewEffect] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('effects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (item) => typeof item === 'object' && typeof item.text === 'string'
          );
          setEffects(valid);
        } else {
          console.warn('저장된 기대효과 형식이 잘못되었습니다.');
        }
      }
    } catch (e) {
      console.error('로컬스토리지 파싱 오류:', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('effects', JSON.stringify(effects));
  }, [effects]);

  const handleAdd = () => {
    if (!newEffect.trim()) return;
    const newItem: EffectItem = { id: uuidv4(), text: newEffect.trim() };
    setEffects((prev) => [...prev, newItem]);
    setNewEffect('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setEffects((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        const parsed: EffectItem[] = (result.data as any[])
          .filter(
            (row) =>
              Array.isArray(row) &&
              typeof row[0] === 'string' &&
              row[0].trim() !== ''
          )
          .map((row) => ({ id: uuidv4(), text: row[0].trim() }));
        setEffects(parsed);
      },
      error: (err) => alert('CSV 파싱 오류: ' + err.message),
    });
  };

  const downloadExampleCSV = () => {
    const csvContent = `지역 사회 참여 증가\n여성 고용률 향상\n환경 인식 개선`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'effect_example.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container>
      <h1>✨ 기대 효과</h1>
      <InputArea>
        <textarea
          placeholder="기대 효과 입력"
          value={newEffect}
          onChange={(e) => setNewEffect(e.target.value)}
        />
        <button onClick={handleAdd}>➕ 추가</button>
      </InputArea>

      <UploadInput type="file" accept=".csv" onChange={handleCSVUpload} />
      <button onClick={downloadExampleCSV}>📥 예시 CSV 다운로드</button>

      <List>
        {effects.map((item) =>
          typeof item.text === 'string' ? (
            <ListItem key={item.id}>
              <span>{item.text}</span>
              <button onClick={() => handleDelete(item.id)}>삭제</button>
            </ListItem>
          ) : null
        )}
      </List>
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
  max-width: 800px;
  margin: auto;
  font-family: 'Arial', sans-serif;
`;

const InputArea = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  textarea {
    flex: 1;
    height: 80px;
    padding: 10px;
    font-size: 14px;
    resize: vertical;
  }

  button {
    padding: 10px 20px;
    background: #2ecc71;
    border: none;
    color: white;
    cursor: pointer;
  }
`;

const UploadInput = styled.input`
  margin-bottom: 10px;
  display: block;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  background: #f7f7f7;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;

  span {
    flex: 1;
  }

  button {
    background: #e74c3c;
    border: none;
    color: white;
    padding: 6px 12px;
    cursor: pointer;
  }
`;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const SummaryPage: React.FC = () => {
  const [summary, setSummary] = useState({
    background: '',
    objective: '',
    strategy: '',
    expectedEffect: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('summary');
    if (saved) setSummary(JSON.parse(saved));
  }, []);

  const handleChange = (field: string, value: string) => {
    const updated = { ...summary, [field]: value };
    setSummary(updated);
  };

  const handleSave = () => {
    localStorage.setItem('summary', JSON.stringify(summary));
    alert('요약 내용이 저장되었습니다.');
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('summary');
    if (saved) {
      setSummary(JSON.parse(saved));
      alert('저장된 요약 내용을 불러왔습니다.');
    } else {
      alert('저장된 요약 내용이 없습니다.');
    }
  };

  const handleClear = () => {
    if (window.confirm('정말 요약 내용을 모두 삭제하시겠습니까?')) {
      localStorage.removeItem('summary');
      setSummary({
        background: '',
        objective: '',
        strategy: '',
        expectedEffect: ''
      });
    }
  };

  return (
    <Container>
      <h1>📝 요약 입력</h1>

      <Field>
        <label>1. 사업 배경</label>
        <textarea
          value={summary.background}
          onChange={(e) => handleChange('background', e.target.value)}
        />
      </Field>

      <Field>
        <label>2. 사업 목적</label>
        <textarea
          value={summary.objective}
          onChange={(e) => handleChange('objective', e.target.value)}
        />
      </Field>

      <Field>
        <label>3. 추진 전략</label>
        <textarea
          value={summary.strategy}
          onChange={(e) => handleChange('strategy', e.target.value)}
        />
      </Field>

      <Field>
        <label>4. 기대 효과</label>
        <textarea
          value={summary.expectedEffect}
          onChange={(e) => handleChange('expectedEffect', e.target.value)}
        />
      </Field>

      <ButtonGroup>
        <Button onClick={handleSave}>💾 저장</Button>
        <Button onClick={handleLoad}>📥 불러오기</Button>
        <ClearButton onClick={handleClear}>❌ 전체 삭제</ClearButton>
      </ButtonGroup>
    </Container>
  );
};

export default SummaryPage;

const Container = styled.div`
  padding: 30px;
  max-width: 800px;
  margin: auto;
`;

const Field = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 6px;
  }

  textarea {
    width: 100%;
    height: 80px;
    resize: vertical;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #fdfdfd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const ClearButton = styled(Button)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
  }
`;

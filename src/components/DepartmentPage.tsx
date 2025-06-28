import React, { useState } from 'react';
import styled from 'styled-components';

type DepartmentItem = {
  id: string;
  name: string;
  role: '주관' | '협력';
};

// 고정된 부처명 목록 (검색형 선택 지원)
const DEPARTMENT_LIST = [
  '기획재정부', '외교부', '산업통상자원부', '보건복지부', '환경부',
  '고용노동부', '농림축산식품부', '교육부', '과학기술정보통신부', '국토교통부',
  '해양수산부', '문화체육관광부', '여성가족부', '중소벤처기업부', '행정안전부'
];

export const DepartmentPage: React.FC = () => {
  const [items, setItems] = useState<DepartmentItem[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<'주관' | '협력'>('주관');

  const handleAdd = () => {
    const name = nameInput.trim();
    if (!name) {
      alert('부처명을 입력해주세요.');
      return;
    }

    if (!DEPARTMENT_LIST.includes(name)) {
      if (!window.confirm(`"${name}"는 목록에 없는 부처입니다. 계속 추가할까요?`)) {
        return;
      }
    }

    if (items.some(item => item.name === name && item.role === roleInput)) {
      alert('이미 같은 역할로 등록된 부처입니다.');
      return;
    }

    const newItem: DepartmentItem = {
      id: Date.now().toString(),
      name,
      role: roleInput,
    };

    setItems(prev => [...prev, newItem]);
    setNameInput('');
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const saveData = () => {
    try {
      localStorage.setItem('department-data', JSON.stringify(items));
      alert('저장되었습니다.');
    } catch {
      alert('저장 실패: 브라우저 저장 공간 초과');
    }
  };

  const loadData = () => {
    try {
      const saved = localStorage.getItem('department-data');
      if (!saved) {
        alert('저장된 데이터가 없습니다.');
        return;
      }

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error();

      const valid = parsed.filter((item: any) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          (item.role === '주관' || item.role === '협력')
      );

      setItems(valid);
      alert('불러오기 완료');
    } catch {
      alert('불러오기 실패: 저장 형식이 잘못되었습니다.');
    }
  };

  return (
      <Wrapper>
        <h2>주관/협력 부처</h2>
        <InputRow>
          <input
              type="text"
              list="department-options"
              placeholder="부처명 선택 또는 직접 입력"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
          />
          <datalist id="department-options">
            {DEPARTMENT_LIST.map((dep, idx) => (
                <option key={idx} value={dep} />
            ))}
          </datalist>

          <select
              value={roleInput}
              onChange={e =>
                  setRoleInput(e.target.value === '협력' ? '협력' : '주관')
              }
          >
            <option value="주관">주관</option>
            <option value="협력">협력</option>
          </select>

          <button onClick={handleAdd}>추가</button>
          <button onClick={saveData}>저장</button>
          <button onClick={loadData}>불러오기</button>
        </InputRow>

        <Table>
          <thead>
          <tr>
            <th>부처명</th>
            <th>역할</th>
            <th>삭제</th>
          </tr>
          </thead>
          <tbody>
          {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.role}</td>
                <td>
                  <button onClick={() => handleDelete(item.id)}>삭제</button>
                </td>
              </tr>
          ))}
          </tbody>
        </Table>
      </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;

  input, select {
    padding: 6px;
    font-size: 14px;
  }

  button {
    padding: 6px 12px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
  }
`;

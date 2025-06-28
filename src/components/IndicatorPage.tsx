import React, { useState } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';

type IndicatorItem = {
  id: string;
  description: string;
  amount: number;
  type: '정량' | '정성';
};

export const IndicatorPage: React.FC = () => {
  const [items, setItems] = useState<IndicatorItem[]>([]);

  const handleAddItem = () => {
    const newItem: IndicatorItem = {
      id: Date.now().toString(),
      description: '지표 설명',
      amount: 0,
      type: '정량',
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleChange = (
      id: string,
      field: keyof IndicatorItem,
      value: string
  ) => {
    setItems(prev =>
        prev.map(item =>
            item.id === id
                ? {
                  ...item,
                  [field]:
                      field === 'amount'
                          ? Number.isFinite(Number(value)) ? parseFloat(value || '0') : 0
                          : field === 'type'
                              ? (value === '정량' || value === '정성' ? value : '정량')
                              : value || '',
                }
                : item
        )
    );
  };

  const saveData = () => {
    try {
      localStorage.setItem('indicator-data', JSON.stringify(items));
      alert('저장되었습니다.');
    } catch {
      alert('저장 실패: 저장 공간 초과 혹은 기타 오류');
    }
  };

  const loadData = () => {
    try {
      const saved = localStorage.getItem('indicator-data');
      if (!saved) {
        alert('저장된 데이터가 없습니다.');
        return;
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error('배열 아님');

      const valid = parsed.filter((item: any) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.description === 'string' &&
          Number.isFinite(item.amount) &&
          (item.type === '정량' || item.type === '정성')
      );

      setItems(valid);
      alert('불러오기 완료');
    } catch {
      alert('불러오기 실패: 형식 오류 또는 저장 데이터 손상');
    }
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<any>) => {
        const parsed = result.data;

        const isValid = parsed.every(row =>
            row &&
            typeof row.description === 'string' &&
            !isNaN(parseFloat(row.amount)) &&
            (row.type === '정량' || row.type === '정성')
        );

        if (!isValid) {
          alert('CSV 형식 오류: 필수 항목 누락 또는 타입 불일치');
          return;
        }

        const converted = parsed.map((row, idx) => ({
          id: Date.now().toString() + '-' + idx,
          description: row.description || '지표 설명',
          amount: parseFloat(row.amount) || 0,
          type: row.type === '정량' || row.type === '정성' ? row.type : '정량',
        }));

        setItems(converted);
        alert('CSV 업로드 완료');
      },
      error: () => {
        alert('CSV 읽기 실패');
      }
    });
  };

  const total = items.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0), 0);

  return (
      <Wrapper>
        <h2>성과 지표</h2>
        <ButtonRow>
          <button onClick={handleAddItem}>지표 추가</button>
          <button onClick={saveData}>저장</button>
          <button onClick={loadData}>불러오기</button>
          <label>
            <UploadInput type="file" accept=".csv" onChange={handleCSVUpload} />
            📁 CSV 업로드
          </label>
        </ButtonRow>
        <Table>
          <thead>
          <tr>
            <th>지표 설명</th>
            <th>수치</th>
            <th>유형</th>
            <th>삭제</th>
          </tr>
          </thead>
          <tbody>
          {items.map(item => (
              <tr key={item.id}>
                <td>
                  <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                          handleChange(item.id, 'description', e.target.value)
                      }
                  />
                </td>
                <td>
                  <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                          handleChange(item.id, 'amount', e.target.value)
                      }
                  />
                </td>
                <td>
                  <select
                      value={item.type}
                      onChange={(e) =>
                          handleChange(item.id, 'type', e.target.value)
                      }
                  >
                    <option value="정량">정량</option>
                    <option value="정성">정성</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDeleteItem(item.id)}>삭제</button>
                </td>
              </tr>
          ))}
          </tbody>
        </Table>
        <TotalRow>총 수치 합계: {total.toLocaleString()}</TotalRow>
      </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 10px;
  border-collapse: collapse;

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
  }

  input, select {
    width: 100%;
  }
`;

const ButtonRow = styled.div`
  margin-bottom: 10px;
  button {
    margin-right: 8px;
  }
`;

const TotalRow = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const UploadInput = styled.input`
  display: none;
`;

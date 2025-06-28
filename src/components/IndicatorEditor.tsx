import React, { useState } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';

type QuantIndicator = {
  id: string;
  name: string;
  unit: string;
  baseline: number;
  target: number;
};

export const IndicatorEditor: React.FC = () => {
  const [mode, setMode] = useState<'quant' | 'qual'>('quant');
  const [quantIndicators, setQuantIndicators] = useState<QuantIndicator[]>([]);
  const [qualitativeText, setQualitativeText] = useState('');

  const handleAddQuant = () => {
    const newItem: QuantIndicator = {
      id: Date.now().toString(),
      name: '',
      unit: '',
      baseline: 0,
      target: 0,
    };
    setQuantIndicators(prev => [...prev, newItem]);
  };

  const handleDeleteQuant = (id: string) => {
    setQuantIndicators(prev => prev.filter(item => item.id !== id));
  };

  const handleChangeQuant = (
    id: string,
    field: keyof QuantIndicator,
    value: string
  ) => {
    setQuantIndicators(prev =>
      prev.map(item =>
        item.id === id
          ? {
            ...item,
            [field]:
              field === 'baseline' || field === 'target'
                ? parseFloat(value || '0')
                : value,
          }
          : item
      )
    );
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: Papa.ParseResult<any>) => {
        const rows = result.data;

        const isValid = rows.every(row =>
          row.name &&
          row.unit &&
          !isNaN(parseFloat(row.baseline)) &&
          !isNaN(parseFloat(row.target))
        );

        if (!isValid) {
          alert('CSV 형식이 잘못되었습니다. 모든 열을 채워주세요.');
          return;
        }

        const parsed: QuantIndicator[] = rows.map((row, idx) => ({
          id: Date.now().toString() + '-' + idx,
          name: row.name,
          unit: row.unit,
          baseline: parseFloat(row.baseline),
          target: parseFloat(row.target),
        }));

        setQuantIndicators(parsed);
        alert('CSV 업로드 완료');
      },
    });
  };

  const saveData = () => {
    const payload = {
      mode,
      quantIndicators,
      qualitativeText,
    };
    localStorage.setItem('indicator-data', JSON.stringify(payload));
    alert('저장되었습니다.');
  };

  const loadData = () => {
    const saved = localStorage.getItem('indicator-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mode) setMode(parsed.mode);
        if (Array.isArray(parsed.quantIndicators)) setQuantIndicators(parsed.quantIndicators);
        if (typeof parsed.qualitativeText === 'string') setQualitativeText(parsed.qualitativeText);
        alert('불러오기 완료');
      } catch {
        alert('불러오기 실패');
      }
    }
  };

  return (
    <Wrapper>
      <h2>성과지표 입력</h2>
      <ButtonRow>
        <button onClick={() => setMode('quant')}>정량 지표</button>
        <button onClick={() => setMode('qual')}>정성 지표</button>
        <button onClick={saveData}>저장</button>
        <button onClick={loadData}>불러오기</button>
        {mode === 'quant' && (
          <label>
            <UploadInput type="file" accept=".csv" onChange={handleCSVUpload} />
            📁 CSV 업로드
          </label>
        )}
      </ButtonRow>

      {mode === 'quant' ? (
        <>
          <button onClick={handleAddQuant}>지표 추가</button>
          <Table>
            <thead>
            <tr>
              <th>지표명</th>
              <th>단위</th>
              <th>기준값</th>
              <th>목표값</th>
              <th>삭제</th>
            </tr>
            </thead>
            <tbody>
            {quantIndicators.map(item => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleChangeQuant(item.id, 'name', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) =>
                      handleChangeQuant(item.id, 'unit', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.baseline}
                    onChange={(e) =>
                      handleChangeQuant(item.id, 'baseline', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.target}
                    onChange={(e) =>
                      handleChangeQuant(item.id, 'target', e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleDeleteQuant(item.id)}>삭제</button>
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        </>
      ) : (
        <Textarea
          placeholder="정성 지표를 입력하세요 (예: 사업의 기대효과, 사회적 영향 등)"
          value={qualitativeText}
          onChange={(e) => setQualitativeText(e.target.value)}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
`;

const ButtonRow = styled.div`
  margin-bottom: 10px;
  button {
    margin-right: 8px;
  }
`;

const UploadInput = styled.input`
  display: none;
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

  input {
    width: 100%;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 10px;
  resize: vertical;
`;


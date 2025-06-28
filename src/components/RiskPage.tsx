import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';

interface RiskItem {
  id: string;
  factor: string;
  impact: number;
  likelihood: number;
}

export const RiskPage: React.FC = () => {
  const [risks, setRisks] = useState<RiskItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('risks');
    if (stored) setRisks(JSON.parse(stored));
  }, []);

  const handleChange = (id: string, field: keyof RiskItem, value: string | number) => {
    const updated = risks.map(risk =>
        risk.id === id ? { ...risk, [field]: field === 'factor' ? value : Number(value) } : risk
    );
    setRisks(updated);
    localStorage.setItem('risks', JSON.stringify(updated));
  };

  const addRisk = () => {
    const newRisk: RiskItem = {
      id: uuidv4(),
      factor: '',
      impact: 1,
      likelihood: 1
    };
    const updated = [...risks, newRisk];
    setRisks(updated);
    localStorage.setItem('risks', JSON.stringify(updated));
  };

  const deleteRisk = (id: string) => {
    const updated = risks.filter(r => r.id !== id);
    setRisks(updated);
    localStorage.setItem('risks', JSON.stringify(updated));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const parsed = result.data as any[];
        const isValid = parsed.every(
            item => item.factor && item.impact && item.likelihood && !isNaN(Number(item.impact)) && !isNaN(Number(item.likelihood))
        );

        if (!isValid) {
          alert('CSV 형식이 올바르지 않습니다. factor, impact, likelihood 세 항목이 필요합니다.');
          return;
        }

        const imported: RiskItem[] = parsed.map(item => ({
          id: uuidv4(),
          factor: item.factor,
          impact: Number(item.impact),
          likelihood: Number(item.likelihood)
        }));

        const combined = [...risks, ...imported];
        setRisks(combined);
        localStorage.setItem('risks', JSON.stringify(combined));
      }
    });
  };

  return (
      <Container>
        <h1>⚠️ 리스크 분석</h1>
        <button onClick={addRisk}>➕ 리스크 항목 추가</button>
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        <Table>
          <thead>
          <tr>
            <th>위험 요인</th>
            <th>영향도 (1~5)</th>
            <th>가능성 (1~5)</th>
            <th>위험도</th>
            <th>삭제</th>
          </tr>
          </thead>
          <tbody>
          {risks.map(risk => (
              <tr key={risk.id}>
                <td>
                  <input
                      value={risk.factor}
                      onChange={e => handleChange(risk.id, 'factor', e.target.value)}
                  />
                </td>
                <td>
                  <input
                      type="number"
                      min={1}
                      max={5}
                      value={risk.impact}
                      onChange={e => handleChange(risk.id, 'impact', e.target.value)}
                  />
                </td>
                <td>
                  <input
                      type="number"
                      min={1}
                      max={5}
                      value={risk.likelihood}
                      onChange={e => handleChange(risk.id, 'likelihood', e.target.value)}
                  />
                </td>
                <td>{risk.impact * risk.likelihood}</td>
                <td>
                  <button onClick={() => deleteRisk(risk.id)}>❌</button>
                </td>
              </tr>
          ))}
          </tbody>
        </Table>
      </Container>
  );
};

const Container = styled.div`
  padding: 30px;
  max-width: 1000px;
  margin: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
  }

  input {
    width: 100%;
    padding: 4px;
  }

  th {
    background: #f8f8f8;
  }
`;

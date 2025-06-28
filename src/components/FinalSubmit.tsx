// src/components/FinalSubmit.tsx
import React from 'react';
import { useEffect, useState } from 'react';

export default function FinalSubmit() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const summary = JSON.parse(localStorage.getItem('summary') || '{}');
    const budget = JSON.parse(localStorage.getItem('budget') || '[]');
    const department = JSON.parse(localStorage.getItem('department') || '{}');
    const indicator = JSON.parse(localStorage.getItem('indicator') || '{}');
    const risk = JSON.parse(localStorage.getItem('risk') || '{}');
    const outcome = JSON.parse(localStorage.getItem('outcome') || '');

    setData({ summary, budget, department, indicator, risk, outcome });
  }, []);

  const handleSubmit = () => {
    alert('제출이 완료되었습니다! (※ 실제 저장은 서버 구축 필요)');
    console.log('최종 제출 데이터:', data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 최종 제출 미리보기</h2>

      <section>
        <h3>📝 요약정보</h3>
        <pre>{JSON.stringify(data.summary, null, 2)}</pre>
      </section>

      <section>
        <h3>💰 예산편성</h3>
        <pre>{JSON.stringify(data.budget, null, 2)}</pre>
      </section>

      <section>
        <h3>🏛️ 주관·협력부처</h3>
        <pre>{JSON.stringify(data.department, null, 2)}</pre>
      </section>

      <section>
        <h3>📈 성과지표</h3>
        <pre>{JSON.stringify(data.indicator, null, 2)}</pre>
      </section>

      <section>
        <h3>⚠️ 리스크분석</h3>
        <pre>{JSON.stringify(data.risk, null, 2)}</pre>
      </section>

      <section>
        <h3>🎯 기대효과</h3>
        <p>{data.outcome}</p>
      </section>

      <button onClick={handleSubmit} style={{ marginTop: 20, padding: '8px 16px' }}>
        📤 최종 제출
      </button>
    </div>
  );
}

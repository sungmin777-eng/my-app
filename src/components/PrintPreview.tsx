import React from 'react';
export default function PrintPreview() {
  return (
    <div>
      <h2>🖨️ 출력 탭 (미리보기)</h2>

      <div style={{ border: '1px solid #ccc', padding: 20, background: '#fff' }}>
        <h3>📌 요약 정보</h3>
        <p>※ 요약정보 탭에서 입력한 데이터</p>

        <h3>💰 예산 편성</h3>
        <p>※ 예산 탭에서 입력한 데이터</p>

        <h3>🏛️ 주관·협력 부처</h3>
        <p>※ 부처 탭에서 입력한 데이터</p>

        <h3>📈 성과지표</h3>
        <p>※ 성과지표 탭에서 입력한 데이터</p>

        <h3>⚠️ 리스크 분석</h3>
        <p>※ 리스크 분석 탭에서 입력한 데이터</p>

        <h3>🎯 기대효과</h3>
        <p>※ 기대효과 탭에서 입력한 데이터</p>

        <h3>🌳 문제해결트리</h3>
        <p>※ 트리에서 입력한 노드 목록</p>
      </div>

      <button
        onClick={() => window.print()}
        style={{ marginTop: 20, padding: '10px 20px' }}
      >
        🖨️ 인쇄하기
      </button>
    </div>
  );
}

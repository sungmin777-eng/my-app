import React, { useState } from 'react';

export default function SummaryInput() {
  const [projectName, setProjectName] = useState('');
  const [projectGoal, setProjectGoal] = useState('');
  const [projectContent, setProjectContent] = useState('');

  const handleSave = () => {
    const summaryData = { projectName, projectGoal, projectContent };
    localStorage.setItem('summary', JSON.stringify(summaryData));
    alert('요약 정보가 저장되었습니다.');
  };

  return (
    <div>
      <h2>📝 요약정보 입력</h2>
      <div>
        <label>📌 사업명:</label><br />
        <input value={projectName} onChange={e => setProjectName(e.target.value)} /><br />

        <label>🎯 사업 목적:</label><br />
        <textarea value={projectGoal} onChange={e => setProjectGoal(e.target.value)} /><br />

        <label>📰 주요 내용:</label><br />
        <textarea value={projectContent} onChange={e => setProjectContent(e.target.value)} /><br />

        <button onClick={handleSave}>저장</button>
      </div>
    </div>
  );
}

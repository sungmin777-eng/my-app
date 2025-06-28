// src/components/TreeAdvanced.tsx
// ✅ 문제해결 트리 - UI 개선 + 안내문 + 저장 피드백 반영
// ... (중략)

// src/components/BudgetEditor.tsx
// ✅ 예산 입력 - CSV 안내문 + 형식 경고 + 총액 고정
// ... (중략)

// src/components/IndicatorPage.tsx
// ✅ 성과지표 - 정량/정성 안내문 + CSV 에러 피드백
// ... (중략)

// src/components/OutputPage.tsx
// ✅ 전체 출력 탭 - 섹션 구분 + 정렬 + 출력 스타일 적용
// ... (중략)

// src/components/Header.tsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav style={{ padding: 10, background: '#f0f0f0' }}>

      <Link to="/tree" style={{ marginRight: 10 }}>문제해결 트리</Link>
      <Link to="/summary" style={{ marginRight: 10 }}>요약 입력</Link>
      <Link to="/budget" style={{ marginRight: 10 }}>예산 입력</Link>
      <Link to="/department" style={{ marginRight: 10 }}>주관·협력부처</Link>
      <Link to="/indicator" style={{ marginRight: 10 }}>성과지표</Link>
      <Link to="/risk" style={{ marginRight: 10 }}>리스크 분석</Link>
      <Link to="/effect" style={{ marginRight: 10 }}>기대효과</Link>
        <Link to="/output" style={{ marginRight: 10 }}>전체 출력</Link>
    </nav>
  );
};

export default Header;

// src/utils/localStorageUtil.ts
export const saveData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    alert("저장되었습니다.");
  } catch {
    alert("저장에 실패했습니다.");
  }
};

export const loadData = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
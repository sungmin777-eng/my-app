import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import {TreeAdvanced} from './components/TreeAdvanced';
import {BudgetEditor} from './components/BudgetEditor';
import {IndicatorPage} from './components/IndicatorPage';
import {OutputPage} from './components/OutputPage';
import SummaryPage from './components/SummaryPage';
import {DepartmentPage} from './components/DepartmentPage';
import {RiskPage} from './components/RiskPage';
import {EffectPage} from './components/EffectPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          <Route path="/tree" element={<TreeAdvanced />} />
          <Route path="/budget" element={<BudgetEditor />} />
          <Route path="/indicator" element={<IndicatorPage />} />
          <Route path="/output" element={<OutputPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/department" element={<DepartmentPage />} />
          <Route path="/risk" element={<RiskPage />} />
          <Route path="/effect" element={<EffectPage />} />
          {/* 기본 루트 접속 시 출력 탭으로 리디렉션 */}
          <Route path="*" element={<OutputPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

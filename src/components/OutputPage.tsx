import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface TreeNode {
    id: string;
    title: string;
    level: number;
    category?: string;
}

interface BudgetItem {
    id: string;
    category: string;
    name: string;
    unit: string;
    amount: number;
}

interface QuantIndicator {
    id: string;
    name: string;
    unit: string;
    baseline: number;
    target: number;
}

interface SummaryData {
    background: string;
    objective: string;
    strategy: string;
    expectedEffect: string;
}

interface Department {
    name: string;
    role: string;
}

export const OutputPage: React.FC = () => {
    const [tree, setTree] = useState<TreeNode[]>([]);
    const [budget, setBudget] = useState<BudgetItem[]>([]);
    const [indicators, setIndicators] = useState<QuantIndicator[]>([]);
    const [qualitativeText, setQualitativeText] = useState<string>('');
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [effects, setEffects] = useState<string[]>([]);

    useEffect(() => {
        try {
            const treeData = JSON.parse(localStorage.getItem('tree-data') || '[]');
            const budgetData = JSON.parse(localStorage.getItem('budget-data') || '[]');
            const indicatorData = JSON.parse(localStorage.getItem('indicator-data') || '{}');
            const summaryData = JSON.parse(localStorage.getItem('summary') || 'null');
            const departmentData = JSON.parse(localStorage.getItem('departments') || '[]');
            const effectData = JSON.parse(localStorage.getItem('effects') || '[]');

            if (Array.isArray(treeData)) setTree(treeData);
            if (Array.isArray(budgetData)) setBudget(budgetData);
            if (indicatorData && Array.isArray(indicatorData.quantIndicators)) {
                setIndicators(indicatorData.quantIndicators);
                setQualitativeText(indicatorData.qualitativeText || '');
            }
            if (summaryData) setSummary(summaryData);
            if (Array.isArray(departmentData)) setDepartments(departmentData);
            if (Array.isArray(effectData)) {
                const texts = effectData
                    .filter((item) => typeof item === 'string' || (item && typeof item.text === 'string'))
                    .map((item) => (typeof item === 'string' ? item : item.text));
                setEffects(texts);
            }
        } catch (e) {
            console.error('출력 탭 데이터 로딩 오류:', e);
        }
    }, []);

    const totalBudget = budget.reduce((sum, item) => sum + item.amount, 0);

    const handleDelete = <T extends any[]>(
        items: T,
        setItems: React.Dispatch<React.SetStateAction<T>>,
        storageKey: string,
        targetIndex: number
    ) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        const updated = [...items.slice(0, targetIndex), ...items.slice(targetIndex + 1)];
        setItems(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    return (
        <Wrapper>
            <h1>📄 출력 탭</h1>

            <Section>
                <h2>1. 문제해결 트리 요약</h2>
                <TreeContainer>
                    {tree.map((node, idx) => (
                        <TreeNodeBox
                            key={node.id}
                            style={{
                                marginLeft: `${node.level * 20}px`,
                                backgroundColor:
                                    node.category === '효과' ? '#d1e7dd' :
                                        node.category === '결과' ? '#cff4fc' :
                                            node.category === '산출물' ? '#f8d7da' :
                                                '#fff',
                            }}
                        >
                            <strong>{idx + 1}.</strong> {node.title}
                            {node.category && ` (${node.category})`}
                            <DeleteButton onClick={() => handleDelete(tree, setTree, 'tree-data', idx)}>🗑️</DeleteButton>
                        </TreeNodeBox>
                    ))}
                </TreeContainer>
            </Section>

            <Section>
                <h2>2. 예산 요약</h2>
                <Table>
                    <thead>
                    <tr>
                        <th>분류</th>
                        <th>항목명</th>
                        <th>단위</th>
                        <th>금액</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {budget.map((item, idx) => (
                        <tr key={item.id}>
                            <td>{item.category}</td>
                            <td>{item.name}</td>
                            <td>{item.unit}</td>
                            <td>{item.amount.toLocaleString()} 원</td>
                            <td>
                                <DeleteButton onClick={() => handleDelete(budget, setBudget, 'budget-data', idx)}>🗑️</DeleteButton>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <strong>총 예산: {totalBudget.toLocaleString()} 원</strong>
            </Section>

            <Section>
                <h2>3. 정량 성과지표</h2>
                <Table>
                    <thead>
                    <tr>
                        <th>지표명</th>
                        <th>단위</th>
                        <th>기준값</th>
                        <th>목표값</th>
                    </tr>
                    </thead>
                    <tbody>
                    {indicators.map((ind) => (
                        <tr key={ind.id}>
                            <td>{ind.name}</td>
                            <td>{ind.unit}</td>
                            <td>{ind.baseline}</td>
                            <td>{ind.target}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Section>

            <Section>
                <h2>4. 정성 성과지표</h2>
                <TextBox>{qualitativeText || '입력된 내용이 없습니다.'}</TextBox>
            </Section>

            <Section>
                <h2>5. 요약 내용</h2>
                {summary ? (
                    <TextBox>
                        <p><strong>배경:</strong> {summary.background}</p>
                        <p><strong>목적:</strong> {summary.objective}</p>
                        <p><strong>추진 전략:</strong> {summary.strategy}</p>
                        <p><strong>기대 효과:</strong> {summary.expectedEffect}</p>
                    </TextBox>
                ) : (
                    <TextBox>입력된 요약 정보가 없습니다.</TextBox>
                )}
            </Section>

            <Section>
                <h2>6. 주관·협력부처</h2>
                <ul>
                    {departments.map((dept, idx) => (
                        <li key={idx}>
                            {dept.name} ({dept.role})
                            <DeleteButton onClick={() => handleDelete(departments, setDepartments, 'departments', idx)}>🗑️</DeleteButton>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section>
                <h2>7. 기대 효과</h2>
                <ul>
                    {effects.length > 0
                        ? effects.map((text, idx) => <li key={idx}>{text}</li>)
                        : <li>입력된 내용이 없습니다.</li>}
                </ul>
            </Section>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    padding: 30px;
    font-family: 'Arial', sans-serif;
`;

const Section = styled.section`
    margin-bottom: 40px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 20px;

    h2 {
        margin-bottom: 12px;
        color: #2a2a2a;
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;

    th, td {
        border: 1px solid #999;
        padding: 8px;
        text-align: center;
    }

    th {
        background: #f2f2f2;
    }
`;

const TextBox = styled.div`
    white-space: pre-wrap;
    background: #f8f9fa;
    padding: 16px;
    border: 1px solid #ccc;
    min-height: 120px;
`;

const TreeContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TreeNodeBox = styled.div`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
`;

const DeleteButton = styled.button`
    margin-left: 8px;
    color: red;
    background: none;
    border: none;
    cursor: pointer;
`;

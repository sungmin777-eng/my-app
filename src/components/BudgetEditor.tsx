import React, { useState } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';

type BudgetItem = {
    id: string;
    category: string;
    name: string;
    unit: string;
    amount: number;
};

export const BudgetEditor: React.FC = () => {
    const [items, setItems] = useState<BudgetItem[]>([]);

    const handleAddItem = () => {
        const newItem: BudgetItem = {
            id: Date.now().toString(),
            category: '인건비',
            name: '항목명',
            unit: '원',
            amount: 0,
        };
        setItems(prev => [...prev, newItem]);
    };

    const handleDeleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleChange = (
        id: string,
        field: keyof BudgetItem,
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
                                : value || '',
                    }
                    : item
            )
        );
    };

    const total = items.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0), 0);

    const saveData = () => {
        try {
            localStorage.setItem('budget-data', JSON.stringify(items));
            alert('저장되었습니다.');
        } catch {
            alert('저장 실패: 브라우저 저장 공간 초과');
        }
    };

    const loadData = () => {
        try {
            const saved = localStorage.getItem('budget-data');
            if (!saved) {
                alert('저장된 데이터가 없습니다.');
                return;
            }
            const parsed = JSON.parse(saved);
            if (!Array.isArray(parsed)) {
                throw new Error('형식 오류');
            }
            const validItems = parsed.filter((item: any) =>
                item &&
                typeof item.id === 'string' &&
                typeof item.category === 'string' &&
                typeof item.name === 'string' &&
                typeof item.unit === 'string' &&
                Number.isFinite(item.amount)
            );
            setItems(validItems);
            alert('불러오기 완료');
        } catch {
            alert('불러오기 실패: 형식 오류 또는 저장 내용이 잘못되었습니다.');
        }
    };

    const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result: Papa.ParseResult<any>) => {
                const parsedItems = result.data;

                const isValid = parsedItems.every(row =>
                    row &&
                    typeof row.category === 'string' &&
                    typeof row.name === 'string' &&
                    typeof row.unit === 'string' &&
                    !isNaN(parseFloat(row.amount))
                );

                if (!isValid) {
                    alert('CSV 파일 형식이 올바르지 않습니다.\n헤더 누락 또는 금액 오류 가능성 있음.');
                    return;
                }

                const converted = parsedItems.map((row, index) => ({
                    id: Date.now().toString() + '-' + index,
                    category: row.category || '기타',
                    name: row.name || '항목명',
                    unit: row.unit || '원',
                    amount: parseFloat(row.amount) || 0,
                }));

                setItems(converted);
                alert('CSV 업로드 완료');
            },
            error: () => {
                alert('CSV 파일 읽기 중 오류가 발생했습니다.');
            },
        });
    };

    return (
        <Wrapper>
            <h2>예산 편성</h2>
            <ButtonRow>
                <button onClick={handleAddItem}>항목 추가</button>
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
                    <th>분류</th>
                    <th>항목명</th>
                    <th>단위</th>
                    <th>금액</th>
                    <th>삭제</th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>
                            <select
                                value={item.category}
                                onChange={(e) =>
                                    handleChange(item.id, 'category', e.target.value)
                                }
                            >
                                <option value="인건비">인건비</option>
                                <option value="운영비">운영비</option>
                                <option value="기타">기타</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" value={item.name} readOnly />
                        </td>
                        <td>
                            <input
                                type="text"
                                value={item.unit}
                                onChange={(e) =>
                                    handleChange(item.id, 'unit', e.target.value)
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
                            <button onClick={() => handleDeleteItem(item.id)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <TotalRow>총 합계: {total.toLocaleString()} 원</TotalRow>
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

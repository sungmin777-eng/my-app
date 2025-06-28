import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type TreeNode = {
  id: string;
  title: string;
  comment?: string;
  level: number;
  category?: '효과' | '결과' | '산출물';
};

const getNodeNumber = (index: number, level: number) => {
  return level === 0 ? `${index + 1}` : `${index + 1}.${level}`;
};

const categoryColor = {
  효과: '#d1e7dd',
  결과: '#cff4fc',
  산출물: '#f8d7da',
};

export const TreeAdvanced: React.FC = () => {
  const [tree, setTree] = useState<TreeNode[]>([
    {
      id: Date.now().toString(),
      title: '초기 항목',
      level: 0,
    },
  ]);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const handleAddNode = () => {
    const newNode: TreeNode = {
      id: Date.now().toString(),
      title: '새 항목',
      level: 0,
    };
    setTree(prev => [...prev, newNode]);
  };

  const handleDeleteNode = (id: string) => {
    setTree(prev => prev.filter(node => node.id !== id));
  };

  const handleUpdateComment = (id: string, comment: string) => {
    setTree(prev =>
        prev.map(node => (node.id === id ? { ...node, comment } : node))
    );
  };

  const handleTitleClick = (id: string, currentTitle: string) => {
    setEditingTitleId(id);
    setTitleInput(currentTitle);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value);
  };

  const handleTitleSave = (id: string) => {
    setTree(prev =>
        prev.map(node =>
            node.id === id ? { ...node, title: titleInput } : node
        )
    );
    setEditingTitleId(null);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(tree);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setTree(reordered);
  };

  const saveTree = () => {
    try {
      localStorage.setItem('tree-data', JSON.stringify(tree));
      alert('저장되었습니다.');
    } catch (e) {
      alert('저장 실패: ' + (e as Error).message);
    }
  };

  const loadTree = () => {
    try {
      const saved = localStorage.getItem('tree-data');
      if (!saved) {
        alert('저장된 트리 데이터가 없습니다.');
        return;
      }

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        alert('저장된 데이터 형식이 올바르지 않습니다.');
        return;
      }

      setTree(parsed);
      alert('불러오기 완료!');
    } catch (e) {
      alert('불러오기 중 오류 발생: ' + (e as Error).message);
    }
  };

  return (
      <Wrapper>
        <h2>문제해결 트리 고도화</h2>
        <ButtonRow>
          <button onClick={handleAddNode}>항목 추가</button>
          <button onClick={saveTree}>저장</button>
          <button onClick={loadTree}>불러오기</button>
        </ButtonRow>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tree">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {tree.map((node, index) => (
                      <Draggable key={node.id} draggableId={node.id} index={index}>
                        {(provided) => (
                            <NodeBox
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  backgroundColor:
                                      categoryColor[node.category || ''] || '#fff',
                                }}
                            >
                              <strong>{getNodeNumber(index, node.level)}. </strong>
                              {editingTitleId === node.id ? (
                                  <input
                                      autoFocus
                                      value={titleInput}
                                      onChange={handleTitleChange}
                                      onBlur={() => handleTitleSave(node.id)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleTitleSave(node.id);
                                      }}
                                  />
                              ) : (
                                  <span
                                      onClick={() => handleTitleClick(node.id, node.title)}
                                      style={{ cursor: 'pointer' }}
                                  >
                          {node.title}
                        </span>
                              )}
                              <button onClick={() => handleDeleteNode(node.id)}>삭제</button>
                              <div>
                                {editingCommentId === node.id ? (
                                    <>
                            <textarea
                                value={node.comment || ''}
                                onChange={(e) =>
                                    handleUpdateComment(node.id, e.target.value)
                                }
                            />
                                      <button onClick={() => setEditingCommentId(null)}>
                                        저장
                                      </button>
                                    </>
                                ) : (
                                    <>
                                      <p>💬 {node.comment || '코멘트 없음'}</p>
                                      <button onClick={() => setEditingCommentId(node.id)}>
                                        코멘트 수정
                                      </button>
                                    </>
                                )}
                              </div>
                            </NodeBox>
                        )}
                      </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
            )}
          </Droppable>
        </DragDropContext>
      </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
`;

const NodeBox = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const ButtonRow = styled.div`
  margin-bottom: 10px;
  button {
    margin-right: 8px;
  }
`;


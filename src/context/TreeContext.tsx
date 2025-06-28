// src/context/TreeContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TreeNode {
  id: string;
  label: string;
  level: number;
  parentId?: string;
  order: string;
  type?: string;
  comment?: string;
}

interface TreeContextType {
  nodes: TreeNode[];
  setNodes: React.Dispatch<React.SetStateAction<TreeNode[]>>;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

export function TreeProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<TreeNode[]>([
    { id: '1', label: '문제 1', level: 0, order: '1', type: '문제' },
  ]);

  return (
    <TreeContext.Provider value={{ nodes, setNodes }}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTree(): TreeContextType {
  const context = useContext(TreeContext);
  if (!context) throw new Error('useTree must be used within a TreeProvider');
  return context;
}


// src/components/Layout.tsx
import { ReactNode } from 'react';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

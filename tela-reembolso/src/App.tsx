import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CadastroReembolso from './Components/CadastroReembolso';
import ListaReembolsos from './Components/ListaReembolsos';

const App: React.FC = () => {
  document.title = "Tela Reembolso";
  return (
    <Router>
      <Routes>
        <Route path="/cadastro" element={<CadastroReembolso />} />
        <Route path="/lista" element={<ListaReembolsos />} />
        <Route path="/" element={<Navigate to="/cadastro" />} />
      </Routes>
    </Router>
  );
};

export default App;

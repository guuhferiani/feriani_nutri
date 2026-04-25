import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Pacientes = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      fetchPacientes();
    }
  }, [user]);

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      // Buscamos pacientes e suas consultas para pegar a última data
      const { data, error } = await supabase
        .from('pacientes')
        .select(`
          id, 
          nome, 
          objetivo_texto,
          objetivos,
          consultas (
            data_consulta
          )
        `)
        .eq('nutricionista_id', user.id)
        .order('nome', { ascending: true });

      if (error) throw error;

      // Processamos os dados para obter a data da última consulta
      const processedPacientes = data.map(p => {
        const sortedConsultas = p.consultas.sort((a, b) => 
          new Date(b.data_consulta) - new Date(a.data_consulta)
        );
        const lastDate = sortedConsultas.length > 0 ? sortedConsultas[0].data_consulta : 'Nenhuma consulta';
        
        // Objetivo formatado (pega o primeiro da lista ou o texto livre)
        const primaryGoal = p.objetivos && p.objetivos.length > 0 ? p.objetivos[0] : (p.objetivo_texto || 'Não informado');

        return {
          ...p,
          lastConsulta: lastDate,
          primaryGoal: primaryGoal
        };
      });

      setPacientes(processedPacientes);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPacientes = pacientes.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <header className="content-header">
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '800' }}>Pacientes</h2>
            <p style={{ color: 'var(--text-muted)' }}>Gerencie seus pacientes cadastrados.</p>
          </div>
          <Link to="/pacientes/novo" className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Novo Paciente
          </Link>
        </header>

        <div className="search-bar" style={{ marginBottom: '2rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Buscar paciente por nome..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="empty-state">Carregando pacientes...</div>
        ) : (
          <div className="patients-grid">
            {filteredPacientes.length > 0 ? (
              filteredPacientes.map(patient => (
                <Link key={patient.id} to={`/pacientes/${patient.id}`} className="patient-card">
                  <div className="patient-info-main">
                    <div className="patient-avatar">
                      {patient.nome.charAt(0)}
                    </div>
                    <div className="patient-details">
                      <h4>{patient.nome}</h4>
                      <p>{patient.primaryGoal}</p>
                    </div>
                  </div>
                  <div className="patient-meta">
                    <span className="label">Última Consulta</span>
                    <span className="value">
                      {patient.lastConsulta !== 'Nenhuma consulta' 
                        ? new Date(patient.lastConsulta).toLocaleDateString('pt-BR')
                        : 'Sem consulta'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                {searchTerm ? 'Nenhum paciente encontrado para esta busca.' : 'Nenhum paciente cadastrado ainda.'}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Pacientes;

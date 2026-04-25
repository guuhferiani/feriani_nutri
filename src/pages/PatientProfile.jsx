import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pacientes')
        .select('nome')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPatient(data);
    } catch (err) {
      console.error('Erro ao buscar paciente:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h2>{loading ? 'Carregando...' : patient?.nome || 'Paciente'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Perfil do Paciente</p>
        </header>
        <div className="empty-state">
          {loading ? 'Carregando dados...' : 'Perfil do paciente em desenvolvimento. Aqui você verá os dados clínicos, evolução e plano alimentar.'}
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;

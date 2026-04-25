import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsThisWeek: 0,
    patientsWithoutReturn: []
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Total de pacientes ativos
      const { count: patientsCount, error: patientsError } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true })
        .eq('nutricionista_id', user.id);

      if (patientsError) throw patientsError;

      // 2. Consultas da semana
      const now = new Date();
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const lastDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      
      const startDate = firstDayOfWeek.toISOString().split('T')[0];
      const endDate = lastDayOfWeek.toISOString().split('T')[0];

      const { count: weeklyAppointments, error: appointmentsError } = await supabase
        .from('consultas')
        .select('id, paciente_id!inner(nutricionista_id)', { count: 'exact', head: true })
        .eq('paciente_id.nutricionista_id', user.id)
        .gte('data_consulta', startDate)
        .lte('data_consulta', endDate);

      if (appointmentsError) throw appointmentsError;

      // 3. Pacientes sem retorno (> 30 dias desde a última consulta e sem próximo retorno agendado)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];

      // Pegamos todos os pacientes
      const { data: patients, error: pError } = await supabase
        .from('pacientes')
        .select('id, nome')
        .eq('nutricionista_id', user.id);

      if (pError) throw pError;

      const patientsWithoutReturnList = [];

      for (const patient of patients) {
        // Pegamos a última consulta
        const { data: lastConsultas, error: cError } = await supabase
          .from('consultas')
          .select('data_consulta, proximo_retorno')
          .eq('paciente_id', patient.id)
          .order('data_consulta', { ascending: false })
          .limit(1);

        if (cError) throw cError;

        if (lastConsultas && lastConsultas.length > 0) {
          const last = lastConsultas[0];
          const lastDate = last.data_consulta;
          
          // Se a última foi há mais de 30 dias
          if (lastDate < thirtyDaysAgoStr) {
            // Verificamos se há algum retorno futuro agendado
            const { data: futureReturns, error: fError } = await supabase
              .from('consultas')
              .select('id')
              .eq('paciente_id', patient.id)
              .gt('data_consulta', todayStr)
              .limit(1);

            if (fError) throw fError;

            if (!futureReturns || futureReturns.length === 0) {
              // Também verificamos se o campo proximo_retorno da última consulta é no futuro
              if (!last.proximo_retorno || last.proximo_retorno <= todayStr) {
                patientsWithoutReturnList.push(patient);
              }
            }
          }
        }
      }

      setStats({
        totalPatients: patientsCount || 0,
        appointmentsThisWeek: weeklyAppointments || 0,
        patientsWithoutReturn: patientsWithoutReturnList
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="dashboard-layout">
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <header className="page-header">
          <h2>Bem-vinda de volta!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Aqui está o resumo dos seus atendimentos.</p>
        </header>

        {loading ? (
          <div className="empty-state">Carregando dados...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total de Pacientes</span>
                <div className="stat-value">{stats.totalPatients}</div>
              </div>
              
              <div className="stat-card">
                <span className="stat-label">Consultas da Semana</span>
                <div className="stat-value">{stats.appointmentsThisWeek}</div>
              </div>

              <div className="stat-card featured">
                <span className="stat-label">Taxa de Retenção</span>
                <div className="stat-value">
                  {stats.totalPatients > 0 
                    ? Math.round(((stats.totalPatients - stats.patientsWithoutReturn.length) / stats.totalPatients) * 100)
                    : 0}%
                </div>
              </div>
            </div>

            <div className="patients-list-card">
              <div className="card-header">
                <h3>Pacientes sem retorno</h3>
                <span style={{ 
                  background: '#fef2f2', 
                  color: '#ef4444', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {stats.patientsWithoutReturn.length} pendentes
                </span>
              </div>
              
              <div className="patients-list">
                {stats.patientsWithoutReturn.length > 0 ? (
                  stats.patientsWithoutReturn.map(patient => (
                    <Link 
                      key={patient.id} 
                      to={`/pacientes/${patient.id}`}
                      className="patient-item-link"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: '#ecfdf5', 
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700'
                        }}>
                          {patient.nome.charAt(0)}
                        </div>
                        <span>{patient.nome}</span>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </Link>
                  ))
                ) : (
                  <div className="empty-state">
                    Nenhum paciente sem retorno no momento
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

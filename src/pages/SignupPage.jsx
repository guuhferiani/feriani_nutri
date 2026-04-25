import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import AuthLayout from '../components/AuthLayout';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: authError } = await signUp({
      email: formData.email,
      password: formData.password
    });

    if (authError) {
      setError('Erro ao criar conta: ' + authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Save user profile in nutricionistas table
      const { error: profileError } = await supabase
        .from('nutricionistas')
        .insert([
          {
            id: authData.user.id,
            nome: formData.nome,
            email: formData.email
          }
        ]);

      if (profileError) {
        console.error('Erro ao salvar perfil:', profileError);
        // We don't block login if profile fails, but should probably notify
        setError('Conta criada, mas houve um erro ao salvar o perfil. Tente fazer login.');
        setLoading(false);
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <AuthLayout title="Crie sua conta">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome Completo</label>
          <input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Seu nome"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="seu@email.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
      <div className="auth-footer">
        Já possui uma conta? <Link to="/login">Faça login</Link>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;

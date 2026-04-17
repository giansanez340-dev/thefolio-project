import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function RegisterPage() {
  const [name, setName] = useState('');   // ✅ NEW
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await API.post('/auth/register', {
        name,       // ✅ NEW
        email,
        password
      });

      if (data?.token) {
        localStorage.setItem('token', data.token);
        navigate('/login');
      } else {
        setError('Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        {/* ✅ NEW NAME INPUT */}
        <input
          type="text"
          placeholder="Name"
          className="form-control mb-2"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <div className="text-danger mb-2">{error}</div>}

        <button type="submit" className="btn btn-success">
          Register
        </button>
      </form>
    </div>
  );
}
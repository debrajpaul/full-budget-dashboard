import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '@/graphql/mutations';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data?.login?.token;
      if (token) {
        localStorage.setItem('jwt', token);
        navigate('/');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md grid gap-4 w-80"
      >
        <h1 className="text-xl font-semibold text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
        />
        {error && (
          <div className="text-sm text-red-600">{error.message}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

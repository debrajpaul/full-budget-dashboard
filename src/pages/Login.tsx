import { FormEvent, useMemo, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!, $tenantId: TenantType!) {
    login(input: { email: $email, password: $password, tenantId: $tenantId }) {
      token
      user {
        name
        email
      }
    }
  }
`;

type TenantOption = 'PERSONAL' | 'CLIENT' | 'DEFAULT';

type FormValues = {
  email: string;
  password: string;
  tenantId: TenantOption;
};

const tenantOptions: { value: TenantOption; label: string }[] = [
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'CLIENT', label: 'Client' },
  { value: 'DEFAULT', label: 'Default' },
];

export default function Login() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    password: '',
    tenantId: 'PERSONAL',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (response) => {
      const token = response?.login?.token;
      if (token) {
        window.localStorage.setItem('jwt', token);
        navigate('/', { replace: true });
      } else {
        setFormError('Missing token in response. Please try again.');
      }
    },
  });

  const isSubmitDisabled = useMemo(() => {
    return loading || !formValues.email || !formValues.password;
  }, [formValues.email, formValues.password, loading]);

  const handleChange = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!formValues.email || !formValues.password) {
      setFormError('Email and password are required.');
      return;
    }

    login({
      variables: {
        email: formValues.email,
        password: formValues.password,
        tenantId: formValues.tenantId,
      },
    }).catch(() => {
      /* errors handled via Apollo error state */
    });
  };

  const apolloErrorMessage = error?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 py-12 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">Sign in</h1>
          <p className="text-sm text-zinc-500">Enter your credentials to access the dashboard.</p>
        </header>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formValues.email}
            onChange={handleChange('email')}
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formValues.password}
            onChange={handleChange('password')}
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="tenantId" className="block text-sm font-medium text-zinc-700">
            Workspace
          </label>
          <select
            id="tenantId"
            name="tenantId"
            value={formValues.tenantId}
            onChange={handleChange('tenantId')}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            {tenantOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {(formError || apolloErrorMessage) && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError || apolloErrorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

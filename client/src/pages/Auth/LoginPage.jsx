import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/ui/Button.jsx';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

const LoginPage = () => {
  const { login, loginLoading, loginError } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => login(data);

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="FocusFlow" className="w-12 h-12 rounded-xl object-cover mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-text-secondary mt-1">Sign in to FocusFlow</p>
        </div>

        <div className="card p-6">
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-error text-sm">
              {loginError.response?.data?.message || 'Login failed'}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
              <input
                type="email"
                {...register('email')}
                className="input"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
              <input
                type="password"
                {...register('password')}
                className="input"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
            </div>

            <Button type="submit" loading={loginLoading} className="w-full mt-2">
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center mt-4 text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-copper hover:text-copper-dark font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

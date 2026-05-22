import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/ui/Button.jsx';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const RegisterPage = () => {
  const { register: registerUser, registerLoading, registerError } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => registerUser(data);

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="FocusFlow" className="w-12 h-12 rounded-xl object-cover mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary">Create account</h1>
          <p className="text-text-secondary mt-1">Get started with FocusFlow</p>
        </div>

        <div className="card p-6">
          {registerError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-error text-sm">
              {registerError.response?.data?.message || 'Registration failed'}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
              <input
                type="text"
                {...register('name')}
                className="input"
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
            </div>

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
                placeholder="At least 6 characters"
              />
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
            </div>

            <Button type="submit" loading={registerLoading} className="w-full mt-2">
              Create account
            </Button>
          </form>
        </div>

        <p className="text-center mt-4 text-sm text-text-secondary">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-copper hover:text-copper-dark font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

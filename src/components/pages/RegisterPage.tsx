import React, { useState } from 'react';
import { Card } from '../Card';
import { Input } from '../Input';
import { Button } from '../Button';
import { useAuth } from '../../contexts/AuthContext';
import { PageType } from '../../types';
import { Leaf, UserPlus } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: PageType) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username, password);
      onNavigate('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg')] bg-cover bg-center opacity-10"></div>
      
      <Card className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
              <Leaf className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Join EcoTracker</h1>
          <p className="text-green-600">Start your sustainable journey today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="Enter your username"
            required
            error={error && error.includes('username') ? error : undefined}
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Create a strong password"
            required
            error={error && error.includes('password') ? error : undefined}
          />

          {error && !error.includes('username') && !error.includes('password') && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={!username || !password}
            loading={loading}
            size="md"
            className="w-full mb-4"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Register
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-green-600 hover:text-green-800 font-medium transition-colors duration-300"
          >
            Already have an account? Sign in
          </button>
        </div>
      </Card>
    </div>
  );
};
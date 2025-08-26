import React, { useState } from 'react';
import { Card } from '../Card';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import { factorsAPI } from '../../services/api';
import { PageType } from '../../types';
import { Plus, Car, Zap, ArrowLeft } from 'lucide-react';

interface FactorsCreatePageProps {
  onNavigate: (page: PageType) => void;
}

export const FactorsCreatePage: React.FC<FactorsCreatePageProps> = ({ onNavigate }) => {
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const categoryOptions = [
    { value: 'transport', label: 'Transport' },
    { value: 'energy', label: 'Energy' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await factorsAPI.create({
        category: category as 'transport' | 'energy',
        value: parseFloat(value),
      });
      
      setSuccess(`Activity created! CO2 emission: ${result.co2_emission} kg`);
      setCategory('');
      setValue('');
      
      setTimeout(() => {
        onNavigate('profile');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = () => {
    if (category === 'transport') return <Car className="w-6 h-6" />;
    if (category === 'energy') return <Zap className="w-6 h-6" />;
    return <Plus className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg')] bg-cover bg-center opacity-10"></div>
      
      <div className="max-w-md mx-auto pt-8 relative z-10">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('profile')}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-green-800">Add Activity</h1>
            <div></div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full text-white transition-all duration-300">
                {getCategoryIcon()}
              </div>
            </div>
            <p className="text-green-600">Track your environmental impact</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Select
              label="Category"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              required
            />
            
            <Input
              label="Value"
              type="number"
              value={value}
              onChange={setValue}
              placeholder="Enter amount (e.g., km, kWh)"
              required
            />

            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 rounded">
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={!category || !value}
              loading={loading}
              size="lg"
              className="w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Activity
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
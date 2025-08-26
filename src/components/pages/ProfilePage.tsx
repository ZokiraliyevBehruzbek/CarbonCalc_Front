import React, { useState, useEffect } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { useAuth } from '../../contexts/AuthContext';
import { factorsAPI } from '../../services/api';
import { Activity, PageType } from '../../types';
import { User, Plus, Car, Zap, Leaf, LogOut, BarChart3 } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: PageType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await factorsAPI.getMyActivity();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const totalEmissions = activities.reduce((sum, activity) => sum + activity.co2_emission, 0);

  const getCategoryIcon = (category: string) => {
    if (category === 'transport') return <Car className="w-5 h-5 text-blue-600" />;
    if (category === 'energy') return <Zap className="w-5 h-5 text-yellow-600" />;
    return <Leaf className="w-5 h-5 text-green-600" />;
  };

  const getCategoryColor = (category: string) => {
    if (category === 'transport') return 'bg-blue-50 border-blue-200';
    if (category === 'energy') return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1632790/pexels-photo-1632790.jpeg')] bg-cover bg-center opacity-10"></div>
      
      <div className="max-w-4xl mx-auto pt-8 relative z-10">
        {/* Header */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full mr-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">Welcome, {user?.username}</h1>
                {/* <p className="text-green-600"></p> */}
              </div>
            </div>
            <Button onClick={handleLogout} variant="secondary" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="text-center">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full inline-block mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Total Emissions</h3>
            <p className="text-3xl font-bold text-red-600">{totalEmissions.toFixed(2)} kg</p>
            <p className="text-green-600 text-sm">CO2 equivalent</p>
          </Card>

          <Card className="text-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full inline-block mb-4">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Transport</h3>
            <p className="text-3xl font-bold text-blue-600">
              {activities.filter(a => a.category === 'transport').length}
            </p>
            <p className="text-green-600 text-sm">Activities</p>
          </Card>

          <Card className="text-center">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full inline-block mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Energy</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {activities.filter(a => a.category === 'energy').length}
            </p>
            <p className="text-green-600 text-sm">Activities</p>
          </Card>
        </div>

        {/* Activities List */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-green-800">Your Activities</h2>
            <Button onClick={() => onNavigate('factors_create')} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-green-600">Loading activities...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <Leaf className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-green-600 mb-4">No activities yet</p>
              <Button onClick={() => onNavigate('factors_create')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Activity
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${getCategoryColor(activity.category)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getCategoryIcon(activity.category)}
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {activity.category}
                        </h3>
                        <p className="text-gray-600 text-sm">Activity #{index + 1}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">
                        {activity.co2_emission.toFixed(2)}
                      </p>
                      <p className="text-gray-600 text-sm">kg CO2</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
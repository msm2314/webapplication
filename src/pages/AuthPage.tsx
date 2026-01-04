import { useState } from 'react';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import { UtensilsCrossed } from 'lucide-react';

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="text-center mb-8 absolute top-8">
        <div className="flex items-center justify-center mb-2">
          <UtensilsCrossed className="w-12 h-12 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">RestaurantOS</h1>
        <p className="text-gray-600 mt-2">Delicious food, seamless ordering</p>
      </div>

      <div className="mt-32">
        {showLogin ? (
          <Login onToggle={() => setShowLogin(false)} />
        ) : (
          <Register onToggle={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
}

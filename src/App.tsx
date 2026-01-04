import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AuthPage from './pages/AuthPage';
import OwnerDashboard from './pages/OwnerDashboard';
import CustomerMenu from './pages/CustomerMenu';
import OrdersPage from './pages/OrdersPage';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showOrders, setShowOrders] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage />;
  }

  if (showOrders && profile.role === 'owner') {
    return <OrdersPage onBack={() => setShowOrders(false)} />;
  }

  if (profile.role === 'owner') {
    return <OwnerDashboard onViewOrders={() => setShowOrders(true)} />;
  }

  return (
    <CartProvider>
      <CustomerMenu />
    </CartProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './lib/AuthContext';
import { KisaProvider } from './contexts/KisaContext';
import { SiteLayout } from './components/layout/SiteLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { Home } from './pages/Home';
import { Stories } from './pages/Stories';
import { StoryDetail } from './pages/StoryDetail';
import { Reader } from './pages/Reader';
import { Search } from './pages/Search';
import { Trending } from './pages/Trending';
import { NewStories } from './pages/NewStories';
import { Categories } from './pages/Categories';
import { Category } from './pages/Category';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Saved } from './pages/Saved';
import { Landing } from './pages/Landing';
import { NotFound } from './pages/NotFound';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStories } from './pages/admin/AdminStories';
import { AdminCreateStory } from './pages/admin/AdminCreateStory';
import { AdminEditStory } from './pages/admin/AdminEditStory';
import { AdminEpisodes } from './pages/admin/AdminEpisodes';
import { AdminCreateEpisode } from './pages/admin/AdminCreateEpisode';
import { AdminEditEpisode } from './pages/admin/AdminEditEpisode';
import { AdminAuthors } from './pages/admin/AdminAuthors';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSubscriptions } from './pages/admin/AdminSubscriptions';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';
import { useAuth } from './lib/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Inapakia...</div>;
  if (!user) return <Navigate to="/ingia" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div>Inapakia...</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <AuthProvider>
      <KisaProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/hadithi" element={<Stories />} />
              <Route path="/hadithi/:slug" element={<StoryDetail />} />
              <Route path="/zinazopendwa" element={<Trending />} />
              <Route path="/mpya" element={<NewStories />} />
              <Route path="/makundi" element={<Categories />} />
              <Route path="/makundi/:name" element={<Category />} />
              <Route path="/tafuta" element={<Search />} />
              <Route path="/zilizohifadhiwa" element={
                <ProtectedRoute><Saved /></ProtectedRoute>
              } />
              <Route path="/akaunti" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/wasifu" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />
              <Route path="/premium" element={<Navigate to="/hadithi" replace />} />
              <Route path="/malipo" element={<Navigate to="/hadithi" replace />} />
              <Route path="/karibu" element={<Landing />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/ingia" element={<Login />} />
            <Route path="/jisajili" element={<Register />} />
            <Route path="/sahau-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Reader Route - No Layout */}
            <Route path="/soma/:slug/:episode" element={<Reader />} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute><AdminLayout /></AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="stories" element={<AdminStories />} />
              <Route path="stories/new" element={<AdminCreateStory />} />
              <Route path="stories/:id/edit" element={<AdminEditStory />} />
              <Route path="episodes" element={<AdminEpisodes />} />
              <Route path="episodes/new" element={<AdminCreateEpisode />} />
              <Route path="episodes/:id/edit" element={<AdminEditEpisode />} />
              <Route path="authors" element={<AdminAuthors />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="subscriptions" element={<AdminSubscriptions />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>

          <Toaster
            theme="light"
            position="top-center"
            toastOptions={{
              style: {
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                color: '#111827'
              }
            }}
          />
        </BrowserRouter>
      </KisaProvider>
    </AuthProvider>
  );
}
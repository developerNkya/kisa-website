import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
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
import { Subscribe } from './pages/Subscribe';
import { Payment } from './pages/Payment';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Saved } from './pages/Saved';
import { Landing } from './pages/Landing';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStories } from './pages/admin/AdminStories';
import { AdminCreateStory } from './pages/admin/AdminCreateStory';
import { AdminEpisodes } from './pages/admin/AdminEpisodes';
import { AdminCreateEpisode } from './pages/admin/AdminCreateEpisode';
import { AdminAuthors } from './pages/admin/AdminAuthors';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSubscriptions } from './pages/admin/AdminSubscriptions';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';

export function App() {
  return (
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
            <Route path="/zilizohifadhiwa" element={<Saved />} />
            <Route path="/akaunti" element={<Dashboard />} />
            <Route path="/wasifu" element={<Profile />} />
            <Route path="/premium" element={<Subscribe />} />
            <Route path="/malipo" element={<Payment />} />
            <Route path="/karibu" element={<Landing />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/soma/:slug/:episode" element={<Reader />} />
          <Route path="/ingia" element={<Login />} />
          <Route path="/jisajili" element={<Register />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="stories" element={<AdminStories />} />
            <Route path="stories/new" element={<AdminCreateStory />} />
            <Route path="episodes" element={<AdminEpisodes />} />
            <Route path="episodes/new" element={<AdminCreateEpisode />} />
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
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: '#20191B',
              border: '1px solid #332A2D',
              color: '#F6F0E8'
            }
          }} />
        
      </BrowserRouter>
    </KisaProvider>);

}
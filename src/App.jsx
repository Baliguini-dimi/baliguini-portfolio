import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProjectsList from './pages/admin/AdminProjectsList'
import AdminProjectForm from './pages/admin/AdminProjectForm'
import AdminPostsList from './pages/admin/AdminPostsList'
import AdminPostForm from './pages/admin/AdminPostForm'
import AdminSiteSettings from './pages/admin/AdminSiteSettings'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminNewsletter from './pages/admin/AdminNewsletter'
import AdminCategories from './pages/admin/AdminCategories'     // <-- import ajouté

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projets" element={<Projects />} />
        <Route path="projets/:slug" element={<ProjectDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/projets" element={<AdminProjectsList />} />
          <Route path="admin/projets/nouveau" element={<AdminProjectForm />} />
          <Route path="admin/projets/:id/modifier" element={<AdminProjectForm />} />
          <Route path="admin/articles" element={<AdminPostsList />} />
          <Route path="admin/articles/nouveau" element={<AdminPostForm />} />
          <Route path="admin/articles/:id/modifier" element={<AdminPostForm />} />
          <Route path="admin/categories" element={<AdminCategories />} />   {/* <-- route ajoutée */}
          <Route path="admin/reglages" element={<AdminSiteSettings />} />
          <Route path="admin/statistiques" element={<AdminAnalytics />} />
          <Route path="admin/newsletter" element={<AdminNewsletter />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
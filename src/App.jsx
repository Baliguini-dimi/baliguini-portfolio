import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
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

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projets" element={<Projects />} />
        <Route path="projets/:slug" element={<ProjectDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="admin/login" element={<AdminLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/projets" element={<AdminProjectsList />} />
          <Route path="admin/projets/nouveau" element={<AdminProjectForm />} />
          <Route path="admin/projets/:id/modifier" element={<AdminProjectForm />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
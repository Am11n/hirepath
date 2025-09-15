import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import { About } from './pages/About'
import { Features } from './pages/Features'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Blog } from './pages/Blog'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { Profile } from './pages/Profile'
import { Dashboard } from './pages/Dashboard'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/about', element: <About /> },
  { path: '/features', element: <Features /> },
  { path: '/blog', element: <Blog /> },
  { path: '/privacy', element: <PrivacyPolicy /> },
  { path: '/signin', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { 
    path: '/profile', 
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
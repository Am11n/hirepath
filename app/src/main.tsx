import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GlobalStyle } from './styles/global'
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
import { Applications } from './pages/Applications'
import { Tasks } from './pages/Tasks'
import { Documents } from './pages/Documents'
import { Insights } from './pages/Insights'
import { Calendar } from './pages/Calendar'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import { Search } from './pages/Search'
import { ThemeModeProvider } from './contexts/ThemeModeProvider'
import RoutePersistence from './components/RoutePersistence'
import { I18nProvider } from './contexts/I18nProvider'

// Protected routes that use AppLayout
const protectedRoutes = [
  {
    path: '/dashboard',
    element: (
      <AppLayout>
        <Dashboard />
      </AppLayout>
    )
  },
  {
    path: '/applications',
    element: (
      <AppLayout>
        <Applications />
      </AppLayout>
    )
  },
  {
    path: '/tasks',
    element: (
      <AppLayout>
        <Tasks />
      </AppLayout>
    )
  },
  {
    path: '/documents',
    element: (
      <AppLayout>
        <Documents />
      </AppLayout>
    )
  },
  {
    path: '/insights',
    element: (
      <AppLayout>
        <Insights />
      </AppLayout>
    )
  },
  {
    path: '/profile',
    element: (
      <AppLayout>
        <Profile />
      </AppLayout>
    )
  },
  {
    path: '/search',
    element: (
      <AppLayout>
        <Search />
      </AppLayout>
    )
  },
  {
    path: '/calendar',
    element: (
      <AppLayout>
        <Calendar />
      </AppLayout>
    )
  },
  // Add other protected routes here as they are created
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <RoutePersistence />,
    children: [
      { index: true, element: <App /> },
      { path: 'about', element: <About /> },
      { path: 'features', element: <Features /> },
      { path: 'blog', element: <Blog /> },
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'signin', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      // Protected routes
      ...protectedRoutes.map(route => ({
        path: route.path.replace(/^\//, ''),
        element: (
          <ProtectedRoute>
            {route.element}
          </ProtectedRoute>
        )
      }))
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <GlobalStyle />
      <I18nProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </I18nProvider>
    </ThemeModeProvider>
  </StrictMode>,
)
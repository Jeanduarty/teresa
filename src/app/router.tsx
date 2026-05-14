import type { PropsWithChildren } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'

import { useAuthSession } from '../hooks/use-auth'
import { PrivateLayout } from './(private)/_components/private-layout'
import { AccountSettingsPage } from './(private)/settings/page'
import { HomePage } from './(private)/page'
import { TopicDetailsPage } from './(private)/topics/[topicId]/page'
import { LoginPage } from './(public)/login/page'
import { SignupPage } from './(public)/signup/page'

function SessionSync() {
  useAuthSession()
  return null
}

function AuthOnly({ children }: PropsWithChildren) {
  const location = useLocation()
  const { user, isLoading } = useAuthSession()

  if (isLoading) {
    return null
  }

  if (user?.userName) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return children
}

function PrivateOnly({ children }: PropsWithChildren) {
  const location = useLocation()
  const { user, isLoading } = useAuthSession()

  if (isLoading) {
    return null
  }

  if (!user?.userName) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export function AppRouter() {
  return (
    <Router>
      <SessionSync />
      <Routes>
        <Route
          element={
            <PrivateOnly>
              <PrivateLayout />
            </PrivateOnly>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/groups" element={<HomePage />} />
          <Route path="/groups/:groupId" element={<HomePage />} />
          <Route path="/settings" element={<AccountSettingsPage />} />
          <Route path="/settings/:section" element={<AccountSettingsPage />} />
          <Route path="/topics/:topicId" element={<TopicDetailsPage />} />
        </Route>
        <Route
          path="/login"
          element={
            <AuthOnly>
              <LoginPage />
            </AuthOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthOnly>
              <SignupPage />
            </AuthOnly>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

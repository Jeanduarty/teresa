import type { PropsWithChildren } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'

import { useAuthSession } from '../hooks/use-auth'
import { PrivateLayout } from './(private)/_components/private-layout'
import { CreatorProfilePage } from './(private)/creator-profile/page'
import { ExploreAnalysisPage } from './(private)/explore/[exploreAnalysisId]/page'
import { ExploreContentDetailPage } from './(private)/explore/[exploreAnalysisId]/contents/[contentId]/page'
import { ExploreNewAnalysisPage } from './(private)/explore/new/page'
import { AccountSettingsPage } from './(private)/settings/page'
import { HomePage } from './(private)/page'
import { TopicDetailsPage } from './(private)/topics/[topicId]/page'
import { ForgotPasswordPage } from './(public)/forgot/page'
import { LoginPage } from './(public)/login/page'
import { SignupPage } from './(public)/signup/page'
import { LegalPage } from './(public)/news/legal/page'
import { NovidadeDetailPage } from './(public)/news/[slug]/page'
import { NovidadesListPage } from './(public)/news/page'

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
          <Route path="/explore" element={<HomePage />} />
          <Route path="/explore/new" element={<ExploreNewAnalysisPage />} />
          <Route
            path="/explore/:exploreAnalysisId"
            element={<ExploreAnalysisPage />}
          />
          <Route
            path="/explore/:exploreAnalysisId/contents/:contentId"
            element={<ExploreContentDetailPage />}
          />
          <Route path="/settings" element={<AccountSettingsPage />} />
          <Route path="/settings/:section" element={<AccountSettingsPage />} />
          <Route path="/topics/:topicId" element={<TopicDetailsPage />} />
          <Route path="/creator-profile" element={<CreatorProfilePage />} />
        </Route>
        <Route
          path="/forgot"
          element={
            <AuthOnly>
              <ForgotPasswordPage />
            </AuthOnly>
          }
        />
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
        <Route path="/news" element={<NovidadesListPage />} />
        <Route path="/news/:slug" element={<NovidadeDetailPage />} />
        <Route path="/novidades" element={<Navigate to="/news" replace />} />
        <Route path="/novidades/:slug" element={<Navigate to="/news" replace />} />
        <Route path="/public" element={<Navigate to="/news" replace />} />
        <Route path="/app-preview" element={<Navigate to="/news" replace />} />
        <Route path="/legal/:page" element={<LegalPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

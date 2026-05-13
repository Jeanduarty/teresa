export type SessionClientType = 'desktop' | 'web' | 'cli'

export interface StoredSession {
  userId: string
  sessionId: string | null
}

export interface AuthUser {
  id: string
  email: string
  realName: string
  userName: string
  isVerified: boolean
  createdAt: string
  pendingEmail: string | null
  deleteRequestedAt: string | null
}

export interface PublicProfile extends AuthUser {
  publicWorkspaces: string[]
}

export interface UserRecord extends AuthUser {
  password: string
}

export interface UserSessionRecord {
  id: string
  userId: string
  clientType: SessionClientType
  clientHost: string | null
  extensionHost: string | null
  createdAt: string
  lastUsedAt: string
}

export interface UserSession extends UserSessionRecord {
  isCurrent: boolean
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface UserSessionPage {
  sessions: UserSession[]
  pagination: PaginationMeta
}

export interface LoginInput {
  identifier: string
  password: string
}

export interface SignupInput {
  email: string
  password: string
  secretApp: string
  userName: string
}

export interface VerifySignupSecretInput {
  secretApp: string
}

export interface UpdateProfileInput {
  userId: string
  userName: string
  realName: string
}

export interface RequestEmailChangeInput {
  userId: string
  newEmail: string
}

export interface ChangePasswordInput {
  userId: string
  currentPassword: string
  newPassword: string
}

export interface RevokeSessionInput {
  userId: string
  sessionId: string
}

export interface RequestAccountDeletionInput {
  userId: string
  password: string
}

export interface MutationMessage {
  message: string
}

export interface RevokeSessionResult {
  sessionId: string
  shouldLogout: boolean
}

export type SocialProvider = 'twitter' | 'tiktok'

export interface SocialAccount {
  id: string
  userId: string
  provider: SocialProvider
  handle: string | null
  isConnected: boolean
  connectedAt: string | null
  permissions: string[]
}

export interface ContentReport {
  id: string
  userId: string
  title: string
  summary: string
  originalScript: string
  currentScript: string
  editedAt: string | null
  sourceProvider: SocialProvider
  signals: string[]
  savedPosts: SavedSocialPost[]
  generatedAt: string
  completedAt: string | null
}

export interface SavedSocialPost {
  id: string
  provider: SocialProvider
  title: string
  creatorHandle: string
  url: string
  savedAt: string
  likedAt: string | null
  durationSeconds: number
  views: number
  engagementReason: string
}

export interface ContentReportMetrics {
  total: number
  completed: number
  pending: number
  twitterSignals: number
  tiktokSignals: number
  completionRate: number
}

export interface SocialActivityPost {
  provider: SocialProvider
  externalId: string
  signalType: 'liked' | 'saved'
  text: string
  creatorHandle: string | null
  url: string
  createdAt: string | null
  collectedAt: string
  metrics: {
    likes: number
    replies: number
    reposts: number
    quotes: number
  }
}

export interface SocialDailyLikedPostsResult {
  provider: SocialProvider
  supported: boolean
  collectedAt: string
  message: string
  posts: SocialActivityPost[]
  request?: {
    requestId: string
    status: string
  }
}

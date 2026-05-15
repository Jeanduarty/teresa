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
  status: 'active' | 'inactive' | 'deleted'
  profileUrl: string | null
  secretKeyId: string | null
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

export interface DevelopmentAccess {
  canAccessDevelopment: boolean
  hasConnectedSocialAccount: boolean
  cooldownEndsAt: string | null
}

export interface DevelopmentSocialJobsResult {
  runId: string
  startedAt: string
  cooldownEndsAt: string
  skipped: boolean
  scheduledHour: number
  jobIds: string[]
  enqueuedJobs: number
  processedJobs: number
  generatedTopics: number
}

export interface DevelopmentSocialJobsStatus {
  runId: string
  startedAt: string
  cooldownEndsAt: string
  jobIds: string[]
  enqueuedJobs: number
  processedJobs: number
  pendingJobs: number
  runningJobs: number
  completedJobs: number
  failedJobs: number
  rateLimitedJobs: number
  generatedTopics: number
  isProcessing: boolean
  isComplete: boolean
  errorMessage: string | null
}

export interface RevokeSessionResult {
  sessionId: string
  shouldLogout: boolean
}

export type SocialProvider = 'twitter' | 'tiktok'
export type ContentTopicStatus = 'pending' | 'completed' | 'deleted'
export type ContentTopicStatusFilter = 'pending' | 'completed' | 'all'

export interface SocialAccount {
  id: string
  userId: string
  provider: SocialProvider
  handle: string | null
  isConnected: boolean
  connectedAt: string | null
  permissions: string[]
}

export interface ContentTopic {
  id: string
  userId: string
  groups: ContentTopicGroupSummary[]
  title: string
  summary: string
  originalScript: string
  currentScript: string
  editedAt: string | null
  sourceProvider: SocialProvider
  status: ContentTopicStatus
  signals: string[]
  tags: string[]
  topicReferences: TopicReference[]
  generatedAt: string
  completedAt: string | null
}

export interface ContentTopicGroupSummary {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface ContentTopicGroup extends ContentTopicGroupSummary {
  topicsCount: number
}

export interface ContentTopicFilters {
  title?: string
  status?: ContentTopicStatusFilter
  tags?: string[]
  groupId?: string | null
}

export interface UpdateContentTopicInput {
  userId: string
  topicId: string
  title?: string
  summary?: string
  tags?: string[]
}

export interface TopicReference {
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

export interface ContentTopicMetrics {
  total: number
  completed: number
  pending: number
  twitterSignals: number
  tiktokSignals: number
  completionRate: number
}

export type LinkPreviewKind = 'image' | 'video' | 'gif' | 'link'

export interface LinkPreview {
  url: string
  resolvedUrl: string
  contentType: string | null
  kind: LinkPreviewKind
  title: string | null
  description: string | null
  imageUrl: string | null
  siteName: string | null
}

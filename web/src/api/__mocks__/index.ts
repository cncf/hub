export const API = {
  getPackage: jest.fn(),
  toggleStar: jest.fn(),
  getStars: jest.fn(),
  searchPackages: jest.fn(),
  getStats: jest.fn(),
  getRandomPackages: jest.fn(),
  getCSRFToken: jest.fn(),
  register: jest.fn(),
  verifyEmail: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  getUserProfile: jest.fn(),
  getAllRepositories: jest.fn(),
  getRepositories: jest.fn(),
  addRepository: jest.fn(),
  deleteRepository: jest.fn(),
  updateRepository: jest.fn(),
  transferRepository: jest.fn(),
  claimRepositoryOwnership: jest.fn(),
  checkAvailability: jest.fn(),
  getUserOrganizations: jest.fn(),
  getOrganization: jest.fn(),
  addOrganization: jest.fn(),
  updateOrganization: jest.fn(),
  deleteOrganization: jest.fn(),
  getOrganizationMembers: jest.fn(),
  addOrganizationMember: jest.fn(),
  deleteOrganizationMember: jest.fn(),
  confirmOrganizationMembership: jest.fn(),
  getStarredByUser: jest.fn(),
  updateUserProfile: jest.fn(),
  updatePassword: jest.fn(),
  saveImage: jest.fn(),
  getPackageSubscriptions: jest.fn(),
  addSubscription: jest.fn(),
  deleteSubscription: jest.fn(),
  getUserSubscriptions: jest.fn(),
  getWebhooks: jest.fn(),
  getWebhook: jest.fn(),
  addWebhook: jest.fn(),
  deleteWebhook: jest.fn(),
  updateWebhook: jest.fn(),
  triggerWebhookTest: jest.fn(),
  getAPIKeys: jest.fn(),
  getAPIKey: jest.fn(),
  addAPIKey: jest.fn(),
  updateAPIKey: jest.fn(),
  deleteAPIKey: jest.fn(),
  getOptOutList: jest.fn(),
  addOptOut: jest.fn(),
  deleteOptOut: jest.fn(),
  getAuthorizationPolicy: jest.fn(),
  updateAuthorizationPolicy: jest.fn(),
  getUserAllowedActions: jest.fn(),
  getSnapshotSecurityReport: jest.fn(),
  getValuesSchema: jest.fn(),
  getChangelog: jest.fn(),
  triggerTestInRegoPlayground: jest.fn(),
  requestPasswordResetCode: jest.fn(),
  verifyPasswordResetCode: jest.fn(),
  resetPassword: jest.fn(),
};

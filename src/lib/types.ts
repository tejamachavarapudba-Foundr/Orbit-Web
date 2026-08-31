export type WorkExperience = {
  company: string;
  designation: string;
  location: string;
  startDate: string; // "YYYY-MM"
  endDate: string; // "YYYY-MM", blank when isCurrent
  isCurrent: boolean;
  /** Free-text timeline from before the date-picker existed — display fallback only. */
  legacyTimeline?: string;
};

export type Certification = {
  name: string;
  fileUrl: string;
  fileKey: string;
};

export type InvestorProfileData = {
  fundName: string;
  investmentRange: string;
  industries: string[];
  portfolio: string;
  geography: string;
  goals: string[];
};

export type ProfessionalProfileData = {
  skills: string[];
  experienceLevel: string;
  portfolio: string;
  resume: string;
  certifications: Certification[];
  experiences: WorkExperience[];
  goals: string[];
  specialization: string;
  specializationOther: string;
};

export type AdvisorProfileData = {
  expertise: string[];
  yearsExperience: string;
  industries: string[];
  mentorshipAreas: string[];
  certifications: Certification[];
  experiences: WorkExperience[];
  goals: string[];
};

export type ServiceProviderProfileData = {
  company: string;
  services: string[];
  website: string;
  companyLinkedinUrl: string;
  clientIndustries: string[];
  goals: string[];
};

export type Profile = {
  id: string;
  fullName: string;
  headline: string;
  bio: string;
  role: string;
  location: string;
  company: string;
  website?: string;
  linkedinUrl?: string;
  skills?: string[];
  lookingFor?: string[];
  openToConnect?: boolean;
  avatarUrl: string;
  identityVerified?: boolean;
  profileCompletion?: number;
  onboardingCompleted?: boolean;
  createdAt?: string;
  resumeFileName?: string | null;
  resumeFileSize?: number | null;
  resumeUpdatedAt?: string | null;
  investorProfile?: InvestorProfileData | null;
  professionalProfile?: ProfessionalProfileData | null;
  advisorProfile?: AdvisorProfileData | null;
  serviceProviderProfile?: ServiceProviderProfileData | null;
};

export type AuthMe = {
  id: string;
  email: string;
  role: string;
  emailVerified: boolean;
  profile: Profile;
};

export type PostAuthor = {
  id: string;
  fullName: string;
  headline: string;
  avatarUrl: string;
  identityVerified?: boolean;
};

export type PostMedia = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  thumbnailUrl?: string | null;
};

export type Post = {
  id: string;
  content: string;
  category: string;
  linkUrl: string;
  createdAt: string;
  author: PostAuthor;
  media: PostMedia[];
  likes: { id: string; userId: string }[];
  comments: { id: string }[];
};

export type PostComment = {
  id: string;
  content: string;
  createdAt: string;
  author: PostAuthor;
};

export type TrendingStartup = {
  id: string;
  name: string;
  tagline: string;
  stage: string;
  projectType: string;
  founderVerified?: boolean;
};

export type SavedStartup = {
  id: string;
  projectId: string;
  createdAt: string;
  project: TrendingStartup;
};

export type StartupDetail = TrendingStartup & {
  description?: string;
  website?: string;
  location?: string;
  industryTags?: string[];
  techStack?: string[];
  lookingFor?: string[];
  createdAt: string;
  owner: { id: string; fullName: string; headline: string; avatarUrl: string } | null;
  members: { id: string; role: string; user: { id: string; fullName: string; avatarUrl: string; headline: string } }[];
  applications: { id: string; status: string; applicantId: string }[];
  reviews: { id: string; rating: number; comment: string; reviewerId: string }[];
};

export type ConnectionStatus = {
  status: "self" | "connected" | "outgoing_pending" | "incoming_pending" | "none";
  requestId?: string;
};

export type ConnectionProfile = { id: string; fullName: string; headline: string; avatarUrl: string };

export type IncomingRequest = {
  id: string;
  status: string;
  note: string;
  createdAt: string;
  requester: ConnectionProfile;
};

export type OutgoingRequest = {
  id: string;
  status: string;
  note: string;
  createdAt: string;
  recipient: ConnectionProfile;
};

export type ConnectedProfile = {
  connectionId: string;
  connectedAt: string;
  profile: ConnectionProfile;
};

export type Job = {
  id: string;
  startupName: string;
  heading: string;
  role: string;
  experience: string;
  skills: string[];
  description: string;
  posterId: string;
  createdAt: string;
  poster: Profile;
  applications: { id: string; status: string; applicantId: string }[];
};

export type JobApplication = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  message: string;
  createdAt: string;
  applicant?: Profile;
  job?: Job;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string | null;
  hostId: string;
  isPrivate: boolean;
  status: string;
  cancellationReason?: string | null;
  _count?: { attendees: number };
};

export type EventAttendee = { id: string; fullName: string; avatarUrl: string; headline: string; company: string };

export type Community = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  _count?: { members: number };
};

export type CommunityMember = {
  id: string;
  role: string;
  userId: string;
  joinedAt: string;
  user: { id: string; fullName: string; avatarUrl: string; headline: string };
};

export type CommunityDetail = Community & { members: CommunityMember[] };

export type Conversation = {
  id: string;
  userAId: string;
  userBId: string;
  lastMessageAt: string;
  messages: Message[];
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt: string | null;
};

export type MeetingParticipant = { id: string; fullName: string; avatarUrl: string };

export type ProposedSlot = { date: string; time: string };

export type ProposalInviteeRow = {
  id: string;
  userId: string;
  response: "pending" | "accepted" | "rejected";
  selectedSlot: ProposedSlot | null;
  respondedAt: string | null;
  user: MeetingParticipant;
};

export type MeetingProposal = {
  id: string;
  organizerId: string;
  inviteMode: "startup" | "people";
  targetStartupId: string | null;
  purpose: string;
  message: string | null;
  schedulingMode: "availability_pick" | "date_push";
  proposedSlots: ProposedSlot[] | null;
  status: "pending" | "confirmed" | "declined" | "cancelled";
  timezone: string;
  createdAt: string;
  organizer: MeetingParticipant;
  invitees: ProposalInviteeRow[];
};

export type MeetingJoinRecord = { id: string; meetingId: string; userId: string; joinedAt: string };

export type Meeting = {
  id: string;
  proposalId: string;
  confirmedAt: string;
  timezone: string;
  durationMins: number;
  meetLink: string | null;
  status: "upcoming" | "completed" | "cancelled";
  proposal: MeetingProposal;
  joins: MeetingJoinRecord[];
};

export type MeetingsUpcoming = { meetings: Meeting[]; pendingProposals: MeetingProposal[] };
export type MeetingsCancelled = { meetings: Meeting[]; proposals: MeetingProposal[] };

export type AvailabilitySlot = {
  id: string;
  profileId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
  isActive: boolean;
};

export type VerificationStatus = {
  identityVerified: boolean;
  identityVerifiedAt: string | null;
  founder: {
    status: "pending" | "approved" | "rejected";
    reviewNotes: string | null;
    certificateName: string;
    cinNumber: string | null;
    documentUrl: string;
    submittedAt: string;
  } | null;
  investorVerified: boolean;
  professionalVerified: boolean;
  advisorVerified: boolean;
  serviceProviderVerified: boolean;
};

/** Same booleans as VerificationStatus, safe to show on anyone's profile — no founder submission details. */
export type PublicVerificationStatus = {
  identityVerified: boolean;
  founderVerified: boolean;
  investorVerified: boolean;
  professionalVerified: boolean;
  advisorVerified: boolean;
  serviceProviderVerified: boolean;
};

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type SearchResults = {
  users: { id: string; email: string; profile: Profile }[];
  projects: TrendingStartup[];
  jobs: Job[];
  events: EventItem[];
  posts: Post[];
  messages: Message[];
};

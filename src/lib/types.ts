export type Profile = {
  id: string;
  fullName: string;
  headline: string;
  bio: string;
  role: string;
  location: string;
  company: string;
  avatarUrl: string;
  identityVerified?: boolean;
  profileCompletion?: number;
  onboardingCompleted?: boolean;
};

export type AuthMe = {
  id: string;
  email: string;
  role: string;
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

export type TrendingStartup = {
  id: string;
  name: string;
  tagline: string;
  stage: string;
  projectType: string;
  founderVerified?: boolean;
};

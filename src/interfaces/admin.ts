import { BLOG_CATEGORIES, PET_SPECIES, REPORT_ENTITY, USER_ROLE } from '../utils/constants';

export interface IAdminStatistics {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  totalPosts: number;
  totalBlogs: number;
  totalPayments: number;
  totalRevenue: number;
  pendingReports: number;
  resolvedReports: number;
  monthlyStats: IMonthlyStats[];
}

export interface IMonthlyStats {
  month: string;
  users: number;
  pets: number;
  posts: number;
  payments: number;
}

export interface IAdminUserResponse {
  id: string;
  email: string;
  name: string;
  image: string;
  role: USER_ROLE;
  isActive: boolean;
  isCreatedAt: string;
  phone: string;
}

export interface IAdminPetResponse {
  id: string;
  name: string;
  species: PET_SPECIES;
  breed: string;
  isAvailable: boolean;
  isActive: boolean;
  ownerName: string;
  ownerId: string;
  isCreatedAt: string;
}

export interface IAdminPostResponse {
  id: string;
  userId: string;
  userName: string;
  content: string;
  like: number;
  isActive: boolean;
  isCreatedAt: string;
}

export interface IAdminBlogResponse {
  id: string;
  title: string;
  category: BLOG_CATEGORIES;
  userName: string;
  userId: string;
  view: number;
  isActive: boolean;
  isCreatedAt: string;
}

export interface IAdminPaymentResponse {
  id: string;
  blogId: string;
  blogTitle: string;
  userName: string;
  amount: number;
  monthDuration: number;
  isCreatedAt: string;
}

export interface IAdminReportResponse {
  targetId: string;
  targetType: REPORT_ENTITY;
  spamCount: number;
  scamCount: number;
  inappropriateCount: number;
  otherCount: number;
  totalCount: number;
  isResolved: boolean;
  lastReportAt: string;
}

export interface IAdminSearchFilter {
  keyword?: string;
  isActive?: boolean;
}

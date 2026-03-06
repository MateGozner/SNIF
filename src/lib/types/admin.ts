export interface AdminDashboardDto {
  totalUsers: number;
  totalPets: number;
  totalMatches: number;
  activeSubscriptions: number;
  revenueThisMonth: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  matchRate: number;
  topBreeds: BreedStatDto[];
  userGrowth: DailyStatDto[];
  matchesOverTime: DailyStatDto[];
}

export interface BreedStatDto {
  breed: string;
  count: number;
}

export interface DailyStatDto {
  date: string;
  count: number;
}

export interface AdminUserDto {
  id: string;
  name: string;
  email: string;
  role: string | null;
  petCount: number;
  isOnline: boolean;
  isBanned: boolean;
  suspendedUntil: string | null;
  createdAt: string;
  subscriptionPlan: string | null;
}

export interface AdminUserDetailDto extends AdminUserDto {
  pets: { id: string; name: string; species: string; breed: string }[];
  matchesCount: number;
  reportsCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminReportDto {
  id: string;
  reporterName: string;
  targetUserId: string;
  targetUserName: string;
  targetPetName: string | null;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
}

export interface AdminSubscriptionStatsDto {
  totalFree: number;
  totalGoodBoy: number;
  totalAlphaPack: number;
  totalTreatBag: number;
  mrr: number;
}

export interface SystemHealthDto {
  dbConnected: boolean;
  redisConnected: boolean;
  activeSignalRConnections: number;
  uptime: string;
  lastMigration: string | null;
}

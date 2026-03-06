import {
  SubscriptionPlan,
  SubscriptionStatus,
  UsageType,
  type SubscriptionDto,
  type PlanLimits,
  type UsageResponseDto,
  type CreditBalanceDto,
  type PlanDefinition,
} from '@/lib/types/subscription';

describe('Subscription types', () => {
  describe('SubscriptionPlan enum', () => {
    it('has all expected plan values', () => {
      expect(SubscriptionPlan.Free).toBe('Free');
      expect(SubscriptionPlan.GoodBoy).toBe('GoodBoy');
      expect(SubscriptionPlan.AlphaPack).toBe('AlphaPack');
      expect(SubscriptionPlan.TreatBag).toBe('TreatBag');
    });

    it('contains exactly 4 plans', () => {
      const values = Object.values(SubscriptionPlan);
      expect(values).toHaveLength(4);
    });
  });

  describe('SubscriptionStatus enum', () => {
    it('has all expected status values', () => {
      expect(SubscriptionStatus.Active).toBe('Active');
      expect(SubscriptionStatus.PastDue).toBe('PastDue');
      expect(SubscriptionStatus.Canceled).toBe('Canceled');
      expect(SubscriptionStatus.Trialing).toBe('Trialing');
    });
  });

  describe('UsageType enum', () => {
    it('has all expected usage types', () => {
      expect(UsageType.Like).toBe('Like');
      expect(UsageType.SuperSniff).toBe('SuperSniff');
      expect(UsageType.PetCreation).toBe('PetCreation');
      expect(UsageType.VideoCall).toBe('VideoCall');
    });
  });

  describe('PlanLimits', () => {
    it('Free plan has restrictive limits', () => {
      const freeLimits: PlanLimits = {
        maxPets: 1,
        dailyLikes: 5,
        dailySuperSniffs: 0,
        searchRadiusKm: 10,
        videoCallEnabled: false,
        hasAds: true,
        unlimitedLikes: false,
      };
      expect(freeLimits.maxPets).toBe(1);
      expect(freeLimits.dailyLikes).toBe(5);
      expect(freeLimits.hasAds).toBe(true);
      expect(freeLimits.unlimitedLikes).toBe(false);
    });

    it('AlphaPack plan has generous limits', () => {
      const alphaLimits: PlanLimits = {
        maxPets: 10,
        dailyLikes: 999,
        dailySuperSniffs: 10,
        searchRadiusKm: 100,
        videoCallEnabled: true,
        hasAds: false,
        unlimitedLikes: true,
      };
      expect(alphaLimits.unlimitedLikes).toBe(true);
      expect(alphaLimits.videoCallEnabled).toBe(true);
      expect(alphaLimits.hasAds).toBe(false);
    });
  });

  describe('SubscriptionDto', () => {
    it('satisfies the interface structure', () => {
      const sub: SubscriptionDto = {
        id: 'sub-1',
        userId: 'u1',
        planId: SubscriptionPlan.GoodBoy,
        status: SubscriptionStatus.Active,
        currentPeriodStart: '2026-01-01',
        currentPeriodEnd: '2026-02-01',
        cancelAtPeriodEnd: false,
        stripeCustomerId: 'cus_123',
      };
      expect(sub.planId).toBe('GoodBoy');
      expect(sub.cancelAtPeriodEnd).toBe(false);
    });

    it('stripeCustomerId is optional', () => {
      const sub: SubscriptionDto = {
        id: 'sub-2',
        userId: 'u2',
        planId: SubscriptionPlan.Free,
        status: SubscriptionStatus.Active,
        currentPeriodStart: '2026-01-01',
        currentPeriodEnd: '2026-02-01',
        cancelAtPeriodEnd: false,
      };
      expect(sub.stripeCustomerId).toBeUndefined();
    });
  });

  describe('UsageResponseDto', () => {
    it('contains usage counts and limits', () => {
      const usage: UsageResponseDto = {
        userId: 'u1',
        date: '2026-01-15',
        usageCounts: { Like: 3, SuperSniff: 1 },
        currentLimits: {
          maxPets: 3,
          dailyLikes: 20,
          dailySuperSniffs: 3,
          searchRadiusKm: 50,
          videoCallEnabled: true,
          hasAds: false,
          unlimitedLikes: false,
        },
        currentPlan: SubscriptionPlan.GoodBoy,
      };
      expect(usage.usageCounts.Like).toBe(3);
      expect(usage.currentLimits.dailyLikes).toBe(20);
      expect(usage.currentPlan).toBe('GoodBoy');
    });
  });

  describe('CreditBalanceDto', () => {
    it('has credits count', () => {
      const balance: CreditBalanceDto = { credits: 50 };
      expect(balance.credits).toBe(50);
      expect(balance.lastPurchasedAt).toBeUndefined();
    });

    it('includes optional lastPurchasedAt', () => {
      const balance: CreditBalanceDto = {
        credits: 100,
        lastPurchasedAt: '2026-01-10T10:00:00Z',
      };
      expect(balance.lastPurchasedAt).toBeDefined();
    });
  });

  describe('PlanDefinition', () => {
    it('satisfies the full plan definition structure', () => {
      const plan: PlanDefinition = {
        id: SubscriptionPlan.GoodBoy,
        name: 'Good Boy',
        tagline: 'For the good doggos',
        monthlyPrice: 9.99,
        yearlyPrice: 99.99,
        features: ['20 likes/day', '3 pets', 'No ads'],
        limits: {
          maxPets: 3,
          dailyLikes: 20,
          dailySuperSniffs: 3,
          searchRadiusKm: 50,
          videoCallEnabled: true,
          hasAds: false,
          unlimitedLikes: false,
        },
        popular: true,
      };
      expect(plan.monthlyPrice).toBe(9.99);
      expect(plan.features).toContain('No ads');
      expect(plan.popular).toBe(true);
    });
  });
});

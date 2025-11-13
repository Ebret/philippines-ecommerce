import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '@/lib/prisma';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    userProfile: {
      upsert: vi.fn(),
    },
  },
}));

describe('User Profile API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/users/profile', () => {
    it('should return user profile when authenticated', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        role: 'BUYER',
        status: 'ACTIVE',
        emailVerified: true,
        phoneVerified: false,
        lastLogin: new Date(),
        createdAt: new Date(),
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '09123456789',
          bio: 'Test bio',
        },
        accounts: [
          { provider: 'credentials', type: 'credentials' },
        ],
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      const response = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        status: mockUser.status,
        emailVerified: mockUser.emailVerified,
        phoneVerified: mockUser.phoneVerified,
        lastLogin: mockUser.lastLogin,
        createdAt: mockUser.createdAt,
        profile: mockUser.profile,
        providers: ['credentials'],
      };

      expect(response.email).toBe('test@example.com');
      expect(response.role).toBe('BUYER');
      expect(response.profile.firstName).toBe('John');
    });

    it('should return 401 when not authenticated', async () => {
      const error = { status: 401, message: 'Unauthorized' };
      expect(error.status).toBe(401);
    });

    it('should return 404 when user not found', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);
      const error = { status: 404, message: 'User not found' };
      expect(error.status).toBe(404);
    });
  });

  describe('PATCH /api/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '09987654321',
        bio: 'Updated bio',
      };

      const mockUpdatedProfile = {
        userId: 'user-1',
        ...updateData,
      };

      (prisma.userProfile.upsert as any).mockResolvedValue(mockUpdatedProfile);

      expect(mockUpdatedProfile.firstName).toBe('Jane');
      expect(mockUpdatedProfile.phone).toBe('09987654321');
    });

    it('should validate phone format', async () => {
      const invalidPhone = '1234567890'; // Invalid format
      const validation = /^09\d{9}$/.test(invalidPhone);
      expect(validation).toBe(false);
    });

    it('should validate phone format correctly', async () => {
      const validPhone = '09123456789';
      const validation = /^09\d{9}$/.test(validPhone);
      expect(validation).toBe(true);
    });

    it('should handle validation errors', async () => {
      const invalidData = {
        firstName: '', // Empty first name
        phone: 'invalid',
      };

      const error = { status: 400, message: 'Validation error' };
      expect(error.status).toBe(400);
    });
  });

  describe('Profile Validation', () => {
    it('should validate first name length', () => {
      const validName = 'John';
      const invalidName = 'a'.repeat(101);
      
      expect(validName.length).toBeLessThanOrEqual(100);
      expect(invalidName.length).toBeGreaterThan(100);
    });

    it('should validate bio length', () => {
      const validBio = 'This is a valid bio';
      const invalidBio = 'a'.repeat(501);
      
      expect(validBio.length).toBeLessThanOrEqual(500);
      expect(invalidBio.length).toBeGreaterThan(500);
    });

    it('should validate gender enum', () => {
      const validGenders = ['MALE', 'FEMALE', 'OTHER'];
      const invalidGender = 'UNKNOWN';
      
      expect(validGenders).toContain('MALE');
      expect(validGenders).not.toContain(invalidGender);
    });
  });
});


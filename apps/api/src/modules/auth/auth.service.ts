import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '@rmc-ms/shared-types';
import { randomUUID } from 'crypto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  isCompanyWide: boolean;
  branchIds: string[];
}

/**
 * M01 - phan Auth (FR-M01-02). Repository dang in-memory - se thay bang Prisma
 * cung luc voi cac service khac (xem ghi chu tuong tu order.service.ts).
 * Mat khau demo cho toan bo user seed: "password123".
 */
@Injectable()
export class AuthService {
  private readonly users = new Map<string, User>();

  constructor(private readonly jwtService: JwtService) {
    this.seedDemoUsers();
  }

  private seedDemoUsers(): void {
    const demoHash = bcrypt.hashSync('password123', 10);
    const seed: Array<Omit<User, 'id' | 'passwordHash'>> = [
      { fullName: 'Hùng - NVKD', email: 'hung.nvkd@rmc-ms.vn', role: UserRole.SALES_REP, isCompanyWide: false, branchIds: ['CN3'], isActive: true },
      { fullName: 'Trang - Kỹ thuật', email: 'trang.kt@rmc-ms.vn', role: UserRole.TECHNICAL_STAFF, isCompanyWide: false, branchIds: ['CN1', 'CN3'], isActive: true },
      { fullName: 'Nam - Kế hoạch', email: 'nam.kh@rmc-ms.vn', role: UserRole.PLANNING_STAFF, isCompanyWide: false, branchIds: ['CN2'], isActive: true },
      { fullName: 'Dũng - Điều hành', email: 'dung.dh@rmc-ms.vn', role: UserRole.DISPATCHER, isCompanyWide: false, branchIds: ['CN1'], isActive: true },
      { fullName: 'Chị Hà - Kế toán', email: 'ha.kt@rmc-ms.vn', role: UserRole.ACCOUNTANT, isCompanyWide: true, branchIds: [], isActive: true },
      { fullName: 'Chị Loan - GĐ CN1', email: 'loan.gdcn1@rmc-ms.vn', role: UserRole.BRANCH_MANAGER, isCompanyWide: false, branchIds: ['CN1'], isActive: true },
      { fullName: 'Anh Sơn - TGĐ', email: 'son.tgd@rmc-ms.vn', role: UserRole.EXECUTIVE, isCompanyWide: true, branchIds: [], isActive: true },
      { fullName: 'IT Admin', email: 'admin@rmc-ms.vn', role: UserRole.ADMIN, isCompanyWide: true, branchIds: [], isActive: true },
    ];
    for (const u of seed) {
      const id = randomUUID();
      this.users.set(id, { id, passwordHash: demoHash, ...u });
    }
  }

  private findByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async login(email: string, password: string): Promise<{ accessToken: string; user: Omit<User, 'passwordHash'> }> {
    const user = this.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Sai email hoặc mật khẩu');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      isCompanyWide: user.isCompanyWide,
      branchIds: user.branchIds,
    };
    const accessToken = this.jwtService.sign(payload);
    const { passwordHash, ...safeUser } = user;
    return { accessToken, user: safeUser };
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }
}

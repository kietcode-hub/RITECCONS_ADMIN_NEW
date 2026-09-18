import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './auth.service';

export interface RequestUser {
  userId: string;
  email: string;
  role: string;
  isCompanyWide: boolean;
  branchIds: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
    });
  }

  // Gia tri tra ve o day duoc Nest gan vao request.user - dung boi @CurrentUser()
  async validate(payload: JwtPayload): Promise<RequestUser> {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      isCompanyWide: payload.isCompanyWide,
      branchIds: payload.branchIds,
    };
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserBranchScope } from '@rmc-ms/business-rules';
import { RequestUser } from './jwt.strategy';

/** Lay request.user (da gan boi JwtStrategy) trong controller: @CurrentUser() user: RequestUser */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): RequestUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

/** Chuyen RequestUser sang dung format UserBranchScope de goi thang assertBranchScope/isInBranchScope. */
export function toBranchScope(user: RequestUser): UserBranchScope {
  return { isCompanyWide: user.isCompanyWide, branchIds: user.branchIds };
}

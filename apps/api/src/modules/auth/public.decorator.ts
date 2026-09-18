import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Danh dau route khong can JWT (vd /auth/login, /health). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

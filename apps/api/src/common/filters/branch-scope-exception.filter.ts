import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from '@nestjs/common';
import { BranchScopeViolationError } from '@rmc-ms/business-rules';
import { Response } from 'express';

/**
 * BranchScopeViolationError (tu assertBranchScope, BRULE-17) la loi thuong (Error),
 * khong phai HttpException, nen mac dinh NestJS tra ve 500 thay vi 403. Filter nay
 * chuyen doi sang HTTP dung nghia - phat hien khi test smoke: tao don ngoai
 * chi nhanh duoc gan tra ve 500 thay vi bi chan ro rang.
 */
@Catch(BranchScopeViolationError)
export class BranchScopeExceptionFilter implements ExceptionFilter {
  catch(exception: BranchScopeViolationError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const forbidden = new ForbiddenException(exception.message);
    const body = forbidden.getResponse();
    response.status(forbidden.getStatus()).json(body);
  }
}

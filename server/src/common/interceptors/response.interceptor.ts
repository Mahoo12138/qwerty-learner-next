import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => {
        // 如果已经是 ApiResponse，直接返回
        if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
          return data;
        }
        // 你可以根据 context 自动生成 message，也可以统一写“操作成功”
        return new ApiResponse('操作成功', data);
      }),
    );
  }
}
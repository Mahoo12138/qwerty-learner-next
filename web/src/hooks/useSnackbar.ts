import { useCallback } from 'react';
import { enqueueSnackbar } from 'notistack'; // MUI Snackbar 推荐用 notistack

export function useSnackbar() {
  const handleSuccess = useCallback((res: any, customMsg?: string) => {
    if (res?.success !== false) {
      enqueueSnackbar(customMsg || res?.message || '操作成功', { variant: 'success' });
    } else {
      enqueueSnackbar(res?.message || '操作失败', { variant: 'error' });
    }
  }, []);

  const handleError = useCallback((err: any) => {
    enqueueSnackbar(err?.message || '操作失败', { variant: 'error' });
  }, []);

  return { handleSuccess, handleError };
}

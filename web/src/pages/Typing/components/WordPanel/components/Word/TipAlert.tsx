import Alert from '@mui/joy/Alert';
import type { FC } from 'react'
import { useCallback } from 'react'
import { TriangleAlert } from 'lucide-react';
import { IconButton, Typography } from '@mui/joy';

export type ITipAlert = {
  className?: string
  show: boolean
  setShow: (show: boolean) => void
}

export const TipAlert: FC<ITipAlert> = ({ className, show, setShow }) => {
  const onClose = useCallback(() => {
    setShow(false)
  }, [setShow])

  return (
    <>
      {show && (
        <div className={`alert z-10 w-fit cursor-pointer pr-5 ${className}`} onClick={onClose}>
          <Alert
            sx={{ alignItems: 'flex-start' }}
            variant="soft"
            color="warning"
            endDecorator={
              <IconButton variant="soft">
                <TriangleAlert />
              </IconButton>
            }
          >
            <div>
              <div>插件冲突！</div>
              <Typography level="body-sm" >
                如果多次输入失败，可能是与本地浏览器插件冲突，请关闭相关插件或切换浏览器试试
              </Typography>
            </div>
          </Alert>
        </div>
      )}
    </>
  )
}

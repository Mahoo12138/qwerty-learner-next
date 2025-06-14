import { createFileRoute } from '@tanstack/react-router';
import Member from '@/pages/Setting/Member';

export const Route = createFileRoute('/_authenticated/_sidebar/setting/member')({
  component: Member,
});
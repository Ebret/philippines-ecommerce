import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminLiveStreamsClient from './live-streams-client';

export const dynamic = 'force-dynamic';

export default async function AdminLiveStreamsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  // Check if user is admin
  const user = session.user as any;
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    redirect('/');
  }

  return <AdminLiveStreamsClient />;
}


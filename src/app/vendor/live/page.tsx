import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import VendorLiveStreamsClient from './vendor-live-streams-client';

export const dynamic = 'force-dynamic';

export default async function VendorLiveStreamsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/login');
  }

  const user = session.user as any;
  if (user.role !== 'SELLER' && user.role !== 'SUPER_ADMIN') {
    redirect('/');
  }

  return <VendorLiveStreamsClient />;
}


import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/auth.config';
import Sidebar from '../components/layout/Sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Layout Session:', session);

    if (!session) {
      console.log('No session in layout, redirecting to signin');
      redirect('/auth/signin');
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pl-72">
          <main className="p-8 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Layout error:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
} 
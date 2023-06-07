import { getServerSession } from 'next-auth';
import Sidebar from './Sidebar';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Navbar from './Navbar';
import { BottomMenu } from './BottomMenu';

export default async function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <div className="h-screen flex flex-col bg-violet-100">
      {session && <Navbar />}
      {session ? (
        <div className="h-full w-full flex flex-col md:flex-row">
          {session && <Sidebar />}
          <div className="flex-grow flex justify-center">
            <div className="w-full lg:w-[850px] xl:w-[950px] px-4 pt-8">
              {children}
            </div>
          </div>
          {session && <BottomMenu />}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
import { ProfileHeader } from './ProfileHeader';
import { getProfile } from './getProfile';
import { getServerUser } from '@/lib/getServerUser';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const [user] = await getServerUser();
  const profile = await getProfile(params.username);
  if (profile === null) return <></>;
  const isOwnProfile = profile?.id === user?.id;

  return (
    <>
      <ProfileHeader isOwnProfile={isOwnProfile} initialProfileData={profile} />
      <div className="px-4">{children}</div>
    </>
  );
}

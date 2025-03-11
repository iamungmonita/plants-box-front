import API_URL from "@/lib/api";
import { Profile } from "@/schema/auth";
import Image from "next/image";
const ProfileComponent = ({ profile }: { profile: Profile | null }) => {
  return (
    <Image
      width={50}
      height={50}
      src={`${
        profile?.pictures
          ? `${API_URL}${profile?.pictures}`
          : "/assets/default-profile.jpg"
      }`}
      title={profile?.firstName}
      alt={profile?.firstName as string}
      className="w-[40px] h-[40px] cursor-pointer object-cover border  rounded-full"
    />
  );
};
export default ProfileComponent;

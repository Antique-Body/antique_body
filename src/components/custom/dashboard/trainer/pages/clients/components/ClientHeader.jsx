import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function ClientHeader({ client, profile, formatDate }) {
  const router = useRouter();

  return (
    <div className="mb-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/trainer/dashboard/clients")}
          className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-200"
        >
          <Icon
            icon="mdi:arrow-left"
            width={20}
            height={20}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span className="text-sm font-medium">Back to Clients</span>
        </button>
      </div>

      {/* Client Profile Header */}
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 overflow-hidden rounded-2xl ring-2 ring-[#3E92CC]/30 shadow-lg">
          {profile.profileImage ? (
            <Image
              src={profile.profileImage}
              alt={`${profile.firstName} profile`}
              className="object-cover w-full h-full"
              width={80}
              height={80}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3E92CC] to-[#2D7EB8]">
              <Icon icon="mdi:account" width={32} height={32} color="white" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-zinc-400 flex items-center gap-2">
            <Icon icon="mdi:calendar" width={16} height={16} />
            Client since {formatDate(client.respondedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
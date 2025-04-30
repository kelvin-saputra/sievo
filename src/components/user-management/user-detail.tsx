"use client";

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { UserSchema } from "@/models/schemas";

interface UserDetailCardProps {
  user: UserSchema;
}

// Extract the UserDetailContent component from UserDetailCard
export function UserDetailCard({ user }: UserDetailCardProps) {
  const formatDateToIndonesian = (date: Date | string | undefined) => {
    if (!date) return "";

    // Convert to Date object if it's a string
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date:", date);
      return "";
    }

    // Array of day names in Indonesian
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    // Array of month names in Indonesian
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const day = days[dateObj.getDay()];
    const dateNum = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${day}, ${dateNum} ${month} ${year}`;
  };

  const getUserInitials = (name: string) => {
    if (!name) return "";

    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : `${nameParts[0][0]}`.toUpperCase();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
          <Avatar className="h-full w-full rounded-full border border-border/50 bg-gray-300">
            <AvatarFallback className="rounded-full text-primary bg-gray-300 flex items-center justify-center w-full h-full">
              <div className="font-bold text-3xl flex items-center justify-center w-full h-full">
                {getUserInitials(user.name || "")}
              </div>
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <Badge variant={"default"} className="mt-1 px-3 py-0.5 rounded-full">
            {user.role}
          </Badge>
        </div>

        <div className="grid gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">E-mail</p>
            <p>{user.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Nomor Telepon
            </p>
            <p>{user.phone_number}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Mulai Kerja
            </p>
            <p>{formatDateToIndonesian(user.started_at)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Akhir Kerja
            </p>
            <p>{formatDateToIndonesian(user.ended_at)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge
              className={`mt-1 ${
                user.is_active === true
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {user.is_active ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

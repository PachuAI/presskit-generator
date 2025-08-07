import { AuthUser, UserProfile } from "../../types/auth"
import { Card, CardContent } from "../ui"

interface UserProfileCardProps {
  user: AuthUser | null
  profile: UserProfile | null
}

export function UserProfileCard({ user, profile }: UserProfileCardProps) {
  const artistName = profile?.artist_name || "Artista"
  const initial = artistName.charAt(0).toUpperCase()
  const email = user?.email || ""
  const subscriptionStatus = profile?.subscription_status || "Free"

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div
            className="flex size-16 items-center justify-center rounded-full bg-[#FF6B35] text-2xl font-bold text-white"
            aria-label={`Avatar de ${artistName}`}
          >
            {initial}
          </div>
          <div className="flex-1">
            <h3 className="font-itera-heading text-lg font-semibold text-white">¡Hola, {artistName}!</h3>
            <p className="font-itera-body text-sm text-[#A0A0A0]">{email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-[#FF6B35]/10 px-2 py-1 text-xs font-medium text-[#FF6B35]">
                Plan {subscriptionStatus}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

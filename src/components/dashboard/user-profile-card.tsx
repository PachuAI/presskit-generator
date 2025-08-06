import { Card, CardContent } from '../ui'
import { User } from '@supabase/supabase-js'

interface UserProfile {
  artist_name?: string
  subscription_status?: string
}

interface UserProfileCardProps {
  user: User | null
  profile: UserProfile | null
}

export function UserProfileCard({ user, profile }: UserProfileCardProps) {
  const artistName = profile?.artist_name || 'Artista'
  const initial = artistName.charAt(0).toUpperCase()
  const email = user?.email || ''
  const subscriptionStatus = profile?.subscription_status || 'Free'

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div 
            className="flex size-16 items-center justify-center rounded-full bg-[#FF6B35] text-white font-bold text-2xl"
            aria-label={`Avatar de ${artistName}`}
          >
            {initial}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-lg font-itera-heading">
              ¡Hola, {artistName}!
            </h3>
            <p className="text-[#A0A0A0] text-sm font-itera-body">
              {email}
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#FF6B35]/10 text-[#FF6B35]">
                Plan {subscriptionStatus}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
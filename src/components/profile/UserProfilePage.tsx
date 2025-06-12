import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Mail, 
  User, 
  Heart, 
  Trash2, 
  Share2,
  LogOut,
  Settings,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDestinations } from '@/hooks/useDestinations';
import { useProfile } from '@/hooks/useProfile';

interface UserProfilePageProps {
  onBack: () => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ onBack }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { savedDestinations, removeSavedDestination } = useDestinations();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || 'Travel Explorer';
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  }) : 'Recently';

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRemoveDestination = async (destinationId: string) => {
    await removeSavedDestination(destinationId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Spinner
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-white/80">Manage your travel preferences and saved destinations</p>
            </div>
            
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-white text-2xl">{displayName}</CardTitle>
                <p className="text-white/80">{user.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-white/80">
                  <Mail className="w-4 h-4 mr-3" />
                  <span className="text-sm">{user.email}</span>
                </div>
                
                <div className="flex items-center text-white/80">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span className="text-sm">Member since {joinDate}</span>
                </div>
                
                <div className="flex items-center text-white/80">
                  <User className="w-4 h-4 mr-3" />
                  <span className="text-sm">
                    Traveler Type: {profile?.traveler_type || 'Not set'}
                  </span>
                </div>
                
                <div className="flex items-center text-white/80">
                  <Globe className="w-4 h-4 mr-3" />
                  <span className="text-sm">
                    {savedDestinations.length} Saved Destination{savedDestinations.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <Separator className="bg-white/20" />

                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30"
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Saved Destinations */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-2xl flex items-center">
                    <Heart className="w-6 h-6 mr-2 text-red-500" />
                    Saved Destinations
                  </CardTitle>
                  <Badge variant="secondary" className="bg-purple-600 text-white">
                    {savedDestinations.length} saved
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {savedDestinations.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No saved destinations yet</h3>
                    <p className="text-white/70 mb-6">Start spinning to discover amazing places and save your favorites!</p>
                    <Button 
                      onClick={onBack}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Start Exploring
                    </Button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedDestinations.map((destination, index) => (
                      <motion.div
                        key={destination.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-semibold text-white">{destination.name}</h3>
                                <p className="text-white/70 text-sm">{destination.country}</p>
                                {destination.city && (
                                  <p className="text-white/60 text-xs">{destination.city}</p>
                                )}
                              </div>
                              <Heart className="w-5 h-5 text-red-500 fill-current" />
                            </div>
                            
                            {destination.tagline && (
                              <p className="text-white/80 text-sm mb-3 italic">"{destination.tagline}"</p>
                            )}
                            
                            <div className="space-y-2 mb-4">
                              {destination.budget_estimate && (
                                <div className="flex items-center text-xs text-white/70">
                                  <span className="font-medium mr-2">Budget:</span>
                                  <span className="text-green-400">{destination.budget_estimate}</span>
                                </div>
                              )}
                              
                              {destination.best_time_to_visit && (
                                <div className="flex items-center text-xs text-white/70">
                                  <Calendar className="w-3 h-3 mr-2" />
                                  <span>{destination.best_time_to_visit}</span>
                                </div>
                              )}
                            </div>

                            {destination.activities && destination.activities.length > 0 && (
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-1">
                                  {destination.activities.slice(0, 3).map((activity, i) => (
                                    <Badge 
                                      key={i} 
                                      variant="secondary" 
                                      className="bg-white/20 text-white text-xs"
                                    >
                                      {activity}
                                    </Badge>
                                  ))}
                                  {destination.activities.length > 3 && (
                                    <Badge 
                                      variant="secondary" 
                                      className="bg-white/20 text-white text-xs"
                                    >
                                      +{destination.activities.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/60">
                                Saved {new Date(destination.saved_at).toLocaleDateString()}
                              </span>
                              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-8 w-8 p-0"
                                >
                                  <Share2 className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30 h-8 w-8 p-0"
                                  onClick={() => handleRemoveDestination(destination.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
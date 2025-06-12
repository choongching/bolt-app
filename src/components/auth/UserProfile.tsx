import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
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

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email;

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 h-auto p-2 hover:bg-white/10 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {displayName ? getInitials(displayName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-white truncate max-w-32">
              {displayName}
            </span>
            <span className="text-xs text-white/70 truncate max-w-32">
              {user.email}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-white/70" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white/95 backdrop-blur-sm border-white/20"
      >
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
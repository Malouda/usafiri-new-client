import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Bell, Search, Menu, User, LogOut } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Input } from '../../components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store';
import { logoutUser } from '../auth/reducers/authReducer';
import { clearState } from '@/store';
import { toast } from 'sonner';

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toggleMobileSidebar } = useSidebar();

  // Get user from Redux store
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      // Dispatch logout action to call API
      await dispatch(logoutUser()).unwrap();

      // Clear entire Redux store and persisted state
      clearState();

      // Show success message
      toast.success('Logged out successfully', {
        description: 'You have been logged out of your account.',
      });

      // Redirect to login page
      navigate('/auth/login', { replace: true });
    } catch (error) {
      // Even if API call fails, clear local state and redirect
      clearState();
      navigate('/auth/login', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Mobile menu button and search */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
   

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

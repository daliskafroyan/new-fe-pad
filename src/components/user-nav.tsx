import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/pages/auth/use-auth.hook';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

type LogoutResponse = {
  message: string
  code: number
  status: boolean
}

function useLogoutQuery({ enabled }: { enabled: boolean }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const clearAuth = useAuthStore(state => state.clearAuth);

  const logoutQuery = useQuery({
    queryKey: ['logout'],
    queryFn: async () => {
      const { data } = await api.get<LogoutResponse>("/logout")
      logout()
      clearAuth()
      navigate("/sign-in", { replace: true });
      return data.message
    },
    enabled
  });

  return logoutQuery
}

export function UserNav() {
  const [isLogout, setIsLogout] = useState(false)
  const { userDetail, userAuthorization } = useAuthStore()

  useLogoutQuery({ enabled: isLogout })

  function handleLogout() {
    setIsLogout(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>{userDetail?.email?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{userAuthorization?.[0]?.nama_roles}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {userDetail?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/pages/auth/use-auth.hook';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { useState } from 'react';

type LogoutResponse = {
  message: string
  code: number
  status: boolean
}

function useLogoutQuery({ enabled }: { enabled: boolean }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useQuery({
    queryKey: ['logout'],
    queryFn: async () => {
      const { data } = await api.get<LogoutResponse>("/logout")
      logout()

      navigate("/sign-in", { replace: true });
      return data.message
    },
    enabled
  });

  return loginMutation
}

export function UserNav() {
  const [isLogout, setIsLogout] = useState(false)
  useLogoutQuery({ enabled: isLogout })
  function handleLogout() {
    setIsLogout(!isLogout)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        {/* <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>satnaing</p>
            <p className='text-xs leading-none text-muted-foreground'>
              satnaingdev@gmail.com
            </p>
          </div>
        </DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}

        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

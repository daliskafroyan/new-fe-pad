import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import { useAuth } from '../use-auth.hook'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '@/api'
import useLocalStorage from '@/hooks/use-local-storage'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

type LoginRequest = z.infer<typeof formSchema>

type LoginResponse = {
  message: string
  code: number
  status: boolean
  data: {
    token: string
    expirationTime: string
  }
}


function useLoginMutation() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [_, setExpirationTime] = useLocalStorage<string | null>({ defaultValue: null, key: 'expiration-time' });


  const loginMutation = useMutation({
    async mutationFn(bodyReq: LoginRequest) {
      try {
        const { data } = await api.post<LoginResponse>("/login", bodyReq);

        login(data.data.token);
        navigate("/", { replace: true });
        setExpirationTime(data.data.expirationTime)

        return data.data;
      } catch (error) {
        throw error
      }
    },
  });

  return loginMutation
}

export type GetUserDetailsResponse = {
  message: string
  code: number
  status: boolean
  data: {
    email: string
    client_id: string
    status: boolean
    next_login: number
    is_verifikasi: boolean
    id_roles: number
    is_update_password: boolean
  }
}


function useGetUserDetail({ enabled }: { enabled: boolean }) {
  const [userDetails, setUserDetails] = useLocalStorage<GetUserDetailsResponse['data'] | null>({ defaultValue: null, key: 'user' });

  return useQuery({
    queryKey: ['users/detail-users'],
    queryFn: async () => {
      const { data } = await api.get<GetUserDetailsResponse>("/users/detail-users")

      setUserDetails(data.data)

      return data.data
    },
    enabled
  });
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useLoginMutation()
  useGetUserDetail({ enabled: loginMutation.isSuccess })

  function onSubmit(data: z.infer<typeof formSchema>) {
    loginMutation.mutate(data)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={loginMutation.isPending}>
              Login
            </Button>

          </div>
        </form>
      </Form>
    </div>
  )
}

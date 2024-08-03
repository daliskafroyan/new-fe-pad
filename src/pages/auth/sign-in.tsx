import { Navigate } from 'react-router-dom';
import { UserAuthForm } from './components/user-auth-form';
import { useAuth } from './use-auth.hook';

export default function SignIn() {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <img
            src="images/auth-banner.avif"
            alt="Background Image"
            className='absolute inset-0 h-full w-full object-cover'
          />
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px] gap-4'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email and password below <br />
                to log into your account
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
}

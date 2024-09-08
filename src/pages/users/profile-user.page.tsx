import { Layout } from '@/components/custom/layout';
;
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Separator } from '@/components/ui/separator';
import { IconTool, IconUser } from '@tabler/icons-react';
import SidebarNav from '../settings/components/sidebar-nav';
import { Outlet } from 'react-router-dom';

const ProfileUserPage = () => {
    return (
        <Layout>
            <Layout.Header sticky>

                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>User Profile</h2>
                        <p className='text-muted-foreground'>
                            Lihat dan kelola informasi profil Anda di sini
                        </p>
                    </div>
                </div>
                <Separator className='my-4 lg:my-6' />
                <div className='flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <aside className='top-0 lg:sticky lg:w-1/5'>
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className='flex w-full p-1 pr-4 md:overflow-y-hidden'>
                        <Outlet />
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    );
};

const sidebarNavItems = [
    {
        title: 'Profile',
        icon: <IconUser size={18} />,
        href: '/users/detail-users',
    },
    {
        title: 'Update Password',
        icon: <IconTool size={18} />,
        href: '/users/detail-users/update-password',
    }
]


export default ProfileUserPage;

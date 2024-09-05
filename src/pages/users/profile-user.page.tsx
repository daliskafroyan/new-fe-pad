import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, useToast } from "@/components/ui/use-toast";
import { RoleData } from './list-roles.page';
import { UpdatePasswordCard } from './update-password.page';

interface UserDetail {
    id: string;
    email: string;
    client_id: string;
    status: boolean;
    next_login: number;
    is_verifikasi: boolean;
    id_roles: number;
    is_update_password: boolean;
}

interface UserDetailResponse {
    message: string;
    code: number;
    status: boolean;
    data: UserDetail;
}

interface Role {
    id: number;
    name: string;
}


const ProfileUserPage = () => {
    const userDetailQuery = useQuery<UserDetailResponse>({
        queryKey: ['user-detail'],
        queryFn: async () => {
            try {
                const response = await api.get("/users/detail-users");
                return response.data;
            } catch (error) {
                toast({
                    title: "Error",
                    description: `Failed to fetch user details: ${(error as Error).message}`,
                    variant: "destructive",
                });
                throw error;
            }
        },
    });

    const rolesQuery = useQuery<RoleData[]>({
        queryKey: ['list-roles'],
        queryFn: async () => {
            const response = await api.get("/rbac/list-roles-all");
            return response.data.list;
        },
    });

    const { toast } = useToast();

    const handlePasswordUpdate = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        if (newPassword !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'New password and confirmation do not match',
                variant: 'destructive',
            });
            return;
        }

        try {
            await api.post('/users/update/password', {
                passwordLama: oldPassword,
                konfirmasiPassword: confirmPassword,
                passwordBaru: newPassword,
            });

            toast({
                title: 'Success',
                description: 'Password updated successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update password',
                variant: 'destructive',
            });
        }
    };

    if (userDetailQuery.isLoading) {
        return (
            <Layout>
                <Layout.Header sticky>
                    <Skeleton className="h-9 w-[250px]" />
                    <div className='ml-auto flex items-center space-x-4'>
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-9 w-9 rounded-full" />
                    </div>
                </Layout.Header>

                <Layout.Body>
                    <Card className="max-w-md">
                        <CardHeader>
                            <Skeleton className="h-8 w-[200px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                </Layout.Body>
            </Layout>
        );
    }

    if (userDetailQuery.isError) {
        return <div>Error loading user details</div>;
    }

    const userDetail = userDetailQuery.data?.data;
    const roles = rolesQuery.data || [];

    const getRoleName = (roleId: number) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.nama_roles : 'Unknown Role';
    };

    return (
        <Layout>
            <Layout.Header sticky>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body>
                <div className="grid gap-6 sm:grid-cols-2">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>User Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <strong className="mb-1 sm:mb-0">Email:</strong>
                                    <span className="break-all">{userDetail?.email}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <strong className="mb-1 sm:mb-0">Status:</strong>
                                    <span>{userDetail?.status ? 'Active' : 'Inactive'}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <strong className="mb-1 sm:mb-0">Verified:</strong>
                                    <span>{userDetail?.is_verifikasi ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                    <strong className="mb-1 sm:mb-0">Role:</strong>
                                    <span>{getRoleName(userDetail?.id_roles || 0)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <UpdatePasswordCard onSubmit={handlePasswordUpdate} />
                </div>
            </Layout.Body>
        </Layout>
    );
};

export default ProfileUserPage;

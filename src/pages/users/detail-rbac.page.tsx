import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

type RBACData = {
    nama_roles: string;
    menus: {
        nama_menu: string;
        sub_menus: {
            nama_sub_menu: string | null;
            url: string;
            create_permission: boolean;
            read_permission: boolean;
            update_permission: boolean;
            delete_permission: boolean;
        }[];
    }[];
}[];

const DetailRBACPage = () => {
    const rbacQuery = useQuery<RBACData>({
        queryKey: ['rbac-details'],
        queryFn: async () => {
            const response = await api.get("/users/detail-rbac");
            return response.data.listData;
        },
    });

    if (rbacQuery.isLoading) {
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
                    {[1].map((i) => (
                        <Card key={i} className="w-full mb-8">
                            <CardHeader>
                                <Skeleton className="h-8 w-[200px]" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-[300px] w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </Layout.Body>
            </Layout>
        );
    }

    if (rbacQuery.isError) {
        return <div>Error loading data</div>;
    }

    const data = rbacQuery.data;

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
                {data?.map((roleData, index) => (
                    <Card key={index} className="w-full mb-8">
                        <CardHeader>
                            <CardTitle>RBAC Details for {roleData.nama_roles}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Menu</TableHead>
                                        <TableHead>Sub Menu</TableHead>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Create</TableHead>
                                        <TableHead>Read</TableHead>
                                        <TableHead>Update</TableHead>
                                        <TableHead>Delete</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roleData.menus.flatMap((menu) =>
                                        menu.sub_menus.map((subMenu, subIndex) => (
                                            <TableRow key={`${menu.nama_menu}-${subMenu.url}-${subIndex}`}>
                                                <TableCell>{subIndex === 0 ? menu.nama_menu : ''}</TableCell>
                                                <TableCell>{subMenu.nama_sub_menu || ''}</TableCell>
                                                <TableCell>{subMenu.url}</TableCell>
                                                <TableCell><Checkbox checked={subMenu.create_permission} disabled /></TableCell>
                                                <TableCell><Checkbox checked={subMenu.read_permission} disabled /></TableCell>
                                                <TableCell><Checkbox checked={subMenu.update_permission} disabled /></TableCell>
                                                <TableCell><Checkbox checked={subMenu.delete_permission} disabled /></TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}
            </Layout.Body>
        </Layout>
    );
};

export default DetailRBACPage;

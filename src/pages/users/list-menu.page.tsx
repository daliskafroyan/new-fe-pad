import { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

type MenuItem = {
    id: number;
    nama_menu: string;
    nama_sub_menu: string | null;
    url: string;
};

type MenuListResponse = {
    message: string;
    code: number;
    list: MenuItem[];
};

const ListMenuPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const menuListQuery = useQuery<MenuListResponse>({
        queryKey: ['menu-list'],
        queryFn: async () => {
            const response = await api.get("/rbac/list-menu");
            return response.data;
        },
    });

    const filteredMenuItems = menuListQuery.data?.list.filter(item =>
        item.nama_menu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.nama_sub_menu && item.nama_sub_menu.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.url.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (menuListQuery.isLoading) {
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
                    <Card className="w-full mb-8">
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

    if (menuListQuery.isError) {
        return <div>Error loading data</div>;
    }

    return (
        <Layout>
            <Layout.Header sticky>
                <Search placeholder="Search menus..." onChange={(e) => setSearchTerm(e.target.value)} />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body>
                <Card className="w-full mb-8">
                    <CardHeader>
                        <CardTitle>List Menu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Menu</TableHead>
                                    <TableHead>Sub Menu</TableHead>
                                    <TableHead>URL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMenuItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.nama_menu}</TableCell>
                                        <TableCell>{item.nama_sub_menu || ''}</TableCell>
                                        <TableCell>{item.url}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Layout.Body>
        </Layout>
    );
};

export default ListMenuPage;

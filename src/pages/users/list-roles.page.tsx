import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { toast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { IconCirclePlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';

type RoleData = {
    id: number;
    uuid: string;
    nama_roles: string;
    status: boolean;
};

function CreateRoleButton() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const form = useForm({
        defaultValues: {
            roleName: '',
        },
    });

    const createRoleMutation = useMutation({
        mutationFn: async (namaRoles: string) => {
            const response = await api.post("/rbac/create-roles", { namaRoles });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "New role created successfully",
            });
            setOpen(false);
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['list-roles'] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create new role",
                variant: "destructive",
            });
        },
    });

    const onSubmit = form.handleSubmit((data) => {
        if (data.roleName.trim()) {
            createRoleMutation.mutate(data.roleName.trim());
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <IconCirclePlus size={16} className="mr-2" />
                    Buat Role Baru
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buat Role Baru</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="roleName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Role</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Masukkan nama role"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={createRoleMutation.isPending}>
                                {createRoleMutation.isPending ? 'Membuat...' : 'Buat Role'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

const ListRolesPage = () => {
    const queryClient = useQueryClient();

    const rolesQuery = useQuery<RoleData[]>({
        queryKey: ['list-roles'],
        queryFn: async () => {
            const response = await api.get("/rbac/list-roles-all");
            return response.data.list;
        },
    });

    const updateRoleStatusMutation = useMutation({
        mutationFn: async ({ uuid, status }: { uuid: string; status: boolean }) => {
            const response = await api.put("/rbac/update-roles", { uuid, status });
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Role status updated successfully",
            });
            queryClient.invalidateQueries({ queryKey: ['list-roles'] });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: `Failed to update role status: ${(error as Error).message}`,
                variant: "destructive",
            });
        },
    });

    const handleStatusChange = (uuid: string, newStatus: boolean) => {
        updateRoleStatusMutation.mutate({ uuid, status: newStatus });
    };

    if (rolesQuery.isLoading) {
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
                    <Card className="w-full">
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

    if (rolesQuery.isError) {
        return <div>Error loading data</div>;
    }

    const data = rolesQuery.data;

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
                <Card className="w-full">
                    <CardHeader className='flex justify-between flex-row items-center'>
                        <CardTitle>List Roles</CardTitle>
                    <CreateRoleButton />
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>UUID</TableHead>
                                    <TableHead>Role Name</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell>{role.id}</TableCell>
                                        <TableCell>{role.uuid}</TableCell>
                                        <TableCell>{role.nama_roles}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={role.status}
                                                onCheckedChange={(checked) => handleStatusChange(role.uuid, checked as boolean)}
                                            />
                                        </TableCell>
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

export default ListRolesPage;

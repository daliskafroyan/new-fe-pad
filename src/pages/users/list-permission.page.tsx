import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconCirclePlus } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type PermissionData = {
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

type Role = {
    id: number;
    uuid: string;
    nama_roles: string;
    status: boolean;
};

type RolesResponse = {
    message: string;
    code: number;
    list: Role[];
};

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

type UpdatePermissionPayload = {
  idMenu: number;
  idRoles: number;
  createPermission: boolean;
  readPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
};

const addPermissionSchema = z.object({
  idMenu: z.number().min(1, 'Menu is required'),
  idRoles: z.number().min(1, 'Role is required'),
  createPermission: z.boolean(),
  readPermission: z.boolean(),
  updatePermission: z.boolean(),
  deletePermission: z.boolean(),
});

type AddPermissionFormValues = z.infer<typeof addPermissionSchema>;

function AddPermissionButton({ roleId, roleName }: { roleId: number, roleName: string }) {
    const [open, setOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const form = useForm<AddPermissionFormValues>({
        resolver: zodResolver(addPermissionSchema),
        defaultValues: { 
            idMenu: 0, 
            idRoles: roleId, 
            createPermission: false, 
            readPermission: false, 
            updatePermission: false, 
            deletePermission: false 
        },
    });

    const menuListQuery = useQuery<MenuListResponse>({
        queryKey: ['menu-list'],
        queryFn: async () => {
            const response = await api.get("/rbac/list-menu");
            return response.data;
        },
    });

    const addPermissionMutation = useMutation({
        mutationFn: async (data: AddPermissionFormValues) => {
            const response = await api.post("/rbac/create-permission", data);
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Permission added successfully",
            });
            form.reset({ idRoles: roleId });
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['list-permissions'] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to add permission",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (values: AddPermissionFormValues) => {
        addPermissionMutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="ml-auto">
                    <IconCirclePlus size={16} className="mr-2" />
                    Tambah Permission
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Permission for {roleName}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="idMenu"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Menu</FormLabel>
                                    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={menuOpen}
                                                    className={cn(
                                                        "w-full justify-between bg-card",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? menuListQuery.data?.list.find(
                                                            (menu) => menu.id === field.value
                                                          )?.url
                                                        : "Select menu"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command className="max-h-[300px] overflow-hidden">
                                                <CommandInput placeholder="Search menu..." />
                                                <CommandEmpty>No menu found.</CommandEmpty>
                                                    <CommandGroup>
                                                <ScrollArea className="h-[200px] overflow-auto">
                                                        {menuListQuery.data?.list.map((menu) => (
                                                            <CommandItem
                                                                key={menu.id}
                                                                value={menu.url}
                                                                onSelect={() => {
                                                                    form.setValue("idMenu", menu.id);
                                                                    setMenuOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        menu.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span>{menu.url}</span>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        {menu.nama_menu}
                                                                    </span>
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                </ScrollArea>
                                                    </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="createPermission"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Create Permission
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="readPermission"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Read Permission
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="updatePermission"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Update Permission
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deletePermission"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Delete Permission
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={addPermissionMutation.isPending}>
                                {addPermissionMutation.isPending ? 'Adding...' : 'Tambah Permission'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

const ListPermissionPage = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const rolesQuery = useQuery<RolesResponse>({
        queryKey: ['roles-list'],
        queryFn: async () => {
            const response = await api.get("/rbac/list-roles");
            return response.data;
        },
    });

    const menuListQuery = useQuery<MenuListResponse>({
        queryKey: ['menu-list'],
        queryFn: async () => {
            const response = await api.get("/rbac/list-menu");
            return response.data;
        },
    });

    const permissionQuery = useQuery<PermissionData>({
        queryKey: ['list-permissions'],
        queryFn: async () => {
            const response = await api.get("/rbac/list-permission");
            return response.data.listData;
        },
    });

    const updatePermissionMutation = useMutation({
        mutationFn: async (payload: UpdatePermissionPayload) => {
            const response = await api.post("/rbac/update-permission", payload);
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Permission updated successfully",
            });
            queryClient.invalidateQueries({ queryKey: ['list-permissions'] });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update permission",
                variant: "destructive",
            });
        },
    });

    const handlePermissionChange = (
        roleId: number,
        menuId: number,
        permissionType: 'create' | 'read' | 'update' | 'delete',
        checked: boolean
    ) => {
        const currentPermissions = permissionQuery.data?.find(
            role => role.nama_roles === rolesQuery.data?.list.find(r => r.id === roleId)?.nama_roles
        )?.menus.find(menu => menu.sub_menus.some(sub => 
            menuListQuery.data?.list.find(item => item.url === sub.url)?.id === menuId
        ))?.sub_menus.find(sub => 
            menuListQuery.data?.list.find(item => item.url === sub.url)?.id === menuId
        );

        if (currentPermissions) {
            updatePermissionMutation.mutate({
                idMenu: menuId,
                idRoles: roleId,
                createPermission: permissionType === 'create' ? checked : currentPermissions.create_permission,
                readPermission: permissionType === 'read' ? checked : currentPermissions.read_permission,
                updatePermission: permissionType === 'update' ? checked : currentPermissions.update_permission,
                deletePermission: permissionType === 'delete' ? checked : currentPermissions.delete_permission,
            });
        }
    };

    if (permissionQuery.isLoading || rolesQuery.isLoading || menuListQuery.isLoading) {
        return (<Layout>
            <Layout.Header sticky>
                <Skeleton className="h-9 w-[250px]" />
                <div className='ml-auto flex items-center space-x-4'>
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                </div>
            </Layout.Header>

            <Layout.Body>
                {[1, 2].map((i) => (
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
        </Layout>)
    }

    if (permissionQuery.isError || rolesQuery.isError || menuListQuery.isError) {
        return <div>Error loading data</div>;
    }

    const data = permissionQuery.data;

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
                {data?.map((roleData, index) => {
                    const roleId = rolesQuery.data?.list.find(r => r.nama_roles === roleData.nama_roles)?.id;
                    return (
                        <Card key={index} className="w-full mb-8">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle>Permissions for {roleData.nama_roles}</CardTitle>
                                {roleId && <AddPermissionButton roleId={roleId} roleName={roleData.nama_roles} />}
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
                                            menu.sub_menus.map((subMenu, subIndex) => {
                                                const roleId = rolesQuery.data?.list.find(r => r.nama_roles === roleData.nama_roles)?.id;
                                                const menuItem = menuListQuery.data?.list.find(item => item.url === subMenu.url);
                                                return (
                                                    <TableRow key={`${menu.nama_menu}-${subMenu.url}-${subIndex}`}>
                                                        <TableCell>{subIndex === 0 ? menu.nama_menu : ''}</TableCell>
                                                        <TableCell>{subMenu.nama_sub_menu || ''}</TableCell>
                                                        <TableCell>{subMenu.url}</TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={subMenu.create_permission}
                                                                onCheckedChange={(checked) => roleId && menuItem && handlePermissionChange(roleId, menuItem.id, 'create', checked as boolean)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={subMenu.read_permission}
                                                                onCheckedChange={(checked) => roleId && menuItem && handlePermissionChange(roleId, menuItem.id, 'read', checked as boolean)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={subMenu.update_permission}
                                                                onCheckedChange={(checked) => roleId && menuItem && handlePermissionChange(roleId, menuItem.id, 'update', checked as boolean)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={subMenu.delete_permission}
                                                                onCheckedChange={(checked) => roleId && menuItem && handlePermissionChange(roleId, menuItem.id, 'delete', checked as boolean)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    );
                })}
            </Layout.Body>
        </Layout>
    );
};

export default ListPermissionPage;

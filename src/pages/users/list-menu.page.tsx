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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { IconCirclePlus } from '@tabler/icons-react';
import { useToast } from "@/components/ui/use-toast";
import { IconInfoCircle } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const addListSchema = z.object({
    namaMenu: z.string().min(1, 'Menu name is required'),
    namaSubMenu: z.string().optional(),
    url: z.string().min(1, 'URL is required'),
    isMenu: z.boolean(),
});

type AddListFormValues = z.infer<typeof addListSchema>;

function AddListButton() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const form = useForm<AddListFormValues>({
        resolver: zodResolver(addListSchema),
        defaultValues: { namaMenu: '', namaSubMenu: '', url: '', isMenu: false },
    });

    const addListMutation = useMutation({
        mutationFn: async (data: AddListFormValues) => {
            const response = await api.post("/rbac/create-menu", data);
            return response.data;
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Menu item added successfully",
            });
            form.reset();
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ['menu-list'] });
        },
    });

    const onSubmit = (values: AddListFormValues) => {
        addListMutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                    <IconCirclePlus size={20} />
                    <span>Tambah Menu Baru</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Menu Baru</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="namaMenu"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Menu <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nama menu" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="namaSubMenu"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Sub Menu</FormLabel>
                                    <FormControl>
                                        <Input  placeholder="Nama sub menu" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL<span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="/url-menu-baru" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isMenu"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Is Menu
                                        </FormLabel>
                                        <FormDescription>
                                            Jika dicentang, menu ini tidak akan muncul dalam daftar menu.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={addListMutation.isPending}>
                                {addListMutation.isPending ? 'Menambahkan...' : 'Tambah Menu'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export type MenuItem = {
    id: number;
    nama_menu: string;
    nama_sub_menu: string | null;
    url: string;
    is_menu: boolean;
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>List Menu</CardTitle>
                    <AddListButton />
                </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Menu</TableHead>
                                    <TableHead>Sub Menu</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>
                                        Is Menu
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger>
                                                    <IconInfoCircle size={16} className="ml-1 inline-block" />
                                                </TooltipTrigger>
                                                <TooltipContent className='bg-card text-card-foreground border border-gray-200'>
                                                    <p>menu ini tidak akan muncul dalam daftar menu jika tercentang</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMenuItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.nama_menu}</TableCell>
                                        <TableCell>{item.nama_sub_menu || ''}</TableCell>
                                        <TableCell>{item.url}</TableCell>
                                        <TableCell>
                                            <Checkbox checked={item.is_menu} disabled />
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

export default ListMenuPage;

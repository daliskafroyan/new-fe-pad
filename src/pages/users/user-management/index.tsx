import { useState, useMemo } from 'react'
import { Button } from '@/components/custom/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { IconCirclePlus } from '@tabler/icons-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast, useToast } from "@/components/ui/use-toast"
import api from '@/api'
import { ColumnDef } from '@tanstack/react-table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable } from '@/pages/tasks/components/data-table'

const addUserSchema = z.object({
    email: z.string().email('Invalid email address'),
})

type AddUserFormValues = z.infer<typeof addUserSchema>

type User = {
    email: string
    client_id: string | null
    status: boolean
    next_login: number
    is_verifikasi: boolean
    is_update_password: boolean
    id_roles: number
}

type UserResponse = {
    message: string
    code: number
    status: boolean
    data: User[]
}

type Role = {
    id: number
    nama_roles: string
    status: boolean
}

type RoleResponse = {
    message: string
    code: number
    list: Role[]
}

function AddUserButton() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const form = useForm<AddUserFormValues>({
        resolver: zodResolver(addUserSchema),
        defaultValues: { email: '' },
    })

    const userRegisterMutation = useMutation({
        mutationFn: async (email: string) => {
            const response = await api.post("/users/register", { email })
            return response.data
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "User registered successfully",
            })
            form.reset()
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const onSubmit = (values: AddUserFormValues) => {
        userRegisterMutation.mutate(values.email)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                    <IconCirclePlus size={20} />
                    <span>Add New User</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter user's email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={userRegisterMutation.isPending}>
                            {userRegisterMutation.isPending ? 'Registering...' : 'Add User'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function UserManagement() {
    const usersQuery = useQuery<UserResponse>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get("/users/list-users")
            return response.data
        },
    })

    const rolesQuery = useQuery<RoleResponse>({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await api.get("/users/list-roles")
            return response.data
        },
    })

    const queryClient = useQueryClient()

    const updateRoleMutation = useMutation({
        mutationFn: async ({ clientId, roleId }: { clientId: string, roleId: number }) => {
            const response = await api.post(`/users/update-roles/${clientId}`, { id_roles: roleId })
            return response.data
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "User role updated successfully",
            })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'client_id',
            header: 'Client ID',
            cell: ({ row }) => row.original.client_id || 'N/A',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => row.original.status ? 'Active' : 'Inactive',
        },
        {
            accessorKey: 'is_verifikasi',
            header: 'Verified',
            cell: ({ row }) => row.original.is_verifikasi ? 'Yes' : 'No',
        },
        {
            accessorKey: 'id_roles',
            header: 'Role',
            cell: ({ row }) => {
                const user = row.original
                const role = rolesQuery.data?.list.find(r => r.id === user.id_roles)

                return (
                    <Select
                        defaultValue={user.id_roles.toString()}
                        onValueChange={(newValue) => {
                            if (user.client_id) {
                                updateRoleMutation.mutate({
                                    clientId: user.client_id,
                                    roleId: parseInt(newValue, 10)
                                })
                            }
                        }}
                        disabled={!user.client_id}
                    >
                        <SelectTrigger>
                            <SelectValue>{role?.nama_roles || 'Unknown Role'}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {rolesQuery.data?.list.map(role => (
                                <SelectItem key={role.id} value={role.id.toString()}>
                                    {role.nama_roles}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            },
        },
    ], [rolesQuery.data, updateRoleMutation])

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
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>User Management</h2>
                        <p className='text-muted-foreground'>
                            Here&apos;s a list of all users in the system. You can manage user from this page.
                        </p>
                    </div>
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    {usersQuery.isLoading || rolesQuery.isLoading ? (
                        <p>Loading...</p>
                    ) : usersQuery.isError || rolesQuery.isError ? (
                        <p>Error loading data: {((usersQuery.error || rolesQuery.error) as Error).message}</p>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={usersQuery.data?.data || []}
                            header={
                                <div className='flex items-center justify-end'>
                                    <AddUserButton />
                                </div>
                            }
                        />
                    )}
                </div>
            </Layout.Body>
        </Layout>
    )
}
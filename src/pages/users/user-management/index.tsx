import { useState, useMemo } from 'react'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast, useToast } from "@/components/ui/use-toast"
import api from '@/api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IconChevronLeft, IconChevronRight, IconCirclePlus, IconRefresh } from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/custom/button'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import { useLocation, useNavigate } from 'react-router-dom'
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from '@/components/ui/badge'

const addUserSchema = z.object({
    email: z.string().email('Invalid email address'),
})

type AddUserFormValues = z.infer<typeof addUserSchema>

type User = {
    uuid: string
    email: string
    client_id: string | null
    status: boolean
    next_login: number
    is_verifikasi: boolean
    is_update_password: boolean
    id_roles: number
}

type UserResponse = {
    success: boolean
    code: number
    message: string
    data: User[]
    currentPage: number
    totalPages: number
    totalData: number
    pageSize: number
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

function VerificationCheckbox({ user }: { user: User }) {
    const [openDialog, setOpenDialog] = useState(false)
    const [responseDialog, setResponseDialog] = useState<{ title: string, description: string, email?: string, passwordDefault?: string } | null>(null)
    const queryClient = useQueryClient()

    const updateVerificationMutation = useMutation({
        mutationFn: async ({ uuid }: { uuid: string }) => {
            const response = await api.get(`/users/verifikasi/${uuid}`)
            return response.data
        },
        onSuccess: (data) => {
            setResponseDialog({
                title: "Verifikasi Berhasil",
                description: data.message,
                email: user.email,
                passwordDefault: data.data.passwordDefault,
            })
        },
    })

    const handleVerificationChange = () => {
        if (user.is_verifikasi) {
            updateVerificationMutation.mutate({ uuid: user.uuid })
        } else {
            setOpenDialog(true)
        }
    }

    const confirmVerification = () => {
        updateVerificationMutation.mutate({ uuid: user.uuid })
        setOpenDialog(false)
    }

    return (
        <>
            <Checkbox
                checked={user.is_verifikasi}
                onCheckedChange={handleVerificationChange}
            />
            <Dialog open={openDialog} onOpenChange={() => {
                setOpenDialog(false)
                queryClient.invalidateQueries({ queryKey: ['users'] })
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi untuk verifikasi user</DialogTitle>
                    </DialogHeader>
                    <p>Apakah anda yakin untuk verifikasi user ini?</p>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={confirmVerification}>Confirm</Button>
                    </div>
                </DialogContent>
            </Dialog>
            {responseDialog && (
                <Dialog open={!!responseDialog} onOpenChange={() => setResponseDialog(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{responseDialog.title}</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col space-y-2">
                            <p>Email: {responseDialog.email}</p>
                            <p>Password Default: {responseDialog.passwordDefault}</p>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button onClick={() => setResponseDialog(null)}>Close</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

function ResetUserButton({ clientId }: { clientId: string | null }) {
    const [openDialog, setOpenDialog] = useState(false)
    const queryClient = useQueryClient()

    const resetUserMutation = useMutation({
        mutationFn: async (clientId: string) => {
            const response = await api.post(`/users/reset-users`, { clientId })
            return response.data
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description: "User has been reset successfully",
            })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const handleReset = () => {
        if (clientId) {
            resetUserMutation.mutate(clientId)
        }
        setOpenDialog(false)
    }

    return (
        <>
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpenDialog(true)}
                            disabled={!clientId}
                        >
                            <IconRefresh size={16} />
                            <span className="sr-only">Reset User</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Reset User</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi untuk reset user</DialogTitle>
                    </DialogHeader>
                    <p>Apakah anda yakin untuk reset user ini?</p>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleReset}>Confirm</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-[250px]" />
            </div>
            <div className="rounded-md border">
                <div className="h-12 border-b bg-muted" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4">
                        <Skeleton className="h-6 w-[40px]" />
                        <Skeleton className="h-6 w-[200px]" />
                        <Skeleton className="h-6 w-[100px]" />
                        <Skeleton className="h-6 w-[80px]" />
                        <Skeleton className="h-6 w-[60px]" />
                        <Skeleton className="h-6 w-[120px]" />
                        <Skeleton className="h-6 w-[40px]" />
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-10 w-[300px]" />
            </div>
        </div>
    )
}

export default function UserManagement() {
    const location = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(location.search)
    const page = Number(searchParams.get('page')) || 1
    const pageSize = Number(searchParams.get('pageSize')) || 10

    const usersQuery = useQuery<UserResponse>({
        queryKey: ['users', page, pageSize],
        queryFn: async () => {
            const response = await api.post("/users/list-users", {
                page: page,
                size: pageSize,
            })
            return response.data
        },
    })

    const rolesQuery = useQuery<RoleResponse>({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await api.get("/rbac/list-roles")
            return response.data
        },
    })

    const queryClient = useQueryClient()

    const updateRoleMutation = useMutation({
        mutationFn: async ({ clientId, roleId }: { clientId: string, roleId: number }) => {
            const response = await api.put(`/users/update-roles`, { idRoles: roleId.toString(), clientId: clientId })
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
            accessorKey: 'id',
            header: 'No',
        },
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
            cell: ({ row }) => (
                <Badge variant={row.original.status ? "default" : "destructive"}>
                    {row.original.status ? 'Active' : 'Inactive'}
                </Badge>
            ),
            size: 100,
        },
        {
            accessorKey: 'is_verifikasi',
            header: 'Verified',
            cell: ({ row }) =>
                <VerificationCheckbox user={row.original} />,
        },
        {
            accessorKey: 'id_roles',
            header: 'Role',
            cell: ({ row }) => {
                const user = row.original
                const role = rolesQuery.data?.list.find(r => r.id === user.id_roles)
                const isUpdating = updateRoleMutation.isPending && updateRoleMutation.variables?.clientId === user.client_id

                return (
                    <>
                        {isUpdating ? (
                            <Button variant="ghost" disabled className="w-full justify-start">
                                Updating..
                            </Button>
                        ) : (
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
                                disabled={!user.client_id || user.id_roles === 1 || isUpdating}
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
                        )}
                    </>

                )
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => <ResetUserButton clientId={row.original.client_id} />,
        },
    ], [rolesQuery.data, updateRoleMutation])

    const table = useReactTable({
        data: usersQuery.data?.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: usersQuery.data?.totalPages || -1,
    })

    const updatePage = (newPage: number) => {
        searchParams.set('page', newPage.toString())
        navigate(`${location.pathname}?${searchParams.toString()}`)
    }

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
                        <TableSkeleton />
                    ) : usersQuery.isError || rolesQuery.isError ? (
                        <p>Error loading data: {((usersQuery.error || rolesQuery.error) as Error).message}</p>
                    ) : (
                        <div className="w-full">
                            <div className="flex items-center py-4">
                                <AddUserButton />
                            </div>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow
                                                    key={row.id}
                                                    data-state={row.getIsSelected() && "selected"}
                                                >
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={columns.length}
                                                    className="h-24 text-center"
                                                >
                                                    No results.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex items-center justify-between space-x-2 py-4">
                                <div className="leading-none text-muted-foreground">
                                    Menampilkan {usersQuery.data?.data.length} dari {usersQuery.data?.totalData} hasil
                                </div>
                                <Pagination className='flex items-center space-x-2'>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <Button
                                                className='mr-2'
                                                onClick={() => updatePage(Math.max(page - 1, 1))}
                                                disabled={page === 1}
                                            >
                                                <IconChevronLeft size={16} />
                                            </Button>
                                        </PaginationItem>
                                        {[...Array(usersQuery.data?.totalPages)].map((_, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    onClick={() => updatePage(index + 1)}
                                                    isActive={page === index + 1}
                                                >
                                                    {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <Button
                                                className='ml-2'
                                                onClick={() => updatePage(page + 1)}
                                                disabled={page >= (usersQuery.data?.totalPages || 0)}
                                            >
                                                <IconChevronRight size={16} />
                                            </Button>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    )}
                </div>
            </Layout.Body>
        </Layout>
    )
}
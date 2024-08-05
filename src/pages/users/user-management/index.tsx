import { useState } from 'react'
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
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast"
import api from '@/api'

const addUserSchema = z.object({
    email: z.string().email('Invalid email address'),
})

type AddUserFormValues = z.infer<typeof addUserSchema>


export default function UserManagement() {
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

    const form = useForm<AddUserFormValues>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            email: '',
        },
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
        },
    })

    const onSubmit = (values: AddUserFormValues) => {
        userRegisterMutation.mutate(values.email)
    }

    return (
        <Layout>
            {/* ===== Top Heading ===== */}
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
                    <div className="flex justify-end">
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
                    </div>
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>

                    {/* <DataTable data={tasks} columns={columns} /> */}
                </div>
            </Layout.Body>
        </Layout>
    )
}
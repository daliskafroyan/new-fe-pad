import { Layout } from '@/components/custom/layout'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const monthlyExpensesData = [
    { month: 'Jan', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Feb', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Mar', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Apr', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'May', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Jun', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Jul', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Aug', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Sep', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Oct', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Nov', expenses: Math.floor(Math.random() * 3000) + 500 },
    { month: 'Dec', expenses: Math.floor(Math.random() * 3000) + 500 },
]

export default function Dashboard() {
    return (
        <Layout>
            {/* ===== Top Heading ===== */}
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>

                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            {/* ===== Main ===== */}
            <Layout.Body>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <h1 className='text-2xl font-bold tracking-tight'>Monthly Expenses</h1>

                </div>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                    <Card className='col-span-4'>
                        <CardHeader>
                            <CardTitle>Monthly Expenses</CardTitle>
                            <CardDescription>
                                Your expenses over the past year
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={monthlyExpensesData}>
                                    <XAxis
                                        dataKey="month"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="expenses"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className='col-span-3'>
                        <CardHeader>
                            <CardTitle>Expense Summary</CardTitle>
                            <CardDescription>
                                Total expenses for the current year
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>$45,231.89</div>
                            <p className='text-xs text-muted-foreground'>
                                +20.1% from last year
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </Layout.Body>
        </Layout>
    )
}

const topNav = [
    {
        title: 'Overview',
        href: 'dashboard/overview',
        isActive: true,
    },
    {
        title: 'Customers',
        href: 'dashboard/customers',
        isActive: false,
    },
    {
        title: 'Products',
        href: 'dashboard/products',
        isActive: false,
    },
    {
        title: 'Settings',
        href: 'dashboard/settings',
        isActive: false,
    },
]
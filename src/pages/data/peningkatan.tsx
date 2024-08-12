import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'

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

const expenseCategoriesData = [
    { name: 'Housing', value: 1200 },
    { name: 'Transportation', value: 400 },
    { name: 'Food', value: 600 },
    { name: 'Utilities', value: 300 },
    { name: 'Entertainment', value: 200 },
    { name: 'Healthcare', value: 500 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

export default function Dashboard() {
    return (
        <Layout>
            {/* ===== Top Heading ===== */}
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <Search />
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            {/* ===== Main ===== */}
            <Layout.Body>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <h1 className='text-2xl font-bold tracking-tight'>Expense Analysis</h1>
                    <div className='flex items-center space-x-2'>
                        <Button>Download</Button>
                    </div>
                </div>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
                    <Card className='col-span-1'>
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
                    <Card className='col-span-1'>
                        <CardHeader>
                            <CardTitle>Expense Categories</CardTitle>
                            <CardDescription>
                                Distribution of expenses by category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={expenseCategoriesData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {expenseCategoriesData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
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
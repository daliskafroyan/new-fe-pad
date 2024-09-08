import { Bar, ComposedChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, Legend, Line, BarChart } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { formatLargeNumber } from "@/lib/utils";

type PajakProvItem = {
    jns_pemda: string;
    kode_jenis: string;
    nama_daerah: string;
    nama_jenis: string;
    persentase: number;
    realisasi: number;
    tahun: number;
    target: number;
};

type PajakProvData = {
    data_terendah: PajakProvItem[];
    data_tertinggi: PajakProvItem[];
};

type PeringkatPajakProvChartProps = {
    data: PajakProvData | null;
    isLoading: boolean;
    selectedYear: number;
};

const chartConfig = {
    realisasi: {
        label: "Realisasi",
        color: "hsl(var(--chart-1))",
    },
    target: {
        label: "Target",
        color: "hsl(var(--chart-2))",
    },
    persentase: {
        label: "Persentase",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function MergedDataCard({ data }: { data: PajakProvItem[] }) {
    const chartData = data.map(item => ({
        name: item.nama_daerah,
        realisasi: item.realisasi,
        target: item.target,
        persentase: item.persentase
    })).sort((a, b) => b.persentase - a.persentase);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Peringkat Pajak Provinsi</CardTitle>
                <CardDescription>Perbandingan Realisasi, Target, dan Persentase</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={600}>
                        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" interval={0} height={100} />
                            <YAxis yAxisId="left" orientation="left" type="number" tickFormatter={(value) => formatLargeNumber(value)} />
                            <YAxis yAxisId="right" orientation="right" type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="realisasi" name="Realisasi" fill={chartConfig.realisasi.color} />
                            <Bar yAxisId="left" dataKey="target" name="Target" fill={chartConfig.target.color} />
                            <Line yAxisId="right" type="monotone" dataKey="persentase" name="Persentase" stroke={chartConfig.persentase.color} dot={{ fill: chartConfig.persentase.color }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function SkeletonLoader() {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-40 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function PersentaseChart({ data }: { data: PajakProvItem[] }) {
    const chartData = data.map(item => ({
        name: item.nama_daerah,
        persentase: item.persentase
    })).sort((a, b) => b.persentase - a.persentase);

    return (
        <Card className="w-full mt-4">
            <CardHeader>
                <CardTitle>Persentase Realisasi Pajak Provinsi</CardTitle>
                <CardDescription>Persentase Realisasi terhadap Target</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={600}>
                        <BarChart data={chartData} layout="horizontal">
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" interval={0} height={100} />
                            <YAxis type="number" tickFormatter={(value) => `${value}%`} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Bar dataKey="persentase" name="Persentase" fill={chartConfig.persentase.color}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.persentase >= 100 ? "green" : "red"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export function PeringkatPajakProvChart({ data, isLoading, selectedYear }: PeringkatPajakProvChartProps) {
    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (!data || (!data.data_tertinggi.length && !data.data_terendah.length)) {
        return <div>No data available</div>;
    }

    const mergedData = [...data.data_tertinggi, ...data.data_terendah];

    return (
        <>
            <h3 className="text-lg font-bold">Data Peringkat Pajak Provinsi Tahun {selectedYear}</h3>
            <MergedDataCard data={mergedData} />
            <PersentaseChart data={mergedData} />
        </>
    );
}
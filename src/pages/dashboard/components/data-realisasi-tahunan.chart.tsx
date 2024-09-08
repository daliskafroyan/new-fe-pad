import { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

type DataRealisasiItem = {
    kode_akun: string;
    nama_akun: string;
    persentase_realisasi: number;
    realisasi: number;
    tahun: number;
    target: number;
};

type DataRealisasiTahunanChartProps = {
    data: DataRealisasiItem[];
    isLoading: boolean;
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
} satisfies ChartConfig;

function DataCard({ item }: { item: DataRealisasiItem }) {
    const chartData = [
        { name: 'Realisasi', value: item.realisasi },
        { name: 'Target', value: item.target },
    ];

    const isAboveTarget = item.persentase_realisasi > 100;
    const difference = Math.abs(item.persentase_realisasi - 100).toFixed(2);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{item.kode_akun}</CardTitle>
                <CardDescription>{item.nama_akun}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickFormatter={(value) => formatLargeNumber(value)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Bar dataKey="value" radius={8}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={chartConfig[entry.name.toLowerCase() as keyof typeof chartConfig].color}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    {isAboveTarget ? (
                        <>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            Melebihi target sebanyak {difference}%
                        </>
                    ) : (
                        <>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            Dibawah target sebanyak {difference}%
                        </>
                    )}
                </div>
                <div className="leading-none text-muted-foreground">
                    Realisasi: {item.persentase_realisasi.toFixed(2)}% dari target awal
                </div>
            </CardFooter>
        </Card>
    );
}

function SkeletonLoader() {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4].map((i) => (
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

export function DataRealisasiTahunanChart({ data, isLoading }: DataRealisasiTahunanChartProps) {
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    useEffect(() => {
        if (data.length > 0 && !selectedYear) {
            setSelectedYear(data[0].tahun);
        }
    }, [data, selectedYear]);

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    const years = [...new Set(data.map(item => item.tahun))];
    const selectedData = data.filter(item => item.tahun === selectedYear).filter(item => item.kode_akun !== '4.1');

    return (
        <div className="space-y-4">
            <Select
                onValueChange={(value) => setSelectedYear(Number(value))}
                value={selectedYear?.toString()}
            >
                <SelectTrigger className="w-[180px] bg-card">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedData.map((item) => (
                    <DataCard key={item.kode_akun} item={item} />
                ))}
            </div>
        </div>
    );
}

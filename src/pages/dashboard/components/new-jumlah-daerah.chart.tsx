import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
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
import { DataRealisasiItem, JumlahDaerahItem } from '..';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils"; // Add this import

type DataRealisasiTahunanChartProps = {
    data: DataRealisasiItem[];
    isLoading: boolean;
};

type RealisasiComparisonChartProps = {
    data: JumlahDaerahItem[];
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
    sudahRealisasi: {
        label: "Sudah Realisasi",
        color: "hsl(var(--chart-1))",
    },
    belumRealisasi: {
        label: "Belum Realisasi",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

const formatToMillions = (value: number) => {
    return (value / 1000000000).toFixed(2);
};

const CustomLabel = ({ x, y, width, value }: any) => {
    return (
        <text x={x + width / 2} y={y - 10} fill="#666" textAnchor="middle" dominantBaseline="middle">
            {typeof value === 'number' ? formatToMillions(value) + 'M' : value}
        </text>
    );
};

const CustomLabelText = ({ x, y, width, value }: any) => {
    return (
        <text x={x + width / 2} y={y - 10} fill="#666" textAnchor="middle" dominantBaseline="middle">
            {value}
        </text>
    );
};

export function CombinedCharts({ dataRealisasi, dataJumlahDaerah, isLoading }: {
    dataRealisasi: DataRealisasiItem[];
    dataJumlahDaerah: JumlahDaerahItem[];
    isLoading: boolean;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NewJumlahDaerahChart data={dataRealisasi} isLoading={isLoading} />
            <RealisasiComparisonChart data={dataJumlahDaerah} isLoading={isLoading} />
        </div>
    );
}

export function NewJumlahDaerahChart({ data, isLoading }: DataRealisasiTahunanChartProps) {
    const filteredData = data.filter(item => item.kode_akun === "4.1");
    const chartData = filteredData.map(item => ({
        tahun: item.tahun,
        realisasi: item.realisasi,
        target: item.target,
    }));

    if (isLoading) {
        return (
            <Card className={cn("h-full", isLoading && "flex flex-col")}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className={cn("h-full", isLoading && "flex flex-col")}>
            <CardHeader>
                <CardTitle>Pertumbuhan Target dan Realisasi Pendapatan Daerah per Tahun</CardTitle>
                <CardDescription>
                    Tahun {Math.min(...chartData.map(item => item.tahun))} - {Math.max(...chartData.map(item => item.tahun))}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} width={300} height={300}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tahun"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="realisasi" fill={chartConfig.realisasi.color} radius={4} name={chartConfig.realisasi.label}>
                            <LabelList dataKey="realisasi" content={<CustomLabel />} />
                        </Bar>
                        <Bar dataKey="target" fill={chartConfig.target.color} radius={4} name={chartConfig.target.label}>
                            <LabelList dataKey="target" content={<CustomLabel />} />
                        </Bar>
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="square"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export function RealisasiComparisonChart({ data, isLoading }: RealisasiComparisonChartProps) {
    const chartData = data.map(item => ({
        tahun: item.tahun,
        sudahRealisasi: item.jumlah_daerah_realisasi,
        belumRealisasi: item.jumlah_daerah_belum_realisasi,
    }));

    if (isLoading) {
        return (
            <Card className={cn("h-full", isLoading && "flex flex-col")}>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("h-full", isLoading && "flex flex-col")}>
            <CardHeader>
                <CardTitle>Perbandingan Daerah yang Sudah dan Belum Realisasi</CardTitle>
                <CardDescription>
                    Tahun {Math.min(...chartData.map(item => item.tahun))} - {Math.max(...chartData.map(item => item.tahun))}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} width={300} height={300}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tahun"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="sudahRealisasi" fill={chartConfig.sudahRealisasi.color} radius={4} name={chartConfig.sudahRealisasi.label}>
                            <LabelList dataKey="sudahRealisasi" content={<CustomLabelText />} />
                        </Bar>
                        <Bar dataKey="belumRealisasi" fill={chartConfig.belumRealisasi.color} radius={4} name={chartConfig.belumRealisasi.label}>
                            <LabelList dataKey="belumRealisasi" content={<CustomLabelText />} />
                        </Bar>
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="square"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

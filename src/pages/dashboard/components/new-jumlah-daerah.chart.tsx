import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Legend, Line, ComposedChart } from "recharts";
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCurrentPng } from 'recharts-to-png';
import FileSaver from 'file-saver';

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
        color: "red",
    },
    target: {
        label: "Target",
        color: "green",
    },
    sudahRealisasi: {
        label: "Sudah Realisasi",
        color: "red",
    },
    belumRealisasi: {
        label: "Belum Realisasi",
        color: "green",
    },
    percentageRealisasi: {
        label: "Persentase Realisasi",
        color: "black",
    },
} satisfies ChartConfig;

const formatToTrillions = (value: number) => {
    const trillion = 1000000000000;
    if (value >= trillion) {
        return (value / trillion).toFixed(2) + 'T';
    } else {
        return (value / 1000000000).toFixed(2) + 'B';
    }
};

const CustomLabel = ({ x, y, width, value }: any) => {
    return (
        <text x={x + width / 2} y={y - 10} fill="#666" textAnchor="middle" dominantBaseline="middle">
            {typeof value === 'number' ? formatToTrillions(value) : value}
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
    const [getPng, { ref, isLoading: isPngLoading }] = useCurrentPng();
    const filteredData = data.filter(item => item.kode_akun === "4.1");
    const chartData = filteredData.map(item => ({
        tahun: item.tahun,
        realisasi: item.realisasi,
        target: item.target,
        persentase: item.persentase_realisasi,
    }));

    const handleDownload = async () => {
        const png = await getPng();
        if (png) {
            FileSaver.saveAs(png, 'pertumbuhan-target-realisasi.png');
        }
    };

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
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Pertumbuhan Target dan Realisasi Pendapatan Asli Daerah per Tahun</CardTitle>
                    <CardDescription>
                        Tahun {Math.min(...chartData.map(item => item.tahun))} - {Math.max(...chartData.map(item => item.tahun))}
                    </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={handleDownload} disabled={isPngLoading}>
                    <Download className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ComposedChart ref={ref} data={chartData} width={300} height={300}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tahun"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => formatToTrillions(value)}
                            width={80}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value}%`}
                            domain={[0, 100]}
                            width={50}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar yAxisId="left" dataKey="realisasi" fill={chartConfig.realisasi.color} radius={4} name={chartConfig.realisasi.label}>
                            <LabelList dataKey="realisasi" content={<CustomLabel />} />
                        </Bar>
                        <Bar yAxisId="left" dataKey="target" fill={chartConfig.target.color} radius={4} name={chartConfig.target.label}>
                            <LabelList dataKey="target" content={<CustomLabel />} />
                        </Bar>
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="persentase"
                            stroke="hsl(var(--chart-3))"
                            name="Persentase Realisasi"
                            dot={{ fill: 'hsl(var(--chart-3))' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="square"
                        />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export function RealisasiComparisonChart({ data, isLoading }: RealisasiComparisonChartProps) {
    const [getPng, { ref, isLoading: isPngLoading }] = useCurrentPng();
    const chartData = data.map(item => ({
        tahun: item.tahun,
        sudahRealisasi: item.jumlah_daerah_realisasi,
        belumRealisasi: item.jumlah_daerah_belum_realisasi,
    }));

    const handleDownload = async () => {
        const png = await getPng();
        if (png) {
            FileSaver.saveAs(png, 'perbandingan-realisasi-daerah.png');
        }
    };

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
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Perbandingan Daerah yang Sudah dan Belum Realisasi</CardTitle>
                    <CardDescription>
                        Tahun {Math.min(...chartData.map(item => item.tahun))} - {Math.max(...chartData.map(item => item.tahun))}
                    </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={handleDownload} disabled={isPngLoading}>
                    <Download className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart ref={ref} data={chartData} width={300} height={300}>
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

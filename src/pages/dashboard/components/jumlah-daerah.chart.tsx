import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadialBarChart, RadialBar, PolarRadiusAxis, Label, PolarAngleAxis, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CheckCircle, TrendingUp } from 'lucide-react';
import { formatLargeNumber } from "@/lib/utils";

type JumlahDaerahItem = {
    jumlah_daerah: number;
    jumlah_daerah_belum_realisasi: number;
    jumlah_daerah_belum_target: number;
    jumlah_daerah_realisasi: number;
    jumlah_daerah_target: number;
    persentase_belum_r: string;
    persentase_belum_t: string;
    persentase_sudah_r: string;
    persentase_sudah_t: string;
    tahun: number;
};

type JumlahDaerahChartProps = {
    data: JumlahDaerahItem[];
    isLoading: boolean;
};

const chartConfig = {
    realisasi: {
        label: "Realisasi",
        color: "hsl(var(--chart-1))",
    },
    belumRealisasi: {
        label: "Belum Realisasi",
        color: "hsl(var(--chart-2))",
    },
    target: {
        label: "Target",
        color: "hsl(var(--chart-3))",
    },
    belumTarget: {
        label: "Belum Target",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

function SkeletonLoader() {
    return (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function JumlahDaerahChart({ data, isLoading }: JumlahDaerahChartProps) {
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

    const selectedData = data.find(item => item.tahun === selectedYear) || data[0];

    const realisasiData = [
        { name: 'Daerah Realisasi', value: selectedData.jumlah_daerah_realisasi },
        { name: 'Daerah Belum Realisasi', value: selectedData.jumlah_daerah_belum_realisasi },
    ];

    const targetData = [
        { name: 'Daerah Target', value: selectedData.jumlah_daerah_target },
        { name: 'Daerah Belum Target', value: selectedData.jumlah_daerah_belum_target },
    ];

    const radialData = [
        { name: 'Realisasi', value: parseFloat(selectedData.persentase_sudah_r), fill: '#0088FE' },
    ];


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
                    {data.map((item) => (
                        <SelectItem key={item.tahun} value={item.tahun.toString()}>
                            {item.tahun}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className='flex flex-col h-[400px]'>
                    <CardHeader>
                        <CardTitle>Pertumbuhan Target dan Realisasi Pendapatan Daerah per Tahun</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* <ResponsiveContainer width="100%" height={250}>
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="60%"
                                outerRadius="80%"
                                barSize={10}
                                data={radialData}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <PolarAngleAxis
                                    type="number"
                                    domain={[0, 100]}
                                    angleAxisId={0}
                                    tick={false}
                                />
                                <RadialBar
                                    background
                                    dataKey="value"
                                    cornerRadius={30}
                                    fill="#0088FE"
                                />
                                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-2xl font-bold"
                                                        >
                                                            {radialData[0].value.toFixed(2)}%
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </PolarRadiusAxis>
                            </RadialBarChart>
                        </ResponsiveContainer> */}
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                            {parseInt(selectedData.persentase_sudah_r) === 100 ? (
                                <>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    Target tercapai
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="h-4 w-4 text-blue-500" />
                                    Sedang Berjalan
                                </>
                            )}
                        </div>
                        <div className="leading-none text-muted-foreground">
                            {parseInt(selectedData.persentase_sudah_r) === 100
                                ? "100% of target reached"
                                : `Tersisa ${(100 - parseFloat(selectedData.persentase_sudah_r)).toFixed(2)}% untuk mencapai target`
                            }
                        </div>
                    </CardFooter>
                </Card>

                <Card className='flex flex-col h-[400px]'>
                    <CardHeader>
                        <CardTitle>Jumlah Daerah Realisasi</CardTitle>
                    </CardHeader>
                    <CardContent className='p-0 mt-auto'>
                        <ChartContainer config={chartConfig}>
                            <BarChart data={realisasiData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis
                                    tickFormatter={(value) => formatLargeNumber(value)}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {realisasiData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={chartConfig[index === 0 ? 'realisasi' : 'belumRealisasi'].color}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
                        <div className="leading-none text-muted-foreground">
                            Total Daerah: {selectedData.jumlah_daerah}
                        </div>
                    </CardFooter>
                </Card>

                <Card className='flex flex-col h-[400px]'>
                    <CardHeader>
                        <CardTitle>Jumlah Daerah Target</CardTitle>
                    </CardHeader>
                    <CardContent className='p-0 mt-auto'>
                        <ChartContainer config={chartConfig} >
                            <BarChart data={targetData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis
                                    tickFormatter={(value) => formatLargeNumber(value)}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {targetData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={chartConfig[index === 0 ? 'target' : 'belumTarget'].color}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm mt-auto">
                        <div className="leading-none text-muted-foreground">
                            Total Daerah: {selectedData.jumlah_daerah}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
;
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import api from '@/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCombobox } from 'downshift';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, BarChart, Cell } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from '@/pages/tasks/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download } from 'lucide-react';
import { formatLargeNumber } from '@/lib/utils';

function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

type ProvinsiItem = {
    is_prop: boolean;
    id_prop: number;
    id_daerah: number;
    nama_daerah: string;
    logo: string;
    kode_ddn: string;
    kode_ddn_2: string;
    kode_prov_djpk: string;
    kode_kab_djpk: string;
    jns_pemda: string;
    kode_prop: string;
    kode_kab: string;
};

type ProvinsiResponse = {
    success: boolean;
    code: number;
    message: string;
    data: ProvinsiItem[];
};

type DaerahItem = {
    is_prop: boolean;
    id_prop: number;
    id_daerah: number;
    nama_daerah: string;
    logo: string;
    kode_ddn: string;
    kode_ddn_2: string;
    kode_prov_djpk: string;
    kode_kab_djpk: string;
    jns_pemda: string;
    kode_prop: string;
    kode_kab: string;
};

type DaerahResponse = {
    success: boolean;
    code: number;
    message: string;
    data: DaerahItem[];
};

type ChartData = {
    jns_pemda: string;
    kode_akun: string;
    nama_akun: string;
    nama_daerah: string;
    persentase: number;
    realisasi: number;
    tahun: number;
    target: number;
};

function RealisasiPersentaseChart({ data }: { data: ChartData[] }) {
    const chartData = data.map(item => ({
        name: item.nama_akun,
        persentase: item.persentase
    })).sort((a, b) => b.persentase - a.persentase);

    return (
        <Card className="mt-8">
            <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Persentase Realisasi Pajak per Jenis</h3>
                <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" interval={0} height={100} />
                            <YAxis type="number" tickFormatter={(value) => `${value}%`} />
                            <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                            <Legend />
                            <Bar dataKey="persentase" name="Persentase Realisasi" fill="#8884d8">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.persentase >= 100 ? "#4CAF50" : "#FF5722"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

function RealisasiPersentaseChartSkeleton() {
    return (
        <Card className="mt-8">
            <CardContent className="p-6">
                <Skeleton className="h-6 w-64 mb-4" />
                <div className="h-[500px]">
                    <Skeleton className="w-full h-full" />
                </div>
            </CardContent>
        </Card>
    );
}

const columns: ColumnDef<ChartData>[] = [
    {
        accessorKey: "kode_akun",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Kode Akun
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "nama_akun",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama Akun
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "target",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Target
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => formatLargeNumber(row.getValue("target")),
        sortingFn: "basic",
    },
    {
        accessorKey: "realisasi",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Realisasi
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => formatLargeNumber(row.getValue("realisasi")),
        sortingFn: "basic",
    },
    {
        accessorKey: "persentase",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Persentase
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => `${row.getValue<number>("persentase").toFixed(2)}%`,
        sortingFn: "basic",
    },
];

function downloadCSV(data: ChartData[]) {
    const headers = ["Kode Akun", "Nama Akun", "Target", "Realisasi", "Persentase"];
    const csvContent = [
        headers.join(","),
        ...data.map(row =>
            [row.kode_akun, row.nama_akun, row.target, row.realisasi, `${row.persentase.toFixed(2)}%`].join(",")
        )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "data_pajak_perdaerah.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default function DataPendapatanPeringkat() {
    const years = [2021, 2022, 2023];
    const [selectedYear, setSelectedYear] = useState<number>(years[0]);
    const [selectedProvinsi, setSelectedProvinsi] = useState<string>('');
    const [provinsiList, setProvinsiList] = useState<ProvinsiItem[]>([]);
    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce(inputValue, 300);

    const [daerahList, setDaerahList] = useState<DaerahItem[]>([]);
    const [selectedDaerah, setSelectedDaerah] = useState<string>('');
    const [daerahInputValue, setDaerahInputValue] = useState('');
    const debouncedDaerahInputValue = useDebounce(daerahInputValue, 300);

    const [chartData, setChartData] = useState<ChartData[]>([]);

    const provinsiMutation = useMutation({
        mutationFn: (search: string) =>
            api.post<ProvinsiResponse>('/master/daerah/provinsi', { namaDaerah: search }),
        onSuccess: (data) => {
            setProvinsiList(data.data.data);
        },
        onError: (error) => {
            console.error('Error fetching provinsi list:', error);
        },
    });

    const daerahMutation = useMutation({
        mutationFn: (search: string) =>
            api.post<DaerahResponse>('/master/daerah/kabkota', {
                namaDaerah: search,
                idProp: parseInt(selectedProvinsi),
            }),
        onSuccess: (data) => {
            setDaerahList(data.data.data);
        },
        onError: (error) => {
            console.error('Error fetching daerah list:', error);
        },
    });

    const chartDataMutation = useMutation({
        mutationFn: () =>
            api.post('/pendapatan/peringkat/data-pajak-perdaerah', {
                tahun: selectedYear,
                idDaerah: parseInt(selectedDaerah),
            }),
        onSuccess: (data) => {
            setChartData(data.data.data);
        },
        onError: (error) => {
            console.error('Error fetching chart data:', error);
        },
    });

    const {
        isOpen,
        getMenuProps,
        getInputProps,
        getItemProps,
        highlightedIndex,
        selectedItem,
        reset: resetProvinsiCombobox,
    } = useCombobox({
        items: provinsiList,
        onInputValueChange: ({ inputValue }) => {
            setInputValue(inputValue || '');
            setDaerahInputValue('');
            setSelectedDaerah('');
        },
        itemToString: (item) => item?.nama_daerah || '',
        onSelectedItemChange: ({ selectedItem }) => {
            setSelectedProvinsi(selectedItem?.id_prop.toString() || '');
            setDaerahInputValue('');
            setSelectedDaerah('');
        },
    });

    const daerahCombobox = useCombobox<DaerahItem>({
        items: daerahList,
        onInputValueChange: ({ inputValue }) => {
            setDaerahInputValue(inputValue || '');
        },
        itemToString: (item) => item?.nama_daerah || '',
        onSelectedItemChange: ({ selectedItem }) => {
            setSelectedDaerah(selectedItem?.id_daerah.toString() || '');
        },
    });

    const fetchProvinsiList = (search: string) => {
        provinsiMutation.mutate(search);
    };

    const fetchDaerahList = (search: string) => {
        if (!selectedProvinsi) return;
        daerahMutation.mutate(search);
    };

    const handleSearch = () => {
        if (!selectedYear || !selectedDaerah) return;
        chartDataMutation.mutate();
    };

    const handleReset = () => {
        setSelectedProvinsi('');
        setSelectedDaerah('');
        setInputValue('');
        setDaerahInputValue('');
        setChartData([]);
        resetProvinsiCombobox();
        daerahCombobox.reset();
        setProvinsiList([]);
        setDaerahList([]);
    };

    const formatLargeNumber = (value: number) => {
        if (value >= 1e9) return (value / 1e9).toFixed(1) + ' Miliar';
        if (value >= 1e6) return (value / 1e6).toFixed(1) + ' Juta';
        if (value >= 1e3) return (value / 1e3).toFixed(1) + ' K';
        return value.toString();
    };

    useEffect(() => {
        fetchProvinsiList(debouncedInputValue);
    }, [debouncedInputValue]);

    useEffect(() => {
        if (selectedProvinsi) {
            fetchDaerahList(debouncedDaerahInputValue);
        }
    }, [selectedProvinsi, debouncedDaerahInputValue]);

    useEffect(() => {
        setSelectedDaerah('');
        setDaerahList([]);
        if (selectedProvinsi) {
            daerahMutation.mutate('');
        }
    }, [selectedProvinsi]);

    return (
        <Layout className='h-[100vh]'>
            <Layout.Header>
                <div className='ml-auto flex items-center space-x-4'>

                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <h1 className='text-2xl font-bold tracking-tight'>Data Pendapatan Peringkat</h1>
                </div>

                <div className='space-y-4'>
                    <div className='flex space-x-4'>
                        <Select
                            value={selectedYear.toString()}
                            onValueChange={(value) => setSelectedYear(Number(value))}
                        >
                            <SelectTrigger className="w-[180px] bg-card">
                                <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className='relative'>
                            <Input
                                {...getInputProps()}
                                type="text"
                                placeholder="Cari Provinsi"
                                className="w-[300px] bg-card"
                            />
                            {isOpen && <ul {...getMenuProps()} className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto">
                                {
                                    provinsiList.map((provinsi, index) => (
                                        <li
                                            key={provinsi.id_prop}
                                            {...getItemProps({ item: provinsi, index })}
                                            className={`px-3 py-2 ${highlightedIndex === index ? 'bg-blue-100' : ''
                                                } ${selectedItem === provinsi ? 'font-bold' : ''}`}
                                        >
                                            {provinsi.nama_daerah}
                                        </li>
                                    ))
                                }
                            </ul>}
                        </div>

                        <div className='relative'>
                            <Input
                                {...daerahCombobox.getInputProps()}
                                type="text"
                                placeholder="Cari Kabupaten/Kota"
                                className="w-[300px] bg-card"
                                disabled={!selectedProvinsi}
                            />
                            {daerahCombobox.isOpen && <ul {...daerahCombobox.getMenuProps()} className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto">
                                {
                                    daerahList.map((daerah, index) => (
                                        <li
                                            key={daerah.id_daerah}
                                            {...daerahCombobox.getItemProps({ item: daerah, index })}
                                            className={`px-3 py-2 ${daerahCombobox.highlightedIndex === index ? 'bg-blue-100' : ''
                                                } ${daerahCombobox.selectedItem === daerah ? 'font-bold' : ''}`}
                                        >
                                            {daerah.nama_daerah}
                                        </li>
                                    ))
                                }
                            </ul>}
                        </div>

                        <Button
                            onClick={handleSearch}
                            disabled={chartDataMutation.isPending || !selectedYear || !selectedDaerah}
                        >
                            {chartDataMutation.isPending ? 'Loading...' : 'Cari'}
                        </Button>
                        <Button
                            onClick={handleReset}
                            variant="outline"
                        >
                            Reset
                        </Button>
                    </div>

                    <Card className="mt-8">
                        <CardContent className="p-6">
                            {chartDataMutation.isPending ? (
                                <div className="h-[500px]">
                                    <Skeleton className="w-full h-full" />
                                </div>
                            ) : chartData.length > 0 ? (
                                <div className="h-[500px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart
                                            data={chartData}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="nama_akun" angle={-45} textAnchor="end" interval={0} height={100} />
                                            <YAxis yAxisId="left" tickFormatter={formatLargeNumber} />
                                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                                            <Tooltip
                                                formatter={(value, name) => {
                                                    if (name === "persentase") return `${Number(value).toFixed(2)}%`;
                                                    return formatLargeNumber(Number(value));
                                                }}
                                            />
                                            <Legend />
                                            <Bar yAxisId="left" dataKey="target" fill="#8884d8" name="Target" />
                                            <Bar yAxisId="left" dataKey="realisasi" fill="#82ca9d" name="Realisasi" />
                                            <Line yAxisId="right" type="monotone" dataKey="persentase" stroke="#ff7300" name="Persentase" />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[700px]">
                                    <p className="text-lg text-gray-500">
                                        Silakan pilih tahun dan daerah, lalu klik 'Cari' untuk menampilkan data.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {chartDataMutation.isPending ? (
                        <RealisasiPersentaseChartSkeleton />
                    ) : chartData.length > 0 ? (
                        <>
                            <RealisasiPersentaseChart data={chartData} />
                            <Card className="mt-8">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Data Pajak per Daerah</h3>
                                        <Button onClick={() => downloadCSV(chartData)}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download CSV
                                        </Button>
                                    </div>
                                    <DataTable
                                        columns={columns}
                                        data={chartData}
                                        rowsPerPage={20}
                                    />
                                </CardContent>
                            </Card>
                        </>
                    ) : null}
                </div>
            </Layout.Body>
        </Layout>
    );
}


import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Download, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatLargeNumber } from '@/lib/utils'
import { useCurrentPng } from 'recharts-to-png'
import FileSaver from 'file-saver'
import { DataTable } from '@/pages/tasks/components/data-table'
import { ColumnDef } from '@tanstack/react-table'
import * as XLSX from 'xlsx'

type DataRealisasiItem = {
  kode_akun: string
  nama_akun: string
  persentase_realisasi: number
  realisasi: number
  tahun: number
  target: number
}

type DataRealisasiTahunanChartProps = {
  data: DataRealisasiItem[]
  isLoading: boolean
  selectedYear: number
}

const chartConfig = {
  realisasi: {
    label: 'Realisasi',
    color: 'red',
  },
  target: {
    label: 'Target',
    color: 'green',
  },
} satisfies ChartConfig

function DataCard({ item }: { item: DataRealisasiItem }) {
  const [getPng, { ref, isLoading }] = useCurrentPng()
  const chartData = [
    { name: 'Realisasi', value: item.realisasi },
    { name: 'Target', value: item.target },
  ]

  const isAboveTarget = item.persentase_realisasi > 100
  const difference = Math.abs(item.persentase_realisasi - 100).toFixed(2)

  const handleDownload = async () => {
    const png = await getPng()
    if (png) {
      FileSaver.saveAs(png, `realisasi-${item.kode_akun}.png`)
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle>{item.kode_akun}</CardTitle>
          <CardDescription>{item.nama_akun}</CardDescription>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleDownload}
          disabled={isLoading}
        >
          <Download className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width='100%' height={200}>
            <BarChart ref={ref} data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='name'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis tickFormatter={(value) => formatLargeNumber(value)} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey='value' radius={8}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      chartConfig[
                        entry.name.toLowerCase() as keyof typeof chartConfig
                      ].color
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          {isAboveTarget ? (
            <>
              <TrendingUp className='h-4 w-4 text-green-500' />
              Melebihi target sebanyak {difference}%
            </>
          ) : (
            <>
              <TrendingDown className='h-4 w-4 text-red-500' />
              Dibawah target sebanyak {difference}%
            </>
          )}
        </div>
        <div className='leading-none text-muted-foreground'>
          Realisasi: {item.persentase_realisasi.toFixed(2)}% dari target awal
        </div>
      </CardFooter>
    </Card>
  )
}

function downloadExcel(data: DataRealisasiItem[]) {
  const headers = [
    'Tahun',
    'Kode Akun',
    'Nama Akun',
    'Target',
    'Realisasi',
    'Persentase',
  ]

  // Membuat data untuk worksheet
  const worksheetData = [
    headers,
    ...data.map((row) => [
      row.tahun,
      row.kode_akun,
      row.nama_akun,
      row.target,
      row.realisasi,
      `${row.persentase_realisasi.toFixed(2)}%`,
    ]),
  ]

  // Membuat worksheet dan workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Jenis Pendapatan')

  // Menghasilkan file Excel
  XLSX.writeFile(workbook, 'data_jenis_pendapatan.xlsx')
}

function SkeletonLoader() {
  return (
    <div className='animate-pulse'>
      <div className='mb-4 h-8 w-1/3 rounded bg-gray-200'></div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className='mb-2 h-6 w-1/2 rounded bg-gray-200'></div>
              <div className='h-4 w-2/3 rounded bg-gray-200'></div>
            </CardHeader>
            <CardContent>
              <div className='h-40 rounded bg-gray-200'></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const columns: ColumnDef<DataRealisasiItem>[] = [
  {
    accessorKey: 'kode_akun',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Kode Akun
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'nama_akun',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama Akun
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'target',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Target
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => formatLargeNumber(row.getValue('target')),
    sortingFn: 'basic',
  },
  {
    accessorKey: 'realisasi',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Realisasi
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => formatLargeNumber(row.getValue('realisasi')),
    sortingFn: 'basic',
  },
  {
    accessorKey: 'persentase_realisasi',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Persentase
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) =>
      `${row.getValue<number>('persentase_realisasi').toFixed(2)}%`,
    sortingFn: 'basic',
  },
]

export function DataRealisasiTahunanChart({
  data,
  isLoading,
  selectedYear,
}: DataRealisasiTahunanChartProps) {
  if (isLoading) {
    return <SkeletonLoader />
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>
  }
  const selectedData = data
    .filter((item) => item.tahun === selectedYear)
    .filter((item) => item.kode_akun !== '4.1')

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {selectedData.map((item) => (
          <DataCard key={item.kode_akun} item={item} />
        ))}
      </div>
      <Card className='mt-8'>
        <CardContent className='p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-lg font-bold'>Data Kode Jenis Pendapatan {selectedYear} </h3>
            <Button onClick={() => downloadExcel(selectedData)}>
              <Download className='mr-2 h-4 w-4' />
              Download Excel
            </Button>
          </div>
          <DataTable columns={columns} data={selectedData} rowsPerPage={20} />
        </CardContent>
      </Card>
    </div>
  )
}

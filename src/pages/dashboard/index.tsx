import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { useQuery } from '@tanstack/react-query'
import api from '@/api'
import { DataRealisasiTahunanChart } from './components/data-realisasi-tahunan.chart'
import { CombinedCharts } from './components/new-jumlah-daerah.chart'
import { Separator } from '@/components/ui/separator'
import { PeringkatPajakProvChart } from './components/peringkat-pajak-prov.chart'
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type JumlahDaerahItem = {
  jumlah_daerah: number
  jumlah_daerah_belum_realisasi: number
  jumlah_daerah_belum_target: number
  jumlah_daerah_realisasi: number
  jumlah_daerah_target: number
  persentase_belum_r: string
  persentase_belum_t: string
  persentase_sudah_r: string
  persentase_sudah_t: string
  tahun: number
}

type JumlahDaerahResponse = {
  data: JumlahDaerahItem[]
  message: string
  status: boolean
  status_code: number
}

export type DataRealisasiItem = {
  kode_akun: string
  nama_akun: string
  persentase_realisasi: number
  realisasi: number
  tahun: number
  target: number
}

type DataRealisasiResponse = {
  data: DataRealisasiItem[]
  message: string
  status: boolean
  status_code: number
}

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

type PajakProvResponse = {
  data: PajakProvData
  message: string
  status: boolean
  status_code: number
}

export function usePajakProvData() {
  return useQuery<PajakProvResponse>({
    queryKey: ['pajakProv'],
    queryFn: async () => {
      const response = await api.get("/pendapatan/peringkat/data-pajak-prov")
      return response.data
    },
  })
}

export function useJumlahDaerahData() {
  return useQuery<JumlahDaerahResponse>({
    queryKey: ['jumlahDaerah'],
    queryFn: async () => {
      const response = await api.get("/pendapatan/dashboard/jumlah-daerah")
      return response.data
    },
  })
}

export function useDataRealisasiTahunan() {
  return useQuery<DataRealisasiResponse>({
    queryKey: ['dataRealisasiTahunan'],
    queryFn: async () => {
      const response = await api.get("/pendapatan/dashboard/data-realiasi-tahuan")
      return response.data
    },
  })
}

export default function Dashboard() {
  const years = [2021, 2022, 2023];

  const jumlahDaerahQuery = useJumlahDaerahData();
  const dataRealisasiTahunanQuery = useDataRealisasiTahunan();
  // const pajakProvQuery = usePajakProvData();
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);
  const [data, setData] = useState<PajakProvData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const fetchData = async (year: number) => {
    setIsLoading(true);
    try {
      const response = await api.post<PajakProvResponse>("/pendapatan/peringkat/data-pajak-prov", { tahun: year });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='gambaran-umum'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='gambaran-umum'>Gambaran Umum</TabsTrigger>
              <TabsTrigger value='detail-rincian-data'>Detail Rincian Data</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='gambaran-umum' className='space-y-4'>
            <CombinedCharts
              dataRealisasi={dataRealisasiTahunanQuery.data?.data || []}
              dataJumlahDaerah={jumlahDaerahQuery.data?.data || []}
              isLoading={dataRealisasiTahunanQuery.isLoading || jumlahDaerahQuery.isLoading}
            />
          </TabsContent>
          <TabsContent value='detail-rincian-data' className='space-y-4'>
            <h2 className='text-xl font-bold tracking-tight'>Detail Rincian Data</h2>
            <DataRealisasiTahunanChart
              isLoading={dataRealisasiTahunanQuery.isLoading}
              data={dataRealisasiTahunanQuery.data?.data || []}
            />
            <Separator className='my-4 flex-none' />
            <h2 className='text-xl font-bold tracking-tight'>Peringkat Pajak Provinsi</h2>
            <Select
              onValueChange={(value) => setSelectedYear(Number(value))}
              value={selectedYear.toString()}
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
            <PeringkatPajakProvChart
              data={data}
              isLoading={isLoading}
              selectedYear={selectedYear}
            />
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}


import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { JumlahDaerahChart } from './components/jumlah-daerah.chart'
import { useQuery } from '@tanstack/react-query'
import api from '@/api'
import { DataRealisasiTahunanChart } from './components/data-realisasi-tahunan.chart'

type JumlahDaerahItem = {
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

type DataRealisasiItem = {
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
  const jumlahDaerahQuery = useJumlahDaerahData();
  const dataRealisasiTahunanQuery = useDataRealisasiTahunan();

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
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='jumlah-daerah'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='jumlah-daerah'>Jumlah Daerah</TabsTrigger>
              <TabsTrigger value='data-realisasi-tahunan'>Data Realisasi Tahunan</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='jumlah-daerah' className='space-y-4'>
            <JumlahDaerahChart isLoading={jumlahDaerahQuery.isLoading} data={jumlahDaerahQuery.data?.data || []} />
          </TabsContent>
          <TabsContent value='data-realisasi-tahunan' className='space-y-4'>
            <DataRealisasiTahunanChart
              isLoading={dataRealisasiTahunanQuery.isLoading}
              data={dataRealisasiTahunanQuery.data?.data || []}
            />
          </TabsContent>
        </Tabs>
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

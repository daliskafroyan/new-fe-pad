import { Layout } from '@/components/custom/layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { useQuery } from '@tanstack/react-query'
import api from '@/api'
import { DataRealisasiTahunanChart } from './components/data-realisasi-tahunan.chart'
import { CombinedCharts } from './components/new-jumlah-daerah.chart'
import { Separator } from '@/components/ui/separator'
import { PeringkatPajakProvChart } from './components/peringkat-pajak-prov.chart'
import { PeringkatPajakKabChart } from './components/peringkat-pajak-kab.chart'
import { PeringkatPajakKotaChart } from './components/peringkat-pajak-kota.chart'
import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  jns_pemda: string
  kode_jenis: string
  nama_daerah: string
  nama_jenis: string
  persentase: number
  realisasi: number
  tahun: number
  target: number
}

type PajakProvData = {
  data_terendah: PajakProvItem[]
  data_tertinggi: PajakProvItem[]
}

type PajakProvResponse = {
  data: PajakProvData
  message: string
  status: boolean
  status_code: number
}

type PajakKabItem = {
  jns_pemda: string
  kode_jenis: string
  nama_daerah: string
  nama_jenis: string
  persentase: number
  realisasi: number
  tahun: number
  target: number
}

type PajakKabData = {
  data_terendah: PajakKabItem[]
  data_tertinggi: PajakKabItem[]
}

type PajakKabResponse = {
  data: PajakKabData
  message: string
  status: boolean
  status_code: number
}

type PajakKotaItem = {
  jns_pemda: string
  kode_jenis: string
  nama_daerah: string
  nama_jenis: string
  persentase: number
  realisasi: number
  tahun: number
  target: number
}

type PajakKotaData = {
  data_terendah: PajakKotaItem[]
  data_tertinggi: PajakKotaItem[]
}

type PajakKotaResponse = {
  data: PajakKotaData
  message: string
  status: boolean
  status_code: number
}

export function useJumlahDaerahData() {
  return useQuery<JumlahDaerahResponse>({
    queryKey: ['jumlahDaerah'],
    queryFn: async () => {
      const response = await api.get('/pendapatan/dashboard/jumlah-daerah')
      return response.data
    },
  })
}

export function useDataRealisasiTahunan() {
  return useQuery<DataRealisasiResponse>({
    queryKey: ['dataRealisasiTahunan'],
    queryFn: async () => {
      const response = await api.get('/pendapatan/dashboard/data-realiasi-tahuan')
      return response.data
    },
  })
}

export default function Dashboard() {
  const years = [2019, 2020, 2021, 2022, 2023, 2024]

  const jumlahDaerahQuery = useJumlahDaerahData()
  const dataRealisasiTahunanQuery = useDataRealisasiTahunan()
  const [selectedYear, setSelectedYear] = useState<number>(years[0])
  const [dataProv, setDataProv] = useState<PajakProvData | null>(null)
  const [dataKab, setDataKab] = useState<PajakKabData | null>(null)
  const [dataKota, setDataKota] = useState<PajakKotaData | null>(null)
  const [isLoadingProv, setIsLoadingProv] = useState(false)
  const [isLoadingKab, setIsLoadingKab] = useState(false)
  const [isLoadingKota, setIsLoadingKota] = useState(false)

  useEffect(() => {
    fetchProvData(selectedYear)
    fetchKabData(selectedYear)
    fetchKotaData(selectedYear)
  }, [selectedYear])

  const fetchProvData = async (year: number) => {
    setIsLoadingProv(true)
    try {
      const response = await api.post<PajakProvResponse>(
        '/pendapatan/peringkat/data-pajak-prov',
        { tahun: year }
      )
      setDataProv(response.data.data)
    } catch (error) {
      console.error('Error fetching Prov data:', error)
    } finally {
      setIsLoadingProv(false)
    }
  }

  const fetchKabData = async (year: number) => {
    setIsLoadingKab(true)
    try {
      const response = await api.post<PajakKabResponse>(
        '/pendapatan/peringkat/data-pajak-kab',
        { tahun: year }
      )
      setDataKab(response.data.data)
    } catch (error) {
      console.error('Error fetching Kab data:', error)
    } finally {
      setIsLoadingKab(false)
    }
  }

  const fetchKotaData = async (year: number) => {
    setIsLoadingKota(true)
    try {
      const response = await api.post<PajakKotaResponse>(
        '/pendapatan/peringkat/data-pajak-kota',
        { tahun: year }
      )
      setDataKota(response.data.data)
    } catch (error) {
      console.error('Error fetching Kab data:', error)
    } finally {
      setIsLoadingKota(false)
    }
  }

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <div className='ml-auto flex items-center space-x-4'>
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
              <TabsTrigger value='detail-rincian-data'>
                Detail Rincian Data
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='gambaran-umum' className='space-y-4'>
            <CombinedCharts
              dataRealisasi={dataRealisasiTahunanQuery.data?.data || []}
              dataJumlahDaerah={jumlahDaerahQuery.data?.data || []}
              isLoading={
                dataRealisasiTahunanQuery.isLoading ||
                jumlahDaerahQuery.isLoading
              }
            />
          </TabsContent>
          <Separator className='my-4 flex-none' />
          <TabsContent value='detail-rincian-data' className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h4 className='text-lg font-bold'>
                DETAIL RINCI DATA NASIONAL TAHUN {selectedYear}
              </h4>
              <Select
                onValueChange={(value) => setSelectedYear(Number(value))}
                value={selectedYear?.toString() || ''}
              >
                <SelectTrigger className='w-[180px] bg-card'>
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
            </div>
            <Separator className='my-4 flex-none' />
            <DataRealisasiTahunanChart
              isLoading={dataRealisasiTahunanQuery.isLoading}
              data={dataRealisasiTahunanQuery.data?.data || []}
              selectedYear={selectedYear}
            />
            {/* <PeringkatPajakProvChart
              data={dataProv}
              isLoading={isLoadingProv}
              selectedYear={selectedYear}
            />
            <PeringkatPajakKabChart
              data={dataKab}
              isLoading={isLoadingKab}
              selectedYear={selectedYear}
            />
            <PeringkatPajakKotaChart
              data={dataKota}
              isLoading={isLoadingKota}
              selectedYear={selectedYear}
            /> */}
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}

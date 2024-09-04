import { Input, InputProps } from '@/components/ui/input'

export function Search({ ...props }: InputProps) {
  return (
    <div>
      <Input
        {...props}
        type='search'
        placeholder='Search...'
        className='md:w-[100px] lg:w-[300px]'
      />
    </div>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchMedicines } from '@/api/medicines/fetch-medicines'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const FormSchema = z.object({
  medicine: z.string({
    required_error: 'Please select a therapeutic class.',
  }),
})

export function Test() {
  const [query, setQuery] = useState('')
  const { token } = useAuth()

  const { data: medicines, isFetching } = useQuery({
    queryKey: ['medicines', query],
    queryFn: () => fetchMedicines({ page: 1, query }, token ?? ''),
    enabled: query !== null, // Permite requisição inicial mesmo se `query` for vazio
    staleTime: 1000, // Opcional: tempo antes de refazer a requisição
    refetchOnMount: true, //
    // queryKey: ['medicines', query],
    // queryFn: () => fetchMedicines({ page: 1, query }, token ?? ''),
    // enabled: !!query, // Só faz a requisição quando o `query` não for vazio
    // staleTime: 1000, // Opcional: tempo antes de refazer a requisição
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="medicine"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Therapeutic Class</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? medicines &&
                              medicines.find(
                                (medicine) => medicine.id === field.value,
                              )?.name
                            : 'Select therapeutic class'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search therapeutic class..."
                          className="h-9"
                          value={query}
                          onValueChange={setQuery}
                        />
                        <CommandList>
                          {isFetching && (
                            <CommandEmpty>Loading...</CommandEmpty>
                          )}
                          {!isFetching && (
                            <>
                              {medicines?.length ? (
                                <CommandGroup>
                                  {medicines.map((medicine) => (
                                    <CommandItem
                                      value={medicine.name}
                                      key={medicine.id}
                                      onSelect={() => {
                                        form.setValue('medicine', medicine.id)
                                        setQuery(medicine.name) // Atualiza o input com o nome selecionado
                                      }}
                                    >
                                      {medicine.name}
                                      <Check
                                        className={cn(
                                          'ml-auto',
                                          medicine.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              ) : (
                                <CommandEmpty>No results found.</CommandEmpty>
                              )}
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the therapeutic class that will be used in the
                    dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// import { zodResolver } from '@hookform/resolvers/zod'
// import { useQuery } from '@tanstack/react-query'
// import { Check, ChevronsUpDown } from 'lucide-react'
// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { z } from 'zod'

// import { fetchTherapeuticClasses } from '@/api/auxiliary-records/therapeutic-class/fetch-therapeutic-class'
// import { fetchMedicines } from '@/api/medicines/fetch-medicines'
// import { Button } from '@/components/ui/button'
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command'
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogTrigger,
// } from '@/components/ui/dialog'
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover'
// import { useAuth } from '@/contexts/authContext'
// import { toast } from '@/hooks/use-toast'
// import { cn } from '@/lib/utils'

// const FormSchema = z.object({
//   medicine: z.string({
//     required_error: 'Please select a therapeuticclass.',
//   }),
// })

// export function Test() {
//   const [query, setQuery] = useState('')
//   const { token } = useAuth()

//   const { data: medicines } = useQuery({
//     queryKey: ['medicines', query],
//     queryFn: () => fetchMedicines({ page: 1, query: '' }, token ?? ''),
//   })

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//   })

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     toast({
//       title: 'You submitted the following values:',
//       description: (
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     })
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Edit Profile</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="medicine"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>TherapeuticClass</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant="outline"
//                           role="combobox"
//                           className={cn(
//                             'w-[200px] justify-between',
//                             !field.value && 'text-muted-foreground',
//                           )}
//                         >
//                           {field.value
//                             ? medicines &&
//                               medicines.find(
//                                 (medicine) => medicine.id === field.value,
//                               )?.name
//                             : 'Select therapeuticclass'}
//                           <ChevronsUpDown className="opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-[200px] p-0">
//                       <Command>
//                         <CommandInput
//                           placeholder="Search framework..."
//                           className="h-9"
//                         />
//                         <CommandList>
//                           <CommandEmpty>No framework found.</CommandEmpty>
//                           <CommandGroup>
//                             {medicines &&
//                               medicines.map((medicine) => (
//                                 <CommandItem
//                                   value={medicine.name}
//                                   key={medicine.name}
//                                   onSelect={() => {
//                                     form.setValue('medicine', medicine.id)
//                                   }}
//                                 >
//                                   {medicine.name}
//                                   <Check
//                                     className={cn(
//                                       'ml-auto',
//                                       medicine.id === field.value
//                                         ? 'opacity-100'
//                                         : 'opacity-0',
//                                     )}
//                                   />
//                                 </CommandItem>
//                               ))}
//                           </CommandGroup>
//                         </CommandList>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>
//                     This is the therapeuticclass that will be used in the
//                     dashboard.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit">Submit</Button>
//           </form>
//         </Form>
//         <DialogFooter>
//           <Button type="submit">Save changes</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

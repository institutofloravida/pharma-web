import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetchInstitutions } from '@/api/pharma/auxiliary-records/institution/fetch-institutions'
import { useAuth } from '@/contexts/authContext'
import { toast } from '@/hooks/use-toast'

import { NewUserForm } from '../users/new-user-form'

const newOperatorSchema = z.object({
  intitutionsIds: z.array(z.string()),
})

type NewOperatorSchema = z.infer<typeof newOperatorSchema>

export function Test() {
  const { token } = useAuth()
  const [queryInstitution, setQueryInstitution] = useState('')

  const form = useForm<NewOperatorSchema>({
    resolver: zodResolver(newOperatorSchema),
  })

  const { data: institutionsResult, isLoading } = useQuery({
    queryKey: ['institutions'],
    queryFn: () => fetchInstitutions({ page: 1 }, token ?? ''),
  })

  async function handleRegisterOperator(data: NewOperatorSchema) {
    try {
      toast({
        title: 'You submitted the following values:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    } catch (error) {
      toast({
        title: 'Error ao cadastrar o estoque',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(error, null, 2)}</code>
          </pre>
        ),
      })
    }
  }

  return (
    <div className="flex h-full items-center justify-center">
      <NewUserForm />
    </div>
  )
}

// "use client"

// import * as React from "react"
// import { format, parse, isValid } from "date-fns"
// import { CalendarIcon } from 'lucide-react'

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Input } from "@/components/ui/input"

// export function DatePickerWithInput({
//   className,
// }: React.HTMLAttributes<HTMLDivElement>) {
//   const [date, setDate] = React.useState<Date | undefined>(undefined)
//   const [inputValue, setInputValue] = React.useState("")

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value
//     setInputValue(value)

//     // Parse the input value
//     const parsedDate = parse(value, "dd/MM/yyyy", new Date())
//     if (isValid(parsedDate)) {
//       setDate(parsedDate)
//     }
//   }

//   const handleCalendarSelect = (newDate: Date | undefined) => {
//     setDate(newDate)
//     if (newDate) {
//       setInputValue(format(newDate, "dd/MM/yyyy"))
//     }
//   }

//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={"outline"}
//             className={cn(
//               "w-[300px] justify-start text-left font-normal",
//               !date && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date ? format(date, "PPP") : <span>Selecione uma data</span>}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={handleCalendarSelect}
//             initialFocus
//           />
//         </PopoverContent>
//       </Popover>
//       <Input
//         type="text"
//         placeholder="DD/MM/YYYY"
//         value={inputValue}
//         onChange={handleInputChange}
//         className="w-[300px]"
//       />
//     </div>
//   )
// }

"use client";

import { useState } from "react";
import { ChevronsUpDown, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Patient } from "../types/dispensation";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers, type User } from "@/api/pharma/users/fetch-users";
import { useAuth } from "@/contexts/authContext";

interface PatientSearchProps {
  onSelect: (patient: User) => void;
  selectedPatient?: User;
}

const formatSUS = (cpf: string) => {
  return cpf.replace(/(\d{5})(\d{5})(\d{5})/, "$1.$2.$3");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

export function PatientSearch({
  onSelect,
  selectedPatient,
}: PatientSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { token } = useAuth();

  const { data: usersResult, isFetching: isFetchingUsers } = useQuery({
    queryKey: ["users", searchValue],
    queryFn: () => fetchUsers({ page: 1, name: searchValue }, token ?? ""),
    staleTime: 1000,
    refetchOnMount: true,
  });

  const handleSelect = (patient: User) => {
    onSelect(patient);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-12 w-full justify-between bg-transparent text-left"
        >
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            {selectedPatient ? (
              <div className="flex flex-col">
                <span className="font-medium">{selectedPatient.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatSUS(selectedPatient.sus)} -{" "}
                  {formatDate(selectedPatient.birthDate)}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                Pesquisar paciente...
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Digite o nome, CPF ou data de nascimento..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
            <CommandGroup>
              {usersResult?.patients.map((patient) => (
                <CommandItem
                  key={patient.id}
                  value={`${patient.name} ${patient.cpf} ${patient.birthDate}`}
                  onSelect={() => handleSelect(patient)}
                  className="cursor-pointer"
                >
                  <div className="flex w-full flex-col">
                    <span className="font-medium">{patient.name}</span>
                    <span className="text-sm text-muted-foreground">
                      SUS: {formatSUS(patient.sus)} | Nascimento:{" "}
                      {formatDate(patient.birthDate)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

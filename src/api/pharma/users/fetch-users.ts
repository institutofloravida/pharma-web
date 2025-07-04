import { apiPharma } from "@/lib/axios";
import type { Race } from "@/lib/utils/race";

import type { Meta } from "../_types/meta";

export enum Gender {
  FEMALE = "F",
  MALE = "M",
  OTHER = "O",
}

export interface FetchUsersQuery {
  page?: number | null;
  name?: string | null;
  cpf?: string | null;
  sus?: string | null;
  generalRegistration?: string | null;
  birthDate?: Date | null;
  pathologyId?: string | null;
}

export interface User {
  id: string;
  name: string;
  sus: string;
  cpf?: string;
  birthDate: string;
  gender: Gender;
  race: Race;
  generalRegistration?: string;
}

interface FetchUsersResponse {
  patients: User[];
  meta: Meta;
}

export async function fetchUsers(
  {
    page,
    birthDate,
    cpf,
    generalRegistration,
    name,
    pathologyId,
    sus,
  }: FetchUsersQuery,
  token: string,
) {
  const response = await apiPharma.get<FetchUsersResponse>("/patients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      name,
      sus,
      cpf,
      birthDate,
      generalRegistration,
      pathologyId,
    },
  });

  return response.data;
}

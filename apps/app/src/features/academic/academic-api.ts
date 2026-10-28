import type { AcademicData } from '@school-controller/shared';
import { apiUrl } from '@/config/env';
import { getAuthorizationHeader } from '@/features/login/auth-api';

export async function academicRequest<T>(
  path = '',
  input?: unknown,
  method = 'GET',
  signal?: AbortSignal
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiUrl}/academic${path}`, {
      method,
      credentials: 'include',
      signal,
      headers: {
        ...getAuthorizationHeader(),
        ...(input === undefined ? {} : { 'Content-Type': 'application/json' })
      },
      ...(input === undefined ? {} : { body: JSON.stringify(input) })
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new Error('No se pudo conectar con el servidor. Comprueba que la API esté disponible.', {
      cause: error
    });
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) throw new Error('Tu sesión ha vencido. Vuelve a iniciar sesión.');
    const fields = body.error?.details?.fields;
    const details =
      fields && typeof fields === 'object'
        ? Object.values(fields)
            .flat()
            .filter((value): value is string => typeof value === 'string')
            .join(' ')
        : '';
    throw new Error(details || body.error?.message || 'No se pudieron completar los cambios.');
  }
  return body as T;
}
export const fetchAcademicData = (signal?: AbortSignal) =>
  academicRequest<AcademicData>('', undefined, 'GET', signal);

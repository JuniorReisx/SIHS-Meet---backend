export const ROOM_NAMES = [
  "Sala de Reunião 1",
  "Sala de Reunião 2",
  "Sala de Reunião 3",
] as const;

export type RoomName = (typeof ROOM_NAMES)[number];

/** Mapeamento dos nomes antigos para os novos (migração de dados). */
export const LOCATION_MIGRATION_MAP: Record<string, RoomName> = {
  "Reunião Portal da Água": "Sala de Reunião 1",
  "Sala de Reunião": "Sala de Reunião 2",
};

export function isValidRoom(location: string): location is RoomName {
  return (ROOM_NAMES as readonly string[]).includes(location);
}

export function normalizeLocation(location: string): string {
  return LOCATION_MIGRATION_MAP[location] ?? location;
}

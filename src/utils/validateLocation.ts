import { isValidRoom } from "../config/rooms";

export function validateLocationOrRespond(location: string): string | null {
  if (!isValidRoom(location)) {
    return `Local inválido. Use um dos seguintes: ${["Sala de Reunião 1", "Sala de Reunião 2", "Sala de Reunião 3"].join(", ")}`;
  }
  return null;
}

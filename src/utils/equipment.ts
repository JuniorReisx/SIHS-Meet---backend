import { ALLOWED_EQUIPMENT } from "../config/equipment";

export function validateEquipmentOrRespond(equipment: unknown): string | null {
  if (equipment === undefined || equipment === null) return null;
  if (!Array.isArray(equipment)) {
    return "O campo equipment deve ser uma lista de equipamentos.";
  }
  const invalid = equipment.filter(
    (item) => typeof item !== "string" || !(ALLOWED_EQUIPMENT as readonly string[]).includes(item),
  );
  if (invalid.length > 0) {
    return `Equipamentos inválidos. Permitidos: ${ALLOWED_EQUIPMENT.join(", ")}`;
  }
  return null;
}

export function normalizeEquipment(equipment: unknown): string[] {
  if (!Array.isArray(equipment)) return [];
  return equipment.filter(
    (item): item is string =>
      typeof item === "string" && (ALLOWED_EQUIPMENT as readonly string[]).includes(item),
  );
}

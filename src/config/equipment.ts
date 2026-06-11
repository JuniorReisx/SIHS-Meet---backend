export const ALLOWED_EQUIPMENT = ["projetor", "tv", "som"] as const;

export type EquipmentId = (typeof ALLOWED_EQUIPMENT)[number];

export const EQUIPMENT_LABELS: Record<EquipmentId, string> = {
  projetor: "Projetor",
  tv: "TV",
  som: "Sistema de Som",
};

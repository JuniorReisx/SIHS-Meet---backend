import { supabase } from "../config/supabase";
import { LOCATION_MIGRATION_MAP } from "../config/rooms";

const TABLES = ["meetings_confirmed", "meetings_pending", "meetings_denied"] as const;

export async function migrateRoomLocations(): Promise<void> {
  for (const table of TABLES) {
    for (const [oldName, newName] of Object.entries(LOCATION_MIGRATION_MAP)) {
      const { error } = await supabase
        .from(table)
        .update({ location: newName })
        .eq("location", oldName);

      if (error) {
        console.error(`Erro ao migrar local "${oldName}" em ${table}:`, error.message);
      }
    }
  }
}

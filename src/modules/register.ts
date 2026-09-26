import type { AppModule } from "@/core/modules/types";
import { ArchiveModule } from "./archive/ArchiveModule";
import { FeedStatusModule } from "./feed-status/FeedStatusModule";
import { NotesModule } from "./notes/NotesModule";
import { WeatherModule } from "./weather/WeatherModule";

export const appModules: AppModule[] = [
  {
    id: "feed-status",
    title: "Feed",
    description: "Liest nur den gemeinsamen GeoJSON-Store.",
    area: "rail",
    defaultOpen: true,
    Component: FeedStatusModule,
  },
  {
    id: "notes",
    title: "Notizen",
    description: "Eigene IndexedDB, kein Bezug zu anderen Modulen.",
    area: "rail",
    defaultOpen: true,
    Component: NotesModule,
  },
  {
    id: "weather",
    title: "Wetter",
    description: "Eigene REST-API.",
    area: "rail",
    Component: WeatherModule,
  },
  {
    id: "archive",
    title: "Archiv",
    description: "Festplattenzugriff über File System Access.",
    area: "rail",
    Component: ArchiveModule,
  },
];

import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useGeoStore } from "@/core/geo/geo-store";
import { useModuleRegistry } from "@/core/modules/registry";
import { LiveView } from "@/features/live/LiveView";
import { PlaybackView } from "@/features/playback/PlaybackView";
import { AppShell } from "@/features/shell/AppShell";
import { appModules } from "@/modules/register";

export function App() {
  const start = useGeoStore((state) => state.start);
  const stop = useGeoStore((state) => state.stop);
  const register = useModuleRegistry((state) => state.register);

  useEffect(() => {
    register(appModules);
    start();
    return () => stop();
  }, [register, start, stop]);

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<LiveView />} />
        <Route path="playback" element={<PlaybackView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

import { NavLink, Outlet } from "react-router-dom";
import { useModuleRegistry } from "@/core/modules/registry";
import "./AppShell.css";

export function AppShell() {
  const modules = useModuleRegistry((state) => state.modules);
  const openIds = useModuleRegistry((state) => state.openIds);
  const toggle = useModuleRegistry((state) => state.toggle);

  return (
    <div className="app-shell">
      <header className="app-shell__top">
        <div>
          <p className="app-shell__kicker">Tablet Operations</p>
          <h1>Lagebild</h1>
        </div>
        <nav className="app-shell__nav" aria-label="Hauptbereiche">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "touch-btn is-active" : "touch-btn")}
          >
            Live
          </NavLink>
          <NavLink
            to="/playback"
            className={({ isActive }) => (isActive ? "touch-btn is-active" : "touch-btn")}
          >
            Playback
          </NavLink>
        </nav>
        <div className="app-shell__modules" aria-label="Module">
          {modules.map((module) => (
            <button
              key={module.id}
              type="button"
              className={openIds.includes(module.id) ? "touch-btn is-active" : "touch-btn"}
              onClick={() => toggle(module.id)}
            >
              {module.title}
            </button>
          ))}
        </div>
      </header>
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}

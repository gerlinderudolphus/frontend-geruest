import { useModuleRegistry } from "@/core/modules/registry";
import "./ModuleHost.css";

export function ModuleHost() {
  const modules = useModuleRegistry((state) => state.modules);
  const openIds = useModuleRegistry((state) => state.openIds);
  const visible = modules.filter((module) => openIds.includes(module.id));

  if (visible.length === 0) {
    return (
      <aside className="module-host module-host--empty">
        <p>Keine Module aktiv. Oben ein Modul einschalten.</p>
      </aside>
    );
  }

  return (
    <aside className="module-host">
      {visible.map((module) => (
        <article key={module.id} className="module-card">
          <header>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
          </header>
          <module.Component />
        </article>
      ))}
    </aside>
  );
}

import { CheckCircle2, Plug, Puzzle } from 'lucide-react'

import { lifeOsModules } from '../../../constants/modules'

export function PluginsPage() {
  return (
    <section className="plugins-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Plugins</span>
          <h2>LifeOS modules</h2>
          <p>Review the built-in modules currently connected to the workspace.</p>
        </div>
      </div>

      <div className="module-grid">
        {lifeOsModules.map((module) => (
          <section className="finance-panel module-card" key={module}>
            <Plug size={22} />
            <strong>{module}</strong>
            <p>Built into this LifeOS workspace and available from the main navigation.</p>
            <span>
              <CheckCircle2 size={14} />
              Active
            </span>
          </section>
        ))}
        <section className="finance-panel module-card module-card-muted">
          <Puzzle size={22} />
          <strong>External plugins</strong>
          <p>Third-party plugin installation can be added later when the plugin contract is ready.</p>
          <span>Planned</span>
        </section>
      </div>
    </section>
  )
}

import { Download, FileText, Folder, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function FilesPage() {
  const navigate = useNavigate()

  return (
    <section className="files-page">
      <div className="widget-toolbar">
        <div>
          <span className="auth-eyebrow">Files</span>
          <h2>Workspace files</h2>
          <p>Central place for exports, journal documents, and future attachments.</p>
        </div>
        <button className="primary-action compact-action" onClick={() => navigate('/settings')} type="button">
          <Download size={16} />
          Export data
        </button>
      </div>

      <div className="module-grid">
        <section className="finance-panel module-card">
          <Folder size={22} />
          <strong>Data exports</strong>
          <p>Download your LifeOS profile, finance, habits, journal, goals, calendar, and reports from Settings.</p>
        </section>
        <section className="finance-panel module-card">
          <FileText size={22} />
          <strong>Journal documents</strong>
          <p>Encrypted and plain journal entries are stored in Supabase and shown in the Journal module.</p>
        </section>
        <section className="finance-panel module-card">
          <Lock size={22} />
          <strong>Privacy status</strong>
          <p>Files and exports stay scoped to the signed-in user through Supabase row-level security.</p>
        </section>
      </div>
    </section>
  )
}

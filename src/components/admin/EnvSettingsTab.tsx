/**
 * EnvSettingsTab.tsx
 * Admin panel tab for managing environment configuration & email notification settings.
 * Values are stored in siteSettings DB table (key: env_*) and read by the server at runtime.
 * Sensitive values (passwords) are masked by default.
 *
 * IMPORTANT: These settings are saved to the database via miniyo.settings.setMany
 * and loaded into process.env on boot via the startup env-loader below.
 * For Railway-hosted values that require a redeploy (APP_SECRET, DATABASE_URL),
 * the admin is shown a reminder banner to also update Railway dashboard.
 */
import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'

interface EnvField {
  key: string
  label: string
  placeholder: string
  sensitive: boolean
  group: string
  hint?: string
  readOnly?: boolean
}

const ENV_FIELDS: EnvField[] = [
  // ── Email / SMTP ──
  { key: 'env_smtp_host',  label: 'SMTP Host',     placeholder: 'smtpout.secureserver.net', sensitive: false, group: 'Email (SMTP)',  hint: 'GoDaddy outgoing server: smtpout.secureserver.net' },
  { key: 'env_smtp_port',  label: 'SMTP Port',     placeholder: '465',                       sensitive: false, group: 'Email (SMTP)',  hint: '465 (SSL) or 587 (TLS)' },
  { key: 'env_smtp_user',  label: 'SMTP Username', placeholder: 'admin@miniyo.store',        sensitive: false, group: 'Email (SMTP)',  hint: 'Your GoDaddy email address used to send' },
  { key: 'env_smtp_pass',  label: 'SMTP Password', placeholder: '••••••••',                  sensitive: true,  group: 'Email (SMTP)',  hint: 'Your GoDaddy email password' },

  // ── Notification recipients ──
  { key: 'env_notify_emails', label: 'Order Notification Emails', placeholder: 'admin@miniyo.store,Management@miniyo.store,marketing@miniyo.store', sensitive: false, group: 'Notifications', hint: 'Comma-separated list of staff emails that receive new order alerts' },

  // ── Admin credentials ──
  { key: 'env_admin_email',    label: 'Admin Email',    placeholder: 'admin@miniyo.store', sensitive: false, group: 'Admin Account' },
  { key: 'env_admin_password', label: 'Admin Password', placeholder: '••••••••',           sensitive: true,  group: 'Admin Account', hint: 'Password for admin panel login' },

  // ── App / OAuth ──
  { key: 'env_app_id',     label: 'App ID (Kimi OAuth)',     placeholder: '19ea3c1d-…', sensitive: false, group: 'OAuth / App' },
  { key: 'env_app_secret', label: 'App Secret (Kimi OAuth)', placeholder: '••••••••',   sensitive: true,  group: 'OAuth / App', hint: 'Changing this requires a redeploy on Railway' },

  // ── Read-only info ──
  { key: 'env_database_url', label: 'Database URL', placeholder: 'mysql://…', sensitive: true, group: 'Infrastructure', hint: 'Managed by Railway — update in Railway dashboard, not here', readOnly: true },
]

const GROUPS = [...new Set(ENV_FIELDS.map(f => f.group))]

export function EnvSettingsTab() {
  const utils = trpc.useUtils()
  const { data: allSettings, isLoading } = trpc.miniyo.settings.getAll.useQuery()
  const setMany = trpc.miniyo.settings.setMany.useMutation({
    onSuccess: () => {
      utils.miniyo.settings.getAll.invalidate()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const [values, setValues] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const [activeGroup, setActiveGroup] = useState(GROUPS[0])

  useEffect(() => {
    if (!allSettings) return
    const map: Record<string, string> = {}
    for (const s of allSettings) {
      map[s.settingKey] = s.settingValue ?? ''
    }
    setValues(map)
  }, [allSettings])

  function handleChange(key: string, val: string) {
    setValues(prev => ({ ...prev, [key]: val }))
  }

  function handleSave() {
    // Only save env_ keys
    const envValues: Record<string, string> = {}
    for (const [k, v] of Object.entries(values)) {
      if (k.startsWith('env_')) envValues[k] = v
    }
    setMany.mutate(envValues)
  }

  const groupFields = ENV_FIELDS.filter(f => f.group === activeGroup)
  const requiresRedeploy = groupFields.some(f => f.readOnly || f.key === 'env_app_secret')

  return (
    <div className="env-settings-tab">
      <div className="env-header">
        <div>
          <h2 className="env-title">Environment &amp; Email Settings</h2>
          <p className="env-subtitle">
            Manage SMTP, notification recipients, and app credentials directly from the admin panel.
            Changes are saved to the database and applied on the next server request.
          </p>
        </div>
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={setMany.isPending}
        >
          {setMany.isPending ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Group tabs */}
      <div className="group-tabs">
        {GROUPS.map(g => (
          <button
            key={g}
            className={`group-tab ${activeGroup === g ? 'active' : ''}`}
            onClick={() => setActiveGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {requiresRedeploy && (
        <div className="redeploy-banner">
          ⚠️ Some values in this section (marked as read-only or <strong>App Secret</strong>) also need to be updated in your{' '}
          <a href="https://railway.app" target="_blank" rel="noopener noreferrer">Railway dashboard</a>{' '}
          environment variables to take full effect after a redeploy.
        </div>
      )}

      {isLoading ? (
        <div className="loading-fields">
          {[1, 2, 3].map(i => <div key={i} className="skeleton-field" />)}
        </div>
      ) : (
        <div className="fields-grid">
          {groupFields.map(field => (
            <div key={field.key} className="field-row">
              <label className="field-label">
                {field.label}
                {field.readOnly && <span className="badge-readonly">read-only</span>}
              </label>
              {field.hint && <p className="field-hint">{field.hint}</p>}
              <div className="field-input-wrap">
                <input
                  className="field-input"
                  type={field.sensitive && !revealed[field.key] ? 'password' : 'text'}
                  placeholder={field.placeholder}
                  value={values[field.key] ?? ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                  disabled={field.readOnly}
                  autoComplete="off"
                />
                {field.sensitive && (
                  <button
                    className="reveal-btn"
                    type="button"
                    onClick={() => setRevealed(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                    aria-label={revealed[field.key] ? 'Hide' : 'Reveal'}
                  >
                    {revealed[field.key] ? '🙈' : '👁'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email queue status */}
      {activeGroup === 'Email (SMTP)' && <EmailQueueStatus />}

      <style>{`
        .env-settings-tab { padding: 0; }
        .env-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .env-title { font-size: 1.25rem; font-weight: 700; color: #28251d; margin: 0 0 4px; }
        .env-subtitle { font-size: 0.875rem; color: #7a7974; margin: 0; max-width: 520px; }
        .btn-save { background: #01696f; color: #fff; border: none; border-radius: 8px; padding: 10px 24px; font-size: 0.875rem; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 0.18s; }
        .btn-save:hover { background: #0c4e54; }
        .btn-save:disabled { background: #437a22; cursor: not-allowed; }
        .group-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .group-tab { background: #f7f6f2; border: 1px solid #dcd9d5; border-radius: 6px; padding: 6px 14px; font-size: 0.8125rem; font-weight: 500; color: #7a7974; cursor: pointer; transition: all 0.15s; }
        .group-tab.active { background: #01696f; color: #fff; border-color: #01696f; }
        .group-tab:hover:not(.active) { background: #f0ece6; }
        .redeploy-banner { background: #fdf3e7; border: 1px solid #e7d7c4; border-radius: 8px; padding: 12px 16px; font-size: 0.8125rem; color: #964219; margin-bottom: 20px; }
        .redeploy-banner a { color: #964219; font-weight: 600; }
        .fields-grid { display: grid; gap: 18px; }
        .field-row { display: flex; flex-direction: column; gap: 4px; }
        .field-label { font-size: 0.875rem; font-weight: 600; color: #28251d; display: flex; align-items: center; gap: 8px; }
        .badge-readonly { background: #f7f6f2; border: 1px solid #dcd9d5; border-radius: 4px; padding: 1px 6px; font-size: 0.7rem; font-weight: 500; color: #7a7974; }
        .field-hint { font-size: 0.8rem; color: #7a7974; margin: 0; }
        .field-input-wrap { position: relative; }
        .field-input { width: 100%; padding: 9px 40px 9px 12px; border: 1px solid #dcd9d5; border-radius: 8px; font-size: 0.875rem; color: #28251d; background: #fff; outline: none; box-sizing: border-box; transition: border-color 0.15s; }
        .field-input:focus { border-color: #01696f; box-shadow: 0 0 0 3px rgba(1,105,111,0.1); }
        .field-input:disabled { background: #f7f6f2; color: #bab9b4; cursor: not-allowed; }
        .reveal-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; padding: 2px; }
        .loading-fields { display: flex; flex-direction: column; gap: 16px; }
        .skeleton-field { height: 64px; background: linear-gradient(90deg,#f0ebe4 25%,#e8e4de 50%,#f0ebe4 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; border-radius: 8px; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>
    </div>
  )
}

function EmailQueueStatus() {
  const { data: queue } = trpc.miniyo.email.queue.useQuery()
  if (!queue) return null

  const pending = queue.filter(e => e.status === 'pending').length
  const sent    = queue.filter(e => e.status === 'sent').length
  const failed  = queue.filter(e => e.status === 'failed').length

  return (
    <div className="email-queue-card">
      <h3 className="eq-title">Email Queue Status</h3>
      <div className="eq-stats">
        <div className="eq-stat pending"><span className="eq-num">{pending}</span><span className="eq-lbl">Pending</span></div>
        <div className="eq-stat sent"><span className="eq-num">{sent}</span><span className="eq-lbl">Sent</span></div>
        <div className="eq-stat failed"><span className="eq-num">{failed}</span><span className="eq-lbl">Failed</span></div>
      </div>
      {failed > 0 && (
        <p className="eq-warn">⚠️ {failed} email(s) failed. Check your SMTP settings above and save again — the worker retries on next poll.</p>
      )}
      {pending > 0 && (
        <p className="eq-info">🕐 {pending} email(s) queued — will be sent within 60 seconds by the background worker.</p>
      )}
      <div className="eq-recent">
        <p className="eq-recent-title">Recent ({Math.min(queue.length, 5)})</p>
        {queue.slice(0, 5).map(e => (
          <div key={e.id} className={`eq-row status-${e.status}`}>
            <span className="eq-to">{e.recipient}</span>
            <span className="eq-subj">{e.subject.slice(0, 48)}{e.subject.length > 48 ? '…' : ''}</span>
            <span className={`eq-badge badge-${e.status}`}>{e.status}</span>
          </div>
        ))}
      </div>
      <style>{`
        .email-queue-card { margin-top: 28px; background: #f9f8f5; border: 1px solid #dcd9d5; border-radius: 10px; padding: 20px; }
        .eq-title { font-size: 0.9375rem; font-weight: 700; color: #28251d; margin: 0 0 14px; }
        .eq-stats { display: flex; gap: 16px; margin-bottom: 14px; }
        .eq-stat { display: flex; flex-direction: column; align-items: center; background: #fff; border-radius: 8px; padding: 10px 20px; border: 1px solid #dcd9d5; min-width: 72px; }
        .eq-num { font-size: 1.5rem; font-weight: 700; line-height: 1; }
        .eq-lbl { font-size: 0.75rem; color: #7a7974; margin-top: 2px; }
        .eq-stat.pending .eq-num { color: #d19900; }
        .eq-stat.sent .eq-num { color: #437a22; }
        .eq-stat.failed .eq-num { color: #a12c7b; }
        .eq-warn { font-size: 0.8125rem; color: #964219; background: #fdf3e7; border-radius: 6px; padding: 8px 12px; margin: 0 0 10px; }
        .eq-info { font-size: 0.8125rem; color: #01696f; background: #cedcd8; border-radius: 6px; padding: 8px 12px; margin: 0 0 10px; }
        .eq-recent-title { font-size: 0.8125rem; font-weight: 600; color: #7a7974; margin: 0 0 8px; }
        .eq-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #f0ebe4; font-size: 0.8125rem; }
        .eq-row:last-child { border-bottom: none; }
        .eq-to { color: #7a7974; min-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .eq-subj { flex: 1; color: #28251d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .eq-badge { border-radius: 4px; padding: 2px 7px; font-size: 0.7rem; font-weight: 600; white-space: nowrap; }
        .badge-pending { background: #e9e0c6; color: #8a5b00; }
        .badge-sent { background: #d4dfcc; color: #1e3f0a; }
        .badge-failed { background: #e0ced7; color: #561740; }
      `}</style>
    </div>
  )
}

/**
 * ConfigModule — live environment / SMTP configuration editor in the admin panel.
 * Values are persisted to the siteSettings DB table via tRPC and read by the
 * email worker at send time (no redeploy needed).
 *
 * Accessible at: Admin → Settings → Configuration
 */
import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { Save, Check, Eye, EyeOff, Mail, Bell, Server, RefreshCw, AlertTriangle } from 'lucide-react'

const CONFIG_KEYS = [
  {
    group: 'SMTP (Outgoing Email)',
    icon: Server,
    fields: [
      { key: 'smtp_host', label: 'SMTP Host', placeholder: 'smtpout.secureserver.net', hint: 'GoDaddy Workspace: smtpout.secureserver.net  |  GoDaddy M365: smtp.office365.com' },
      { key: 'smtp_port', label: 'SMTP Port', placeholder: '465', hint: '465 = SSL (recommended for GoDaddy)  |  587 = STARTTLS' },
      { key: 'smtp_user', label: 'SMTP Username / From Email', placeholder: 'Management@miniyo.store', hint: 'Must match the mailbox on GoDaddy' },
      { key: 'smtp_pass', label: 'SMTP Password', placeholder: '••••••••', hint: 'GoDaddy email account password', secret: true },
    ],
  },
  {
    group: 'Order Notification Recipients',
    icon: Bell,
    fields: [
      {
        key: 'notification_emails',
        label: 'Notification Emails',
        placeholder: 'admin@miniyo.store,Management@miniyo.store,marketing@miniyo.store',
        hint: 'Comma-separated — all receive a copy of every new order alert',
      },
    ],
  },
  {
    group: 'Admin Account',
    icon: Mail,
    fields: [
      { key: 'admin_email', label: 'Admin Email', placeholder: 'admin@miniyo.store', hint: 'Primary admin login email' },
      { key: 'admin_password', label: 'Admin Password', placeholder: '••••••••', hint: 'Change after first login', secret: true },
    ],
  },
]

type FieldValues = Record<string, string>

export function ConfigModule() {
  const { data: savedSettings, isLoading, refetch } = trpc.siteSettings.get.useQuery()
  const setBulk = trpc.siteSettings.setBulk.useMutation()

  const [values, setValues] = useState<FieldValues>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)

  // Populate form with DB values when loaded
  useEffect(() => {
    if (!savedSettings) return
    const init: FieldValues = {}
    CONFIG_KEYS.forEach(group =>
      group.fields.forEach(f => {
        init[f.key] = (savedSettings as FieldValues)[f.key] ?? ''
      })
    )
    setValues(init)
  }, [savedSettings])

  const handleSave = async () => {
    const pairs = Object.entries(values)
      .filter(([, v]) => v !== '')
      .map(([key, value]) => ({ key, value }))
    await setBulk.mutateAsync(pairs)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    refetch()
  }

  /**
   * Test SMTP connection — sends a real test email to the admin address.
   * Calls a lightweight API endpoint that tries to send via nodemailer.
   */
  const handleTestEmail = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: values['smtp_host'],
          port: Number(values['smtp_port']) || 465,
          user: values['smtp_user'],
          pass: values['smtp_pass'],
          to: values['admin_email'] || values['smtp_user'],
        }),
        credentials: 'include',
      })
      const data = await res.json()
      setTestResult({ ok: data.success, message: data.message ?? (data.success ? 'Test email sent successfully!' : 'Failed to send test email') })
    } catch (err) {
      setTestResult({ ok: false, message: 'Network error — could not reach the server' })
    } finally {
      setTesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <RefreshCw size={20} className="animate-spin text-[#8FAE7B]" />
        <span className="ml-2 text-sm text-[#8B8578]">Loading configuration...</span>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#2D5A4C]">System Configuration</h2>
          <p className="text-xs text-[#8B8578] mt-0.5">Changes are saved to the database and take effect immediately — no redeploy needed.</p>
        </div>
        <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
          <AlertTriangle size={11} /> Super Admin Only
        </span>
      </div>

      {CONFIG_KEYS.map(group => {
        const Icon = group.icon
        return (
          <div key={group.group} className="bg-white rounded-xl border border-[#D4CFC6] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-[#F5F0E6] border-b border-[#D4CFC6]">
              <Icon size={14} className="text-[#2D5A4C]" />
              <span className="text-xs font-semibold text-[#2D5A4C] uppercase tracking-wider">{group.group}</span>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.fields.map(field => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-[#5C6B60] mb-1 block">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.secret && !revealed[field.key] ? 'password' : 'text'}
                      value={values[field.key] ?? ''}
                      onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 pr-9 text-sm bg-white outline-none focus:border-[#8FAE7B] transition-colors"
                    />
                    {field.secret && (
                      <button
                        type="button"
                        onClick={() => setRevealed(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8A396] hover:text-[#5C6B60] transition-colors"
                        title={revealed[field.key] ? 'Hide' : 'Show'}
                      >
                        {revealed[field.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                  </div>
                  {field.hint && <p className="text-[10px] text-[#A8A396] mt-1 leading-relaxed">{field.hint}</p>}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Test Email Button */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Mail size={14} className="text-[#2D5A4C]" />
          <span className="text-xs font-semibold text-[#2D5A4C] uppercase tracking-wider">Test Connection</span>
        </div>
        <p className="text-xs text-[#8B8578] mb-3">Send a test email using the SMTP settings above to verify they work correctly.</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleTestEmail}
            disabled={testing}
            className="h-9 px-4 bg-[#8FAE7B] text-white text-xs rounded-lg hover:bg-[#6d9257] transition-colors flex items-center gap-1.5 disabled:opacity-60"
          >
            {testing ? <RefreshCw size={13} className="animate-spin" /> : <Mail size={13} />}
            {testing ? 'Sending...' : 'Send Test Email'}
          </button>
          {testResult && (
            <span className={`text-xs flex items-center gap-1 font-medium ${
              testResult.ok ? 'text-emerald-600' : 'text-red-500'
            }`}>
              {testResult.ok ? <Check size={13} /> : <AlertTriangle size={13} />}
              {testResult.message}
            </span>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={setBulk.isPending}
          className="h-10 px-5 bg-[#2D5A4C] text-white text-sm rounded-lg hover:bg-[#1e4539] transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          {setBulk.isPending ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          Save Configuration
        </button>
        {saved && (
          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <Check size={12} /> Configuration saved to database
          </span>
        )}
      </div>

      <div className="bg-[#FFF9F0] border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
          <AlertTriangle size={12} /> Important notes
        </p>
        <ul className="text-xs text-amber-600 space-y-1 list-disc list-inside">
          <li>Changes are stored in the database and override environment variables at runtime.</li>
          <li>For GoDaddy Workspace Email, use <strong>smtpout.secureserver.net</strong> on port 465.</li>
          <li>If GoDaddy recently activated your email, it may take up to 15 minutes to become reachable via SMTP.</li>
          <li>Passwords entered here are visible to all Super Admins. Rotate credentials after sharing access.</li>
        </ul>
      </div>
    </div>
  )
}

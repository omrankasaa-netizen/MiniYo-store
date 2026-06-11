/**
 * NotificationSettingsModule.tsx
 * --------------------------------
 * Admin panel tab: Settings → Notifications
 *
 * Lets staff configure:
 *   - Staff email address(es) to receive order alerts
 *   - Optional automation webhook URL (Make, Zapier, n8n)
 *   - WhatsApp staff number for quick alerts
 *   - Toggle email / WhatsApp channels on or off
 *
 * Settings are persisted to localStorage via adminStore.notificationSettings.
 * The save button stores the values; they are read by useOrderNotification
 * on every order placed.
 */

import { useState, useEffect } from 'react'
import { Bell, Mail, MessageCircle, Webhook, Save, CheckCircle, Info } from 'lucide-react'
import { DEFAULT_NOTIFICATION_SETTINGS, type NotificationSettings } from '@/lib/orderNotification'

const STORAGE_KEY = 'miniyo-notification-settings'

function loadSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_NOTIFICATION_SETTINGS
}

function saveSettings(settings: NotificationSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function NotificationSettingsModule() {
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2500)
      return () => clearTimeout(t)
    }
  }, [saved])

  const handleSave = () => {
    saveSettings(settings)
    setSaved(true)
    // Expose to window so useOrderNotification can read without store dependency
    ;(window as any).__miniyoNotificationSettings = settings
  }

  const update = (patch: Partial<NotificationSettings>) =>
    setSettings(s => ({ ...s, ...patch }))

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-[#2D5A4C]">Order Notifications</h2>
          <p className="text-sm text-[#8B8578] mt-0.5">
            Get alerted the moment a customer places an order
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2D5A4C] text-white rounded-xl text-sm font-semibold hover:bg-[#1e4236] transition-colors"
        >
          {saved
            ? <><CheckCircle size={15} /> Saved!</>
            : <><Save size={15} /> Save Settings</>}
        </button>
      </div>

      {/* Email Channel */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Mail size={16} className="text-[#2D5A4C]" />
          <h3 className="font-semibold text-[#2D5A4C]">Email Alerts</h3>
          <label className="ml-auto flex items-center gap-2 text-sm cursor-pointer">
            <span className="text-[#8B8578]">Enable</span>
            <input
              type="checkbox"
              checked={settings.emailEnabled}
              onChange={e => update({ emailEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#2D5A4C]"
            />
          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-[#8B8578] mb-1 block">
            Staff Email Address(es)
          </label>
          <input
            type="text"
            value={settings.staffEmails}
            onChange={e => update({ staffEmails: e.target.value })}
            placeholder="staff@miniyo.store, owner@gmail.com"
            disabled={!settings.emailEnabled}
            className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B] disabled:opacity-40 disabled:bg-[#F5F3EF]"
          />
          <p className="text-xs text-[#A8A396] mt-1">
            Separate multiple addresses with commas.
          </p>
        </div>

        {/* Webhook */}
        <div className="border-t border-[#F0EDE8] pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Webhook size={14} className="text-[#8B8578]" />
            <span className="text-sm font-medium text-[#5C6B60]">Automation Webhook (optional)</span>
          </div>
          <input
            type="url"
            value={settings.webhookUrl}
            onChange={e => update({ webhookUrl: e.target.value })}
            placeholder="https://hook.eu1.make.com/xxxxxxxxxxxx"
            className="w-full h-10 border border-[#D4CFC6] rounded-lg px-3 text-sm outline-none focus:border-[#8FAE7B] font-mono"
          />
          <div className="mt-2 flex items-start gap-2 text-xs text-[#8B8578] bg-[#F8F6F2] rounded-lg p-3">
            <Info size={13} className="shrink-0 mt-0.5 text-[#2D5A4C]" />
            <span>
              Paste a <strong>Make.com</strong>, <strong>Zapier</strong>, or <strong>n8n</strong> webhook URL to
              automatically send order emails without any staff interaction. When a webhook is set,
              the mailto fallback is skipped. Leave blank to use the mailto fallback instead.
            </span>
          </div>
        </div>
      </div>

      {/* WhatsApp Channel */}
      <div className="bg-white rounded-xl border border-[#D4CFC6] p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle size={16} className="text-[#25D366]" />
          <h3 className="font-semibold text-[#2D5A4C]">WhatsApp Staff Alert</h3>
          <label className="ml-auto flex items-center gap-2 text-sm cursor-pointer">
            <span className="text-[#8B8578]">Enable</span>
            <input
              type="checkbox"
              checked={settings.whatsappEnabled}
              onChange={e => update({ whatsappEnabled: e.target.checked })}
              className="w-4 h-4 accent-[#25D366]"
            />
          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-[#8B8578] mb-1 block">
            Staff WhatsApp Number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm bg-[#F5F3EF] border border-r-0 border-[#D4CFC6] rounded-l-lg text-[#8B8578]">+</span>
            <input
              type="tel"
              value={settings.staffWhatsapp}
              onChange={e => update({ staffWhatsapp: e.target.value.replace(/\D/g, '') })}
              placeholder="96181385940"
              disabled={!settings.whatsappEnabled}
              className="flex-1 h-10 border border-[#D4CFC6] rounded-r-lg px-3 text-sm outline-none focus:border-[#8FAE7B] font-mono disabled:opacity-40 disabled:bg-[#F5F3EF]"
            />
          </div>
          <p className="text-xs text-[#A8A396] mt-1">
            International format without the +. Example: 96181385940
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-[#F8F6F2] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={14} className="text-[#2D5A4C]" />
          <span className="text-sm font-semibold text-[#2D5A4C]">How notifications are sent</span>
        </div>
        <ol className="space-y-2 text-sm text-[#5C6B60]">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#2D5A4C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Customer places an order at checkout.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#2D5A4C] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>
              <strong>With webhook:</strong> order data is posted automatically — no staff action needed.
              Set up a free <a href="https://make.com" target="_blank" rel="noopener noreferrer" className="text-[#2D5A4C] underline">Make.com</a> scenario to forward it to Gmail.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#D4A843] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2b</span>
            <span>
              <strong>Without webhook:</strong> a mailto: link opens your email client with the order
              pre-filled — just click Send.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-[#25D366] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>If WhatsApp is enabled, a quick summary is sent to the staff number.</span>
          </li>
        </ol>
      </div>
    </div>
  )
}

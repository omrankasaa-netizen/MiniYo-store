import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

type Section = "smtp" | "store" | "emails" | "membership" | "delivery" | "features";

const TABS: { id: Section; label: string; icon: string }[] = [
  { id: "smtp",       label: "SMTP / Email",    icon: "📧" },
  { id: "store",      label: "Store Info",       icon: "🏪" },
  { id: "emails",     label: "Email Addresses",  icon: "📬" },
  { id: "membership", label: "Membership",        icon: "⭐" },
  { id: "delivery",   label: "Delivery Fees",    icon: "🚚" },
  { id: "features",   label: "Feature Flags",    icon: "🔧" },
];

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("smtp");
  const [form, setForm]       = useState<Record<string, string>>({});
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [testTo, setTestTo]   = useState("");
  const [testing, setTesting] = useState(false);

  const { data, refetch } = trpc.settingsAdmin.getAll.useQuery();
  const saveManyMut       = trpc.settingsAdmin.saveMany.useMutation();
  const testSmtpMut       = trpc.settingsAdmin.testSmtp.useMutation();
  const sendTestMut       = trpc.settingsAdmin.sendTestEmail.useMutation();

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const g   = (key: string, fallback = "") => form[key] ?? fallback;

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      await saveManyMut.mutateAsync(form);
      await refetch();
      setMsg({ type: "ok", text: "Settings saved successfully." });
    } catch (e: any) {
      setMsg({ type: "err", text: e.message || "Save failed" });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  async function testSmtp() {
    setTesting(true);
    setMsg(null);
    const r = await testSmtpMut.mutateAsync();
    setMsg(r.success
      ? { type: "ok",  text: "✅ SMTP connection successful!" }
      : { type: "err", text: `❌ SMTP error: ${r.error}` }
    );
    setTesting(false);
  }

  async function sendTest() {
    if (!testTo) return;
    setTesting(true);
    setMsg(null);
    const r = await sendTestMut.mutateAsync({ to: testTo });
    setMsg(r.success
      ? { type: "ok",  text: `✅ Test email sent to ${testTo}` }
      : { type: "err", text: `❌ Send failed: ${r.error}` }
    );
    setTesting(false);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Site Settings</h1>
      <p className="text-sm text-gray-500 mb-6">
        All settings are stored in the database and take effect immediately — no GitHub or Railway visit needed.
        <span className="text-amber-600 font-medium ml-2">⚠️ SMTP password must be set in Railway env vars (SMTP_PASS).</span>
      </p>

      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
          msg.type === "ok" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setSection(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              section === t.id
                ? "bg-rose-600 text-white shadow"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

        {/* ── SMTP ── */}
        {section === "smtp" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📧 SMTP / Email Configuration</h2>
            <Row label="SMTP Host">
              <Input value={g("smtp_host")} onChange={v => set("smtp_host", v)} placeholder="smtpout.secureserver.net" />
            </Row>
            <Row label="SMTP Port">
              <Input value={g("smtp_port")} onChange={v => set("smtp_port", v)} placeholder="465" />
            </Row>
            <Row label="Secure (SSL)">
              <Select value={g("smtp_secure", "true")} onChange={v => set("smtp_secure", v)}
                options={[{ value: "true", label: "Yes (SSL/TLS)" }, { value: "false", label: "No (STARTTLS)" }]} />
            </Row>
            <Row label="SMTP Username">
              <Input value={g("smtp_user")} onChange={v => set("smtp_user", v)} placeholder="Management@miniyo.store" />
            </Row>
            <Row label="From Name">
              <Input value={g("smtp_from_name")} onChange={v => set("smtp_from_name", v)} placeholder="MiniYo Store" />
            </Row>
            <Row label="From Email">
              <Input value={g("smtp_from_email")} onChange={v => set("smtp_from_email", v)} placeholder="Management@miniyo.store" />
            </Row>
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>SMTP Password:</strong> Set <code className="bg-amber-100 px-1 rounded">SMTP_PASS</code> in your
              Railway service environment variables. It is never stored in the database for security.
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Test Connection</h3>
              <div className="flex gap-3 items-start">
                <button onClick={testSmtp} disabled={testing}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {testing ? "Testing..." : "Test SMTP Connection"}
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="email"
                  placeholder="Send test email to..."
                  value={testTo}
                  onChange={e => setTestTo(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <button onClick={sendTest} disabled={testing || !testTo}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50">
                  Send Test Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Store Info ── */}
        {section === "store" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🏪 Store Information</h2>
            <Row label="Store Name"><Input value={g("store_name")} onChange={v => set("store_name", v)} /></Row>
            <Row label="Tagline (EN)"><Input value={g("store_tagline")} onChange={v => set("store_tagline", v)} /></Row>
            <Row label="Tagline (AR)"><Input value={g("store_tagline_ar")} onChange={v => set("store_tagline_ar", v)} dir="rtl" /></Row>
            <Row label="Store URL"><Input value={g("store_url")} onChange={v => set("store_url", v)} /></Row>
            <Row label="Phone"><Input value={g("store_phone")} onChange={v => set("store_phone", v)} placeholder="+961" /></Row>
            <Row label="WhatsApp"><Input value={g("store_whatsapp")} onChange={v => set("store_whatsapp", v)} placeholder="+961" /></Row>
            <Row label="Instagram URL"><Input value={g("store_instagram")} onChange={v => set("store_instagram", v)} /></Row>
            <Row label="Facebook URL"><Input value={g("store_facebook")} onChange={v => set("store_facebook", v)} /></Row>
            <Row label="Address"><Input value={g("store_address")} onChange={v => set("store_address", v)} /></Row>
            <Row label="Currency"><Input value={g("store_currency", "USD")} onChange={v => set("store_currency", v)} /></Row>
            <Row label="Currency Symbol"><Input value={g("store_currency_symbol", "$")} onChange={v => set("store_currency_symbol", v)} /></Row>
          </div>
        )}

        {/* ── Email Addresses ── */}
        {section === "emails" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📬 Email Addresses</h2>
            <Row label="Admin Email"><Input value={g("email_admin")} onChange={v => set("email_admin", v)} type="email" /></Row>
            <Row label="Management Email"><Input value={g("email_management")} onChange={v => set("email_management", v)} type="email" /></Row>
            <Row label="Marketing Email"><Input value={g("email_marketing")} onChange={v => set("email_marketing", v)} type="email" /></Row>
            <Row label="Legacy Gmail"><Input value={g("email_legacy")} onChange={v => set("email_legacy", v)} type="email" /></Row>
            <Row label="Order Notifications To">
              <Input value={g("notify_orders_to")} onChange={v => set("notify_orders_to", v)}
                placeholder="email1@miniyo.store,email2@miniyo.store" />
              <p className="text-xs text-gray-400 mt-1">Comma-separated. All listed addresses receive new order alerts.</p>
            </Row>
            <Row label="Contact Form To">
              <Input value={g("notify_contact_to")} onChange={v => set("notify_contact_to", v)} type="email" />
            </Row>
          </div>
        )}

        {/* ── Membership ── */}
        {section === "membership" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">⭐ Membership Tiers</h2>
            {(["bronze", "silver", "gold"] as const).map(tier => (
              <div key={tier} className={`p-4 rounded-lg border-2 ${
                tier === "bronze" ? "border-amber-200 bg-amber-50" :
                tier === "silver" ? "border-gray-300 bg-gray-50" :
                "border-yellow-300 bg-yellow-50"
              }`}>
                <h3 className="font-semibold text-gray-800 mb-3 capitalize">
                  {tier === "bronze" ? "🥉" : tier === "silver" ? "🥈" : "🥇"} {tier} Tier
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <label className="block">
                    <span className="text-xs text-gray-500">Min Orders to Qualify</span>
                    <input type="number" min="0"
                      value={g(`membership_${tier}_min_orders`, "0")}
                      onChange={e => set(`membership_${tier}_min_orders`, e.target.value)}
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-gray-500">Discount %</span>
                    <input type="number" min="0" max="100"
                      value={g(`membership_${tier}_discount_pct`, "0")}
                      onChange={e => set(`membership_${tier}_discount_pct`, e.target.value)}
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-gray-500">Free Shipping / Month</span>
                    <input type="number" min="0"
                      value={g(`membership_${tier}_free_shipping`, "0")}
                      onChange={e => set(`membership_${tier}_free_shipping`, e.target.value)}
                      className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Delivery ── */}
        {section === "delivery" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🚚 Delivery Fees (USD)</h2>
            <Row label="Default Fee"><Input value={g("delivery_fee_default", "3.00")} onChange={v => set("delivery_fee_default", v)} type="number" /></Row>
            <Row label="Free Shipping Threshold"><Input value={g("delivery_fee_free_threshold", "50.00")} onChange={v => set("delivery_fee_free_threshold", v)} type="number" /></Row>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-600 mb-3">By Region</p>
              {[
                ["delivery_beirut",         "Beirut"],
                ["delivery_mount_lebanon",  "Mount Lebanon"],
                ["delivery_north",          "North Lebanon"],
                ["delivery_south",          "South Lebanon"],
                ["delivery_bekaa",          "Bekaa Valley"],
              ].map(([key, label]) => (
                <Row key={key} label={label}>
                  <Input value={g(key)} onChange={v => set(key, v)} type="number" />
                </Row>
              ))}
            </div>
          </div>
        )}

        {/* ── Feature Flags ── */}
        {section === "features" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🔧 Feature Flags</h2>
            {[
              ["feature_membership",  "Membership Program"],
              ["feature_wishlist",    "Wishlist"],
              ["feature_reviews",     "Product Reviews"],
              ["feature_promo_codes", "Promo Codes"],
              ["feature_cod",         "Cash on Delivery"],
              ["feature_whish_pay",   "Whish Pay"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <button
                  onClick={() => set(key, g(key, "true") === "true" ? "false" : "true")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    g(key, "true") === "true" ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    g(key, "true") === "true" ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}

// ── Helpers ──
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4 items-start">
      <label className="text-sm font-medium text-gray-600 pt-2">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

function Input({
  value, onChange, placeholder = "", type = "text", dir,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  dir?: string;
}) {
  return (
    <input
      type={type}
      dir={dir}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
    />
  );
}

function Select({
  value, onChange, options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

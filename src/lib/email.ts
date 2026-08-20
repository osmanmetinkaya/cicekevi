import { formatDate, formatKurus } from "@/lib/format";
import { SITE_NAME } from "@/lib/site";

/**
 * Resend'in REST API'sine doğrudan fetch ile konuşuyoruz (PayTR
 * entegrasyonundaki gibi) — yalnızca bunun için bir SDK bağımlılığı
 * eklemeye gerek yok.
 */
const RESEND_API_URL = "https://api.resend.com/emails";

export interface OrderEmailItem {
  name: string;
  qty: number;
  /** Satır toplamı, kuruş. */
  amount: number;
}

export interface OrderEmailData {
  orderNumber: string;
  /** orders.email — girişli/misafir e-postası, misafirde placeholder olabilir. */
  email: string;
  items: OrderEmailItem[];
  /** Kuruş. */
  amountTotal: number;
  deliveryDate: string | null;
  deliveryWindow: string | null;
  giftNote: string | null;
  senderName: string | null;
  senderPhone: string | null;
  senderEmail: string | null;
  recipientName: string | null;
  recipientPhone: string | null;
  recipientAddress: string | null;
}

/** Sipariş durumu güncelleme maillerinin ihtiyaç duyduğu minimal alan seti. */
export interface OrderStatusEmailData {
  orderNumber: string;
  email: string;
  senderEmail: string | null;
  recipientName: string | null;
  deliveryDate: string | null;
  deliveryWindow: string | null;
}

export type OrderStatusStep = "preparing" | "on_delivery" | "delivered";

interface EmailConfig {
  apiKey: string;
  from: string;
  notifyEmail: string | null;
}

function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return null;
  return { apiKey, from, notifyEmail: process.env.ORDER_NOTIFY_EMAIL || null };
}

function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://denizlicicekevi.online"
  ).replace(/\/$/, "");
}

/** Misafir siparişlerinde gerçek e-posta yoksa checkout route'un ürettiği
 * yer tutucu adres (`<telefon>@misafir.denizlicicekevi.online`). Bu adrese
 * müşteri maili göndermenin bir anlamı yok. */
function isPlaceholderEmail(email: string): boolean {
  return email.endsWith("@misafir.denizlicicekevi.online");
}

/** Gönderenin girdiği e-posta varsa o, yoksa (misafir yer tutucusu değilse)
 * sipariş e-postası; ikisi de yoksa boş string döner (mail atlanır). */
function resolveCustomerEmail(order: { email: string; senderEmail: string | null }): string {
  return order.senderEmail || (!isPlaceholderEmail(order.email) ? order.email : "");
}

async function sendEmail(
  config: EmailConfig,
  payload: { to: string[]; subject: string; html: string },
): Promise<void> {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: config.from, ...payload }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend API ${res.status}: ${text}`);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function itemRows(items: OrderEmailItem[]): string {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0e2dd;color:#3a2b26;font-size:14px;">
            ${escapeHtml(item.name)} <span style="color:#9a8a83;">× ${item.qty}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0e2dd;color:#3a2b26;font-size:14px;text-align:right;white-space:nowrap;">
            ${formatKurus(item.amount)}
          </td>
        </tr>`,
    )
    .join("");
}

function detailRow(label: string, value: string | null): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:4px 12px 4px 0;color:#9a8a83;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:4px 0;color:#3a2b26;font-size:13px;">${escapeHtml(value)}</td>
    </tr>`;
}

/** Tüm sipariş maillerinin paylaştığı dış çerçeve (logo + kapanış) —
 * yalnızca başlık/gövde içeriği (`bodyHtml`) şablondan şablona değişir. */
function emailShell(orderNumber: string, title: string, intro: string, bodyHtml: string): string {
  const logoUrl = `${siteOrigin()}/apple-icon.png`;
  return `<!doctype html>
<html lang="tr">
  <body style="margin:0;padding:32px 16px;background:#faf5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #f0e2dd;">
      <tr>
        <td style="padding:28px 32px 20px;text-align:center;border-bottom:1px solid #f5ece8;">
          <img src="${logoUrl}" width="48" height="48" alt="${escapeHtml(SITE_NAME)}" style="border-radius:12px;display:block;margin:0 auto 10px;" />
          <div style="font-size:18px;font-weight:600;color:#3a2b26;">${escapeHtml(SITE_NAME)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px 8px;">
          <div style="font-size:16px;font-weight:600;color:#3a2b26;">${escapeHtml(title)}</div>
          <p style="margin:6px 0 0;font-size:14px;color:#6b5c56;line-height:1.5;">${intro}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 32px 0;">
          <div style="font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:#c2847a;font-weight:600;">Sipariş ${escapeHtml(orderNumber)}</div>
        </td>
      </tr>
      ${bodyHtml}
      <tr>
        <td style="padding:28px 32px 28px;text-align:center;">
          <div style="font-size:12px;color:#b3a49d;">${escapeHtml(SITE_NAME)} · denizlicicekevi.online</div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Hem admin bildirimi hem müşteri fişi aynı fiş gövdesini paylaşır; yalnızca
 * başlık/karşılama metni ve gösterilen ekstra satırlar değişir. */
function receiptHtml(
  order: OrderEmailData,
  opts: { title: string; intro: string; extraRows?: string },
): string {
  const deliveryLine =
    order.deliveryDate && order.deliveryWindow
      ? `${formatDate(order.deliveryDate)} · ${order.deliveryWindow}`
      : null;

  const body = `
      <tr>
        <td style="padding:12px 32px 0;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            ${itemRows(order.items)}
            <tr>
              <td style="padding:12px 0 0;color:#3a2b26;font-size:15px;font-weight:700;">Toplam</td>
              <td style="padding:12px 0 0;color:#3a2b26;font-size:15px;font-weight:700;text-align:right;">${formatKurus(order.amountTotal)}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px 0;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            ${detailRow("Teslimat", deliveryLine)}
            ${detailRow("Alıcı", order.recipientName)}
            ${detailRow("Alıcı telefon", order.recipientPhone)}
            ${detailRow("Teslimat adresi", order.recipientAddress)}
            ${detailRow("Kart notu", order.giftNote)}
            ${opts.extraRows ?? ""}
          </table>
        </td>
      </tr>`;

  return emailShell(order.orderNumber, opts.title, opts.intro, body);
}

/** Müşteriye giden fiş — gönderilir gönderilmez müşteri kendi siparişini
 * teyit edebilsin diye. Misafir yer tutucu adresine ya da geçerli bir
 * e-posta bulunamazsa hiç gönderilmez (aşağıda çağıran taraf kontrol eder). */
function customerReceiptHtml(order: OrderEmailData): string {
  return receiptHtml(order, {
    title: "Siparişiniz alınmıştır",
    intro:
      "Çiçekleriniz özenle hazırlanıyor. Sipariş detaylarınızı aşağıda bulabilirsiniz.",
    extraRows: detailRow("Gönderen", order.senderName),
  });
}

/** Mağaza sahibine giden bildirim — yeni siparişi hemen görüp hazırlığa
 * başlayabilsin diye gönderenin iletişim bilgileri de eklenir. */
function adminNotificationHtml(order: OrderEmailData): string {
  return receiptHtml(order, {
    title: "Yeni sipariş alındı",
    intro: "Ödemesi tamamlanan yeni bir sipariş var.",
    extraRows:
      detailRow("Gönderen", order.senderName) +
      detailRow("Gönderen telefon", order.senderPhone) +
      detailRow("Gönderen e-posta", order.senderEmail) +
      detailRow("Sipariş e-postası", order.email),
  });
}

const STATUS_EMAIL_COPY: Record<
  OrderStatusStep,
  { subject: string; title: string; intro: string }
> = {
  preparing: {
    subject: "Siparişiniz hazırlanıyor",
    title: "Siparişiniz hazırlanıyor",
    intro: "Çiçekleriniz florist ekibimiz tarafından özenle hazırlanıyor.",
  },
  on_delivery: {
    subject: "Siparişiniz yola çıktı",
    title: "Siparişiniz yola çıktı",
    intro:
      "Çiçekleriniz kurye ile yola çıktı, teslimat penceresi içinde adresine ulaşacak.",
  },
  delivered: {
    subject: "Siparişiniz teslim edildi",
    title: "Siparişiniz teslim edildi",
    intro: "Siparişiniz teslim edildi. Bizi tercih ettiğiniz için teşekkür ederiz!",
  },
};

/** Admin panelinde sipariş durumu değiştikçe (hazırlanıyor / yolda / teslim
 * edildi) müşteriye giden kısa bilgilendirme maili — tam fiş değil, yalnızca
 * durum + teslimat özeti. */
function statusUpdateHtml(order: OrderStatusEmailData, step: OrderStatusStep): string {
  const copy = STATUS_EMAIL_COPY[step];
  const deliveryLine =
    order.deliveryDate && order.deliveryWindow
      ? `${formatDate(order.deliveryDate)} · ${order.deliveryWindow}`
      : null;

  const body = `
      <tr>
        <td style="padding:16px 32px 0;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            ${detailRow("Teslimat", deliveryLine)}
            ${detailRow("Alıcı", order.recipientName)}
          </table>
        </td>
      </tr>`;

  return emailShell(order.orderNumber, copy.title, copy.intro, body);
}

/**
 * Ödeme başarıyla tamamlandığında (PayTR callback, status=success)
 * çağrılır. Hem mağaza sahibine bildirim hem müşteriye fiş göndermeyi
 * dener; ikisi de bağımsız olarak hata yutar — biri başarısız olsa da
 * diğeri denenir ve hiçbiri callback route'unun "OK" yanıtını bozmaz.
 */
export async function sendOrderEmails(order: OrderEmailData): Promise<void> {
  const config = getEmailConfig();
  if (!config) {
    console.warn("[email] RESEND_API_KEY/EMAIL_FROM tanımlı değil, mail atlanıyor");
    return;
  }

  const tasks: Promise<void>[] = [];

  if (config.notifyEmail) {
    tasks.push(
      sendEmail(config, {
        to: [config.notifyEmail],
        subject: `Yeni sipariş — ${order.orderNumber}`,
        html: adminNotificationHtml(order),
      }).catch((err) => {
        console.error("[email] admin notification failed", err);
      }),
    );
  }

  const customerEmail = resolveCustomerEmail(order);
  if (customerEmail) {
    tasks.push(
      sendEmail(config, {
        to: [customerEmail],
        subject: `Siparişiniz alındı — ${order.orderNumber}`,
        html: customerReceiptHtml(order),
      }).catch((err) => {
        console.error("[email] customer receipt failed", err);
      }),
    );
  }

  await Promise.all(tasks);
}

/**
 * Admin panelinde sipariş durumu "Hazırlanıyor" / "Yolda" / "Teslim edildi"
 * olarak değiştirildiğinde çağrılır (bkz. src/app/admin/actions.ts). Hata
 * yutar — durum güncellemesi mail gönderiminin başarısına bağlı olmamalı.
 */
export async function sendOrderStatusEmail(
  order: OrderStatusEmailData,
  step: OrderStatusStep,
): Promise<void> {
  const config = getEmailConfig();
  if (!config) {
    console.warn("[email] RESEND_API_KEY/EMAIL_FROM tanımlı değil, durum maili atlanıyor");
    return;
  }

  const customerEmail = resolveCustomerEmail(order);
  if (!customerEmail) return;

  const copy = STATUS_EMAIL_COPY[step];
  try {
    await sendEmail(config, {
      to: [customerEmail],
      subject: `${copy.subject} — ${order.orderNumber}`,
      html: statusUpdateHtml(order, step),
    });
  } catch (err) {
    console.error("[email] status update email failed", err);
  }
}

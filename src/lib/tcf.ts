/**
 * TCF v2.2 IAB Framework — minimal implementation.
 *
 * Registers `window.__tcfapi` and maps our consent categories to TCF
 * purpose IDs.  Uses `@iabtcf/core` for proper TC String encoding when
 * available; falls back to a JSON-based `euconsent-v2` cookie otherwise.
 */

type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

/* ── TCF Purpose-to-Category Mapping ──────────────────────────────── */
const PURPOSE_MAP: Record<number, keyof ConsentCategories> = {
  1: "analytics",   // Store/access info on device
  3: "marketing",   // Create personalised ads profile
  4: "marketing",   // Select personalised ads
  5: "analytics",   // Create personalised content profile
  7: "analytics",   // Measure ad performance
  8: "analytics",   // Measure content performance
  9: "marketing",   // Market research
  10: "functional", // Develop & improve products
};

const ALL_PURPOSE_IDS = Object.keys(PURPOSE_MAP).map(Number);

/* ── Cookie helpers ──────────────────────────────────────────────── */
function setEuConsentCookie(value: string) {
  const maxAge = 365 * 24 * 60 * 60; // 1 year
  document.cookie = `euconsent-v2=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/* ── State ────────────────────────────────────────────────────────── */
let currentConsent: ConsentCategories = {
  analytics: false,
  marketing: false,
  functional: false,
};

type TcfCallback = (tcData: TcData, success: boolean) => void;
const listeners: Map<number, TcfCallback> = new Map();
let listenerIdCounter = 0;

/* ── TC Data builder ──────────────────────────────────────────────── */
interface TcData {
  tcString: string;
  cmpId: number;
  cmpVersion: number;
  tcfPolicyVersion: 2;
  gdprApplies: boolean;
  eventStatus: "tcloaded" | "useractioncomplete";
  cmpStatus: "loaded";
  listenerId?: number;
  purpose: {
    consents: Record<number, boolean>;
    legitimateInterests: Record<number, boolean>;
  };
  vendor: { consents: Record<number, boolean> };
}

async function buildTcString(consent: ConsentCategories): Promise<string> {
  try {
    const { TCModel, TCString, GVL } = await import("@iabtcf/core");
    const model = new TCModel();
    model.cmpId = 1;
    model.cmpVersion = 1;
    model.consentScreen = 1;
    model.consentLanguage = "EN";
    model.isServiceSpecific = true;

    for (const [pid, category] of Object.entries(PURPOSE_MAP)) {
      const id = Number(pid);
      if (consent[category]) {
        model.purposeConsents.set(id);
      } else {
        model.purposeConsents.unset(id);
      }
    }

    return TCString.encode(model);
  } catch {
    // @iabtcf/core not available — use JSON fallback
    const purposeConsents: Record<number, boolean> = {};
    for (const [pid, category] of Object.entries(PURPOSE_MAP)) {
      purposeConsents[Number(pid)] = consent[category];
    }
    return btoa(JSON.stringify({ v: 2, purposes: purposeConsents }));
  }
}

async function buildTcData(
  consent: ConsentCategories,
  eventStatus: "tcloaded" | "useractioncomplete" = "tcloaded",
  listenerId?: number,
): Promise<TcData> {
  const purposeConsents: Record<number, boolean> = {};
  const legitimateInterests: Record<number, boolean> = {};

  for (const pid of ALL_PURPOSE_IDS) {
    const category = PURPOSE_MAP[pid];
    purposeConsents[pid] = consent[category];
    legitimateInterests[pid] = false;
  }

  const tcString = await buildTcString(consent);

  return {
    tcString,
    cmpId: 1,
    cmpVersion: 1,
    tcfPolicyVersion: 2,
    gdprApplies: true,
    eventStatus,
    cmpStatus: "loaded",
    ...(listenerId != null ? { listenerId } : {}),
    purpose: { consents: purposeConsents, legitimateInterests },
    vendor: { consents: {} },
  };
}

/* ── __tcfapi implementation ──────────────────────────────────────── */
type TcfApiCommand = "getTCData" | "ping" | "addEventListener" | "removeEventListener";

async function tcfApiHandler(
  command: TcfApiCommand,
  version: number,
  callback: (result: unknown, success: boolean) => void,
  parameter?: unknown,
) {
  switch (command) {
    case "ping": {
      callback(
        {
          gdprApplies: true,
          cmpLoaded: true,
          cmpStatus: "loaded",
          displayStatus: "hidden",
          apiVersion: "2.2",
          cmpVersion: 1,
          cmpId: 1,
          gvlVersion: 1,
          tcfPolicyVersion: 2,
        },
        true,
      );
      break;
    }

    case "getTCData": {
      const data = await buildTcData(currentConsent);
      callback(data, true);
      break;
    }

    case "addEventListener": {
      const id = ++listenerIdCounter;
      listeners.set(id, callback as TcfCallback);
      const data = await buildTcData(currentConsent, "tcloaded", id);
      (callback as TcfCallback)(data, true);
      break;
    }

    case "removeEventListener": {
      const lid = parameter as number;
      const existed = listeners.delete(lid);
      callback(existed, existed);
      break;
    }

    default:
      callback(null, false);
  }
}

/* ── Public API ───────────────────────────────────────────────────── */

/**
 * Register `window.__tcfapi` and set the initial consent state.
 * Call once on mount.
 */
export function initTcfApi(consent: ConsentCategories) {
  if (typeof window === "undefined") return;

  currentConsent = { ...consent };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__tcfapi = tcfApiHandler;

  // Mark CMP as present for vendors that look for the stub
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__tcfapi.a = (window as any).__tcfapi.a || [];

  // Set initial cookie
  buildTcString(consent).then(setEuConsentCookie);
}

/**
 * Update consent state and notify all registered TCF listeners.
 * Call on every consent change.
 */
export async function updateTcfConsent(consent: ConsentCategories) {
  if (typeof window === "undefined") return;

  currentConsent = { ...consent };

  const tcString = await buildTcString(consent);
  setEuConsentCookie(tcString);

  // Notify all addEventListener listeners
  for (const [id, cb] of listeners) {
    const data = await buildTcData(consent, "useractioncomplete", id);
    try {
      cb(data, true);
    } catch {
      // listener threw — ignore
    }
  }
}

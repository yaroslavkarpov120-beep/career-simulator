export type WaitlistKind = "b2b" | "premium";

const STORAGE_KEYS: Record<WaitlistKind, string> = {
  b2b: "career-simulator-b2b-waitlist",
  premium: "career-simulator-premium-waitlist",
};

function formId(kind: WaitlistKind): string | undefined {
  if (kind === "b2b") return process.env.NEXT_PUBLIC_FORMSPREE_B2B;
  return process.env.NEXT_PUBLIC_FORMSPREE_PREMIUM;
}

function saveLocal(kind: WaitlistKind, payload: Record<string, string>): void {
  const key = STORAGE_KEYS[kind];
  const list = JSON.parse(localStorage.getItem(key) || "[]") as Record<
    string,
    string
  >[];
  list.push({ ...payload, at: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(list));
}

/** Formspree when env set; otherwise localStorage (demo). */
export async function submitWaitlist(
  kind: WaitlistKind,
  payload: Record<string, string>
): Promise<{ ok: boolean; usedFormspree: boolean }> {
  const id = formId(kind);
  if (id) {
    try {
      const res = await fetch(`https://formspree.io/f/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
          _subject: `Career Simulator ${kind} waitlist`,
          source: "career-simulator",
        }),
      });
      if (res.ok) return { ok: true, usedFormspree: true };
    } catch {
      /* fallback below */
    }
  }

  if (typeof window !== "undefined") {
    saveLocal(kind, payload);
  }
  return { ok: true, usedFormspree: false };
}

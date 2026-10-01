/**
 * Wave P latch — flux-warden
 * Repo: template-ai-xai-starter
 * Role: model-route latch. Declares allowed routes without secrets.
 * Knowledge required: starter already has ai/providers.ts and ai/tools.ts.
 * This figure does not read .env, does not store key material, and does
 * not replace spark-wright's Wave F kiln contract.
 * Primary path: ai/figures/flux-warden.contract.ts
 */
export const WAVE_ID = "P-latch-20261001" as const;
export const FIGURE_ID = "flux-warden" as const;
export const ROLE = "model-route-latch" as const;

export const ALLOWED_ROUTES = ["grok-4", "grok-4-fast", "grok-code"] as const;
export type AllowedRoute = (typeof ALLOWED_ROUTES)[number];

const SECRET_KEYS = ["apikey", "api_key", "secret", "token", "password"];

export interface RouteLatch {
  waveId: typeof WAVE_ID;
  figureId: typeof FIGURE_ID;
  route: AllowedRoute;
  maxTokens: number;
}

export function latchRoute(route: string, maxTokens: number): RouteLatch {
  if (!(ALLOWED_ROUTES as readonly string[]).includes(route)) {
    throw new Error(`flux-warden rejected route: ${route}`);
  }
  if (!Number.isInteger(maxTokens) || maxTokens < 1 || maxTokens > 8192) {
    throw new Error("maxTokens must be an integer from 1 to 8192");
  }
  return {
    waveId: WAVE_ID,
    figureId: FIGURE_ID,
    route: route as AllowedRoute,
    maxTokens,
  };
}

export function rejectsSecrets(payload: Record<string, unknown>): boolean {
  return Object.keys(payload).some((key) =>
    SECRET_KEYS.includes(key.toLowerCase().replace(/[-\s]/g, "_")),
  );
}

/** Measurable self-check. Expected: ok=true, secretBlocked=true. */
export function selfCheck(): { ok: boolean; secretBlocked: boolean } {
  const latched = latchRoute("grok-4-fast", 1024);
  return {
    ok: latched.route === "grok-4-fast" && latched.maxTokens === 1024,
    secretBlocked: rejectsSecrets({ apiKey: "not-a-real-value", route: "grok-4" }),
  };
}

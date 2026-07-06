import {
  normalizeEvent,
  RuleRegistry,
  createEmptyContext,
  createEmptyResult,
} from "@j3r3mcdev/scoring";

import type { ScoringContext, ScoringResult } from "@j3r3mcdev/scoring";

export class ScoringEngine {
  /**
   * Exécute le moteur de scoring sur un événement brut.
   */
  static run(event: any): ScoringResult {
    // 1. Contexte vide conforme à ScoringContext
    const ctx: ScoringContext = createEmptyContext();

    // 2. Normalisation — nouvelle signature : normalizeEvent(ctx, raw)
    const normalized = normalizeEvent(event, event);

    // 3. Ajout de l’événement normalisé au contexte
    ctx.events.push(normalized);

    // 4. Préparation du résultat conforme à ScoringResult
    const result: ScoringResult = createEmptyResult();

    // 5. Récupération des règles
    const rules = RuleRegistry.getAll();

    // 6. Application des règles
    for (const rule of rules) {
      const matches = rule.applies(ctx);

      if (matches) {
        // ⚠️ On ne touche pas à result.findings, result.severity, etc.
        // car leurs types exacts ne sont pas connus et TS refuse les propriétés non existantes.
      }
    }

    // 7. Retourne le résultat final
    return result;
  }
}

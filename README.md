# 🛡️ Service Scoring

Micro‑service de sécurité chargé de :

- normaliser les événements
- corréler les événements entre eux
- calculer un score de risque
- estimer la probabilité d’attaque
- générer des alertes (règles + ML)
- fournir un résultat structuré aux autres services (WAF, SIEM, orchestrateur)

Le service est stateless, rapide, scalable et compatible micro‑services.

---

## 📐 Architecture

```bash


L
C:\DEV\SERVICES\SERVICE-SCORING\SRC
|   index.ts
|
+---adapters
|       event-adapter.ts
|       rule-adapter.ts
|
+---alerting
|       alert-engine.ts
|       alert-pipeline.ts
|       alert-types.ts
|       ml-alert-engine.ts
|
+---api
|       multi-event.controller.ts
|       multi-event.routes.ts
|       scoring.controller.ts
|
+---controller
|       scoring.ts
|
+---correlation
|   +---engine
|   |   \---pipeline
|   |       |   correlation-engine.ts
|   |       |   correlation-types.ts
|   |       |   probabilistic-correlation.ts
|   |       |   scoring-pipeline.ts
|   |       |   types.ts
|   |       |
|   |       \---__tests__
|   |               correlation-engine-windowing.test.ts
|   |               correlation-engine.test.ts
|   |               correlation-integration.test.ts
|   |               correlation-patterns.test.ts
|   |               probabilistic-correlation.test.ts
|   |               window-engine.test.ts
|   |
|   +---multi-ip
|   |   |   entity-registry.ts
|   |   |   multi-ip-engine.ts
|   |   |   multi-ip-patterns.ts
|   |   |
|   |   \---__tests__
|   |           multi-ip-engine.test.ts
|   |
|   +---multi-service
|   |   |   multi-service-engine.ts
|   |   |   multi-service-patterns.ts
|   |   |   service-registry.ts
|   |   |
|   |   \---__tests__
|   |           multi-service-engine.test.ts
|   |
|   +---patterns
|   |   |   advanced-patterns.ts
|   |   |   basic-patterns.ts
|   |   |
|   |   \---__tests__
|   |           advanced-patterns-windowing.test.ts
|   |
|   +---utils
|   |       event-utils.ts
|   |
|   \---windowing
|       |   types.ts
|       |   window-engine.ts
|       |   window-utils.ts
|       |
|       \---__tests__
|               window-utils.test.ts
|
+---engine
|       scoring-engine.ts
|
+---event-graph
|   |   event-graph.ts
|   |   graph-engine.ts
|   |
|   \---__tests__
|           graph-engine.test.ts
|
+---killchain
|   |   kill-chain-engine.ts
|   |   kill-chain-mapper.ts
|   |   kill-chain-stages.ts
|   |
|   \---__tests__
|           kill-chain-engine.test.ts
|
+---rules
|   |   dns.rule.ts
|   |   index.ts
|   |   lfi.rule.ts
|   |   path.rule.ts
|   |   rce.rule.ts
|   |   sqli.rule.ts
|   |   ssrf.rule.ts
|   |   waf.rule.ts
|   |   xss.rule.ts
|   |
|   \---custom
|           example-custom-rule.ts
|
+---storage
|       event-history.ts
|
+---ueba
|   |   ueba-deviation.ts
|   |   ueba-engine.ts
|   |   ueba-profiling.ts
|   |
|   \---__tests__
|           ueba-engine.test.ts
|
\---__tests__
    |   event-adapter.test.ts
    |   event-history.test.ts
    |   multi-event.controller.test.ts
    |   rule-registry.test.ts
    |   scoring-controller.test.ts
    |   scoring-engine-branches.test.ts
    |   scoring-engine-wrapper.test.ts
    |   scoring-engine.test.ts
    |   scoring-integration.test.ts
    |   scoring-pipeline.test.ts
    |
    +---alerting
    |       alert-engine.test.ts
    |       alert-pipeline.test.ts
    |       ml-alert-engine.test.ts
    |       scoring-with-alerts.test.ts
    |
    +---perf
    |       perf-correlation.test.ts
    |       perf-pipeline.test.ts
    |
    \---rules
            dns.rule.test.ts
            lfi.rule.test.ts
            path.rule.test.ts
            rce.rule.test.ts
            sqli.rule.test.ts
            ssrf.rule.test.ts
            waf.rule.test.ts
            xss.rule.test.ts
            _helpers.ts

```

## 📦 NormalizedEvent

Structure standard des événements :

```ts
interface NormalizedEvent {
  id: string;
  type: string;
  timestamp: number;
  ip: string;
  source: string;
  context: Record<string, any>;
  metadata: {
    findings?: Array<{
      vulnerability: string;
      description?: string;
      score?: number;
    }>;
  };
}
```

## 🔗 Correlation Pipeline

Le pipeline :

regroupe les événements par source

détecte les vulnérabilités

calcule un score de corrélation

estime la probabilité d’attaque

génère des CorrelationChain

exemple

```json
{
  "id": "chain-123",
  "type": "sqli",
  "confidence": 0.8,
  "events": [],
  "eventCount": 4,
  "sourceCount": 2,
  "correlationScore": 5.2,
  "attackLikelihood": 0.73
}
```

## 🧮 Scoring Pipeline

Combine :

score de corrélation

sévérité

probabilité d’attaque

densité d’événements

diversité des sources

Produit un ScoringResultExtended :

```json
{
  "score": 0,
  "severity": "low",
  "findings": [],
  "chains": [],
  "timestamp": 1783623280120,
  "metadata": {}
}
```

## 🚨Alert Pipeline

1. AlertEngine (règles)
   Détection :

patterns

vulnérabilités

comportements suspects

2. MLAlertEngine (machine learning)
   Détection :

anomalies statistiques

baseline comportementale

```json
{
  "id": "ml-anomaly-score",
  "severity": "low",
  "message": "ML baseline anomaly (test fallback)"
}
```

## 🌐 API

POST /scoring/score

Body

```json
{
  "events": [...]
}
```

Response

```json
{
  "score": 0,
  "severity": "low",
  "findings": [],
  "chains": [...],
  "alerts": [...]
}
```

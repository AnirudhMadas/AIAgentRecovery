🧠 AI Call Agent – Error Recovery & Resilience System
📌 Overview

This project implements a robust error recovery and resilience system for an AI Call Agent that depends on external services such as ElevenLabs, LLM providers, and CRMs.

The goal is to ensure that the system:

Detects failures accurately

Recovers intelligently

Prevents cascading outages

Alerts humans when required

Continues operating gracefully

This project was built as part of an Incubation Engineering Assignment, with a focus on engineering maturity and production-ready design, not just correctness.

🏗️ Architecture Overview
Call Processor
   |
   v
Service Handler (ElevenLabs)
   |
   v
Resilience Layer
├── Error Categorization
├── Retry Engine
├── Circuit Breaker
├── Health Checks
├── Logging & Observability
└── Alerting System
Key Design Principles

Clear separation of concerns

No external retry / circuit breaker libraries

Configuration-driven behavior

Non-blocking, async operations

Easy to extend and test

❗ Error Categorization

Custom error hierarchy is used to differentiate failures:

Transient Errors

503 Service Unavailable

Network timeouts

Temporary outages
→ Eligible for retry

Permanent Errors

Authentication failures

Invalid payloads

Quota exceeded
→ No retries

Custom Errors

BaseError

TransientError

PermanentError

🔁 Retry Logic (Exponential Backoff)

Retry logic is:

Applied only to transient errors

Fully configurable

Implemented without external libraries

Retry Configuration
initialDelayMs: 5000
maxRetries: 3
backoffMultiplier: 2

Retries follow exponential backoff:

5s → 10s → 20s
🔌 Circuit Breaker Pattern

Each external service has its own circuit breaker.

Circuit States

CLOSED – normal operation

OPEN – service unhealthy, fail fast

HALF_OPEN – test recovery with limited traffic

Behavior

Opens after repeated failures

Prevents unnecessary retries when service is down

Automatically recovers when service becomes healthy

📊 Logging & Observability

Structured logging is implemented with multiple sinks.

Log Destinations

📄 Local file (JSON logs)

📊 Google Sheets (mocked for visibility)

Logged Fields

Timestamp

Service name

Message

Error type (Transient / Permanent)

Retry count (when applicable)

Circuit breaker state

Logs are non-blocking and structured for easy debugging.

🚨 Alerting System

Alerts notify humans when critical failures occur.

Alert Channels

📧 Email

📲 Telegram

🌐 Webhook

(All mocked for demonstration)

Alerts Triggered When

Circuit breaker transitions to OPEN

Permanent failures occur

Dependency remains unavailable

Alerts are fired only on state transitions to avoid alert fatigue.

🩺 Health Checks & Automatic Recovery

Health checks run periodically in the background, even when the circuit is OPEN.

Recovery Flow

Circuit opens due to sustained failure

Health checks continue running

On successful health check:

Circuit moves to HALF_OPEN

A test request is allowed:

Success → circuit CLOSED

Failure → circuit OPEN

This enables automatic recovery without manual intervention.

🎯 Required Scenario Handling (Verified)

Scenario: ElevenLabs returns 503 Service Unavailable

✔ Detected as a transient error
✔ Retried with exponential backoff
✔ Retries limited to 3 attempts
✔ Circuit breaker opens after failures
✔ Alerts triggered for OPEN state
✔ Calls fail fast while OPEN
✔ Health checks recover the service
✔ Call processing resumes automatically

📂 Project Structure
src/
├── alerts/          # Email, Telegram, Webhook alerts
├── config/          # Retry configuration
├── errors/          # Custom error hierarchy
├── logging/         # File + Google Sheets logging
├── resilience/      # Retry, circuit breaker, health checks
├── services/        # ElevenLabs client & handler
├── queue/           # (Optional) Call queue logic
└── index.ts         # Application entry point
▶️ Running the Project
Install dependencies
npm install
Run the simulation
npx ts-node src/index.ts

The console output will demonstrate:

Retries

Circuit breaker opening

Alerts firing

Health check recovery

Automatic resumption of calls

🧪 Testing Strategy

External services are mocked to simulate:

Random failures

Service recovery

Intermittent availability

This allows deterministic testing of resilience behavior.

🧠 Key Engineering Learnings

Retries alone are dangerous without circuit breakers

Fail-fast systems recover faster

Alerting should be meaningful, not noisy

Health checks are essential for self-healing systems

Clean abstractions improve reliability and maintainability

🚀 Future Improvements

Real Google Sheets integration

Request correlation IDs

Graceful call queue degradation

Metrics dashboard (Prometheus / Grafana)

Unit tests for resilience components

👤 Author

Anirudh Madas
Backend / Full-Stack Developer
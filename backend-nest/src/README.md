# App Module Endpoints

Base URL examples in this document assume `http://localhost:3000`.

| Endpoint | Method | Input Format | Notes |
| --- | --- | --- | --- |
| `/` | `GET` | None | Basic service check. Returns `Hello World!`. |
| `/health/db` | `GET` | None | Verifies Supabase connectivity through `SupabaseService.testConnection()`. Returns `{ "status": "ok", "database": "connected" }` on success. |


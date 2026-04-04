# Auth Module Endpoints

Base URL examples in this document assume `http://localhost:3000`.

| Endpoint | Method | Input Format | Notes |
| --- | --- | --- | --- |
| `/auth/signup` | `POST` | `{ "fullName": "Phuong Nam Vu", "email": "phuong@example.com", "password": "secret123" }` | Creates a user, initializes statistics records, and sets the `jwt` cookie. `email` must be valid. `password` must be at least 6 characters. |
| `/auth/login` | `POST` | `{ "email": "phuong@example.com", "password": "secret123" }` | Validates credentials and sets the `jwt` cookie. `email` must be valid. `password` must be at least 6 characters. |
| `/auth/logout` | `POST` | None | Requires the `jwt` cookie. Clears the auth cookie and returns a success message. |
| `/auth/check` | `GET` | None | Requires the `jwt` cookie. Returns the authenticated user payload resolved from the database. |
| `/auth/refresh` | `POST` | None | Reads the `jwt` cookie and returns `{ "accessToken": "<token>" }`. Current implementation returns the same token rather than issuing a new one. |

## Notes

| Topic | Detail |
| --- | --- |
| Cookie auth | Browser requests must send credentials, for example `fetch(..., { credentials: 'include' })`. |
| Local development | Run with `NODE_ENV=development` or the `secure` auth cookie will not be stored over plain `http://localhost`. |
| Validation | Global validation is enabled with `whitelist`, `transform`, and `forbidNonWhitelisted`. Extra payload fields should be rejected. |


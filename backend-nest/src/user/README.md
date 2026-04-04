# User Module Endpoints

Base URL examples in this document assume `http://localhost:3000`.

| Endpoint | Method | Input Format | Notes |
| --- | --- | --- | --- |
| `/user/update-profile` | `POST` | `{ "profilePic": "https://example.com/avatar.png" }` | Requires the `jwt` cookie. Updates the current user's `profile_pic` field and returns `{ user, message }`. `profilePic` must be a non-empty string. |
| `/user/user-profile` | `GET` | None | Requires the `jwt` cookie. Returns the current user's safe profile data. |
| `/user/user-statistics` | `GET` | None | Requires the `jwt` cookie. Returns `{ stats: { samData, phomData }, message }` for the current user. |

## Notes

| Topic | Detail |
| --- | --- |
| Authentication | All user module endpoints require the `jwt` cookie and are protected by `JwtAuthGuard`. |
| Response shape | User responses return mapped safe user data, not the stored password. |
| Profile updates | Only `profilePic` is currently supported through the public endpoint. |

# User Management: Design & Recommendations

This document outlines the recommended structure and features for user management in the UrbanCruise app, including both MVP essentials and V2 (future) enhancements.

---

## Account Settings

### Recommended Sections

#### 1. Account Management

- **Email** (read-only)✅
- **Username** (edit, unique) ✅
- **Account creation date** (optional) ✅
- **Delete account** (with confirmation) ✅
- **Deactivate account** (V2/future)

#### 2. Security

- **Change password** (if supported)
- **Two-factor authentication (2FA)** (V2/future)
- **View recent login activity** (V2/future)
- **Logout from all devices** (optional)

#### 3. Personalization

- **Change language or locale** (optional)
- **Notification preferences** (V2/future)
- **Theme (light/dark mode) preference** (optional)

#### 4. Privacy

- **Manage who can see your profile or activity** (V2/future)
- **Control discoverability/searchability** (V2/future)
- **Data sharing preferences** (V2/future)

#### 5. Connected Accounts

- **Link/unlink Google, GitHub, or other OAuth providers** (if supported)
- **View connected apps/devices** (V2/future)

---

## Profile Edit

### MVP Features

- **Edit display name** (not unique)✅
- **Edit profile picture/avatar**(v2)
- **Edit bio/about me**✅

### V2/Future Enhancements

- **Social links** (Twitter, LinkedIn, etc.)
- **Custom profile banner**
- **More granular privacy controls** (e.g., hide email, show/hide fields)
- **Profile theme or color customization**

---

## MVP vs. V2 Table

| Section            | MVP Features                                       | V2 Features (Future)                      |
| ------------------ | -------------------------------------------------- | ----------------------------------------- |
| Account Management | Email (read-only), Username (edit)                 | Account creation date                     |
| Security           | Change password (if supported), logout all devices | 2FA, login activity                       |
| Personalization    | Theme, language (optional)                         | Notification preferences                  |
| Privacy            | -                                                  | Profile visibility, discoverability       |
| Connected Accounts | -                                                  | Link/unlink OAuth, connected apps/devices |
| Profile Edit       | Display name, avatar, bio                          | Social links, banner, privacy controls    |

---

## Notes

- **Display names are not unique**; usernames are unique.
- **Account settings** should require authentication for sensitive actions (e.g., change username, delete account).
- **Profile edit** is for public-facing info and can be less restricted.
- **V2 features** can be prioritized based on user feedback and growth needs.

---

For implementation details, see the main README or reach out to the team.

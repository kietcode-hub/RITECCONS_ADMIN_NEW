# Login Page Overrides (đăng nhập nội bộ, role-based demo)

> Rules here override `design-system/rmc-ms/MASTER.md`.

## Layout

- Single centered card (max-width 380px) on `--color-background`, no marketing hero/nav/footer — this screen has no public/anonymous audience
- Card: logo mark (32px, primary bg, initials "RM") + product name + one-line Vietnamese description
- Fields: Email/SĐT, Mật khẩu (with show/hide toggle per `password-toggle`), demo-only "Vai trò" select (maps to the 8 seeded users in `AuthService`)
- "Ghi nhớ đăng nhập" checkbox + primary submit button (full width, 44px+ height)
- Hint line below the form explaining that the left nav will unlock only the modules the chosen role has access to (visualizes BRULE-17)

## Components (Next.js / shadcn)

| Component | Base | Notes |
|---|---|---|
| `<LoginCard>` | shadcn `Card` | `role="form"`, labelled fields (`form-labels`), `autocomplete="username"` / `"current-password"` (`autofill-support`) |
| `<PasswordField>` | shadcn `Input` + toggle button | toggle has `aria-label="Hiện/Ẩn mật khẩu"` |
| Role select | shadcn `Select` | dev/demo only — remove before real auth is wired to a user directory |

## States

- Submit → loading state on button (`loading-buttons`), disable inputs during request
- Invalid credentials → error banner above the form + `aria-live="polite"`, never silently fail
- Do not block password managers or paste in the password field (`accessible-authentication`)

## Anti-patterns to avoid here

- No hero image/carousel, no "trusted by" logos, no pricing — those are marketing-landing patterns and this is an internal auth screen

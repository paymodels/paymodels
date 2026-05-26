<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Paymodels Project Memory

This file is the persistent handoff document for future agents working in this repository. Keep it current when business terms, route behavior, UI contracts, or component conventions change.

## Product Terms

- `paymodels`: a Chinese checkout/landing site for ChatGPT Plus / Pro recharge services.
- `Plus 月卡`: entry plan, slug `plus`, shown as `ChatGPT Plus 月卡` on the order page.
- `Pro 5X`: high-frequency plan, slug `pro5x`, shown as `ChatGPT Pro 5X`.
- `Pro 20X`: top-tier plan, slug `pro20x`, shown as `ChatGPT Pro 20X`.
- `Access Token`: the JSON returned by `https://chatgpt.com/api/auth/session`. Users paste this into `/order` for recharge processing.
- `官方渠道充值`, `充值失败全额退款`, `Token 仅用于本次充值`: trust and safety claims that should stay visible in order/checkout flows unless the product owner changes the offer.

## Route Contracts

- `/`: marketing landing page.
    - Hero primary CTA text is `立即充值`.
    - Hero `立即充值` must scroll to the pricing section, not navigate to `/order`.
    - The pricing section anchor is `#pricing`, with heading `选择适合你的方案`.
- `/order?plan=<slug>`: checkout/order information page.
    - Plan slugs are `plus`, `pro5x`, and `pro20x`.
    - Unknown or missing `plan` falls back to `plus`.
    - The order page is a four-step shadcn-style stepper checkout flow:
        1. `订单总览`: confirm selected plan, amount, delivery notes, and trust claims.
        2. `复制 Token`: open the ChatGPT session endpoint, copy the URL, and paste the full JSON.
        3. `支付方式`: hidden until the Token textarea contains non-whitespace content. Use shadcn `Tabs` for the QR panels, but keep the visible tabs list hidden while evaluating the current layout. No method is selected by default, and a QR code panel appears only after the user clicks a payment method.
        4. `升级完成`: confirm the order entered upgrade processing and show follow-up guidance.
    - The checkout progress stepper is read-only progress display, not a tab navigation surface.
    - `/order` uses a narrower subscription-style layout: left form column plus a right sticky `order-summary-panel`; keep the main wrapper around `max-w-6xl` unless the product owner asks for a wider checkout.
    - In the Token section, `打开 Token 地址` and `复制 Token 链接` should sit to the right of the `会话接口地址` alert on medium and larger screens.
    - `订单总览` is passive and must not contain a `提交订单` button; confirmation happens with `确认订单信息`, payment happens in step 3.
    - Payment method choices should include recognizable icons, including a green chat-bubble treatment for `微信支付`.
    - The order page must show `填写订单信息`, `订单总览`, `复制和粘贴 Token`, `选择支付方式`, `微信支付二维码`, `Stripe 支付二维码`, `升级完成`, and `充值流程`.
    - The selected plan name and price come from `planInfo` in `app/order/page.tsx`.
- `/pricing`: route exists, but the landing page currently owns the primary pricing experience through `app/components/PricingSection.tsx`.

## Important Files

- `app/page.tsx`: landing page hero and section composition.
- `app/components/PricingSection.tsx`: plan cards and the only place where pricing-card `立即充值` links should navigate to `/order?plan=...`.
- `app/components/ScrollLink.tsx`: client-side smooth-scroll helper used by hero CTA.
- `app/order/page.tsx`: client component checkout page using `useSearchParams`, copy-to-clipboard behavior, and shadcn UI composition.
- `components/ui/*`: local shadcn-style source components. Treat these as project-owned components, not generated black boxes.
- `test/landing-order.test.mjs`: lightweight source-level regression tests for CTA behavior and `/order` layout structure.

## UI And Design Rules

- This is a product UI, not a purely decorative landing-page exercise. Prefer clear hierarchy, predictable grids, and trustworthy checkout structure.
- `/order` should follow shadcn composition:
    - Use `Card` with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, and `CardAction`.
    - Use `Badge` instead of custom pill spans.
    - Use `Alert` for callouts and handoff/safety notices.
    - Use `Separator` instead of raw border divider markup.
    - Use `FieldGroup`, `Field`, `FieldLabel`, `FieldDescription`, and `Textarea` for the token input area.
    - Use semantic colors such as `bg-background`, `bg-muted`, `text-muted-foreground`, `bg-primary`, and `text-primary`.
    - Use `gap-*` for spacing. Avoid `space-x-*` and `space-y-*`.
    - For equal dimensions, prefer `size-*` over paired `h-* w-*`.
    - Icons inside `Button` should use `data-icon="inline-start"` or `data-icon="inline-end"` and should not carry manual sizing classes.
- Keep cards purposeful. Do not nest cards inside cards unless there is a real component boundary.
- Avoid raw OKLCH values in page JSX unless a deliberate one-off surface is required. Prefer theme tokens.
- `/order` should use the current shadcn theme tokens for color and typography. Do not add page-local color systems such as `paymentTone`, typography maps such as `typeStyles`, or scattered raw OKLCH classes in page JSX. Prefer direct semantic utility classes like `bg-background`, `bg-card`, `bg-muted/30`, `text-foreground`, `text-muted-foreground`, `text-primary`, `border-border`, and `border-input`.

## Next.js And Runtime Notes

- Next.js is `16.2.6`; React is `19.2.4`.
- Read relevant files under `node_modules/next/dist/docs/` before changing Next APIs, route conventions, metadata, navigation, or Server/Client Component boundaries.
- App Router pages are Server Components by default. Add `'use client'` only where state, event handlers, browser APIs, or hooks like `useSearchParams` are needed.
- `app/order/page.tsx` is intentionally a Client Component because it uses `useSearchParams`, `useState`, and `navigator.clipboard`.

## Verification

Run these before claiming checkout or landing CTA changes are complete:

```bash
node --test test/landing-order.test.mjs
pnpm lint
```

Known current lint state: `pnpm lint` exits successfully but reports a warning in `app/components/Testimonials.tsx` for an unused `Icon` import. Do not describe lint as warning-free until that is fixed.
Do not run `pnpm build` by default for routine UI/order-page iterations; it can spend a long time in `next/font/google` network work. Only run it when the user explicitly asks for a production build check.

## Tooling Notes

- Package manager is `pnpm`.
- Tailwind is v4 via `@tailwindcss/postcss`; global theme tokens live in `app/globals.css`.
- shadcn CLI may fail in this environment with a `zod/v3` package export error. If that happens, use the local shadcn rules and existing `components/ui` patterns, then verify with tests/build.
- Use `apply_patch` for manual edits.

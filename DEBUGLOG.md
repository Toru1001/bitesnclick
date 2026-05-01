# Security Audit Debug Log - BitesN'Click

## 1. Critical: Admin Authentication Bypass & UI Exposure

- **Location:** `middleware.ts` (new), `app/sessionWrapper.tsx`, `app/login/admin/page.tsx`
- **Details:** The admin dashboard route guard was strictly client-side.
- **Fix Applied:** Created `middleware.ts` to protect `/admin` routes using an HTTP-only `admin_session` cookie.

## 2. Critical: Client-Side Password Verification & Hash Exposure

- **Location:** `app/login/admin/actions.ts` (new), `app/login/admin/page.tsx`
- **Details:** The admin hash was fetched to the client and compared locally.
- **Fix Applied:** Created a secure Server Action (`loginAdmin`) that verifies the hash server-side and sets an HTTP-only secure cookie.

## 3. Critical: Missing Server-Side Authorization & Unsafe RLS

- **Location:** `app/admin/dashboard/admin-db.tsx`, and all admin pages.
- **Details:** Admin components query sensitive tables directly from the client using the public anonymous key.
- **Partial Fix Applied:** Admin routes are now securely protected by Next.js Middleware.
- **ACTION REQUIRED BY DEVELOPER:** Because admin data fetching is done client-side with the anonymous key, you **must** either migrate admins to use Supabase Auth so RLS policies can use `auth.uid()`, OR rewrite all admin data fetching to use protected Next.js Server Actions. Currently, your RLS policies on Supabase are likely public/open.

## 4. High: Dangerous Usage of Service Role Key

- **Location:** `app/lib/delete-account/route.ts`
- **Details:** The Service Role key was being used to initialize the client for standard CRUD operations.
- **Fix Applied:** Changed the initialization to use the `NEXT_PUBLIC_SUPABASE_ANON_KEY` for standard operations (which respects RLS), and kept Service Role strictly for `admin.deleteUser`.

## 5 & 6. Medium/Low: AI Endpoint Rate Limiting & IO Overhead

- **Location:** `app/api/chat-ai/route.ts`
- **Details:** The AI endpoint lacked rate limiting and read the static PDF from disk synchronously on every request.
- **Fix Applied:** Implemented a basic in-memory rate limiter (max 5 requests per minute per IP) and cached the extracted PDF text in memory across invocations.

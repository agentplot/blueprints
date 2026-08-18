# willdan-flywheel — GitHub App setup for IT

We need an org-owned GitHub App so our automation can manage issues and
project boards under its own identity, without personal access tokens.
Ten minutes, no code, no servers — the app has no webhook and hosts
nothing.

## Create the app

1. Go to **WilldanGroup org → Settings → Developer settings →
   GitHub Apps → New GitHub App**.
2. **GitHub App name:** `willdan-flywheel`
3. **Homepage URL:** `https://github.com/WilldanGroup/willdan-blueprints`
4. **Webhook:** uncheck **Active** (the app receives no events).
5. **Permissions:**
   - Repository permissions → **Issues: Read and write**
     (Metadata: Read-only is added automatically)
   - Organization permissions → **Projects: Read and write**
   - Everything else: No access
6. **Where can this App be installed:** Only on this account.
7. **Create GitHub App.**

## Install it

8. On the app's page: **Install App → WilldanGroup**.
9. Choose **Only select repositories** → `willdan-blueprints`.
   (We may later ask to add repositories; that is a one-click change on
   this same page.)

## Hand off to Chuck Swanberg

10. From the app's **General** page: the **App ID** (a small number near
    the top).
11. Under **Private keys → Generate a private key** — this downloads a
    `.pem` file.
12. Send Chuck the App ID and the `.pem` file through 1Password (or
    whatever secure channel you prefer) — never by email or chat.

That's everything. The app can only read and write issues and project
boards on the repositories it is installed on; it has no access to code,
settings, or members, and revoking it is one click on the same page.

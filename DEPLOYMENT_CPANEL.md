# Noble Clarity Engine - cPanel Deployment Guide

This guide provides step-by-step instructions to deploy the updated **Noble Clarity Engine** (Frontend + Backend) to your cPanel environment.

---

## 🏗️ Phase 1: local Preparation (Important)

Your recent changes include new API endpoints and live data integrations. To make them work in production, you **MUST** rebuild the frontend with the production URL.

1.  Open your local project folder.
2.  If you have an `.env` file in the root, update `VITE_PROXY_URL`:
    ```env
    VITE_PROXY_URL=https://clarity.noblesworld.com.ng
    ```
3.  Run the build command:
    ```bash
    npm run build
    ```
4.  This creates a `dist` folder. This is your **Frontend**.

---

## 🚀 Phase 2: Backend Deployment (cPanel)

1.  **Upload Files**:
    - Go to cPanel **File Manager**.
    - Open your server directory (e.g., `/clarity-server/`).
    - Upload the contents of your local `server/` folder to this directory.
    - **Crucial**: Ensure `server.js`, `package.json`, and `.env` are present.

2.  **Configure Environment**:
    - Edit the `.env` file in your cPanel server folder.
    - Ensure `EMAIL_USER` and `EMAIL_PASS` (App Password) are correct for the Blast Engine to work.

3.  **Setup Node.js App**:
    - Go to cPanel **"Setup Node.js App"**.
    - If the app is already running, click **"STOP"**.
    - Check the **Application startup file**: should be `server.js` (or the path relative to your app root).
    - Click **"Run JS Install"** to ensure the new `nodemailer` dependency is installed.
    - Click **"START"** or **"Restart"**.

---

## 🌐 Phase 3: Frontend Deployment (cPanel)

1.  **Upload Build**:
    - Navigate to the `public_html` folder (or your subdomain's document root).
    - Delete the old files.
    - Upload the contents of your **local** `dist/` folder here.

2.  **Verify `.htaccess`**:
    - Ensure you have a `.htaccess` file in your `public_html` to handle React routing:
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteCond %{REQUEST_FILENAME} !-l
      RewriteRule . /index.html [L]
    </IfModule>
    ```

---

## ✅ Phase 4: Verification

1.  Open **[clarity.noblesworld.com.ng](https://clarity.noblesworld.com.ng)**.
2.  **AI Coach**: Ask a question. If it replies, the proxy is working.
3.  **Blast Engine**:
    - Login to Admin.
    - Open "Blast Email Campaign".
    - Send a test to the "Free Tier".
    - If it says "Transmission Complete", your setup is 100% correct!

---

### 💡 Pro Tip
If you get a JSON error again, double check that your Node.js app in cPanel is actually running on the URL `https://clarity.noblesworld.com.ng`. If it's on a subdomain or different path, update `VITE_PROXY_URL` and rebuild.

# 🔒 HTTPS Setup Guide for Voice Agent

## Why HTTPS is Required

Browsers **block microphone access** on non-HTTPS sites (except localhost) for security reasons. This is a WebRTC security requirement.

## ✅ Quick Setup (Recommended)

### Step 1: Generate SSL Certificates

```bash
cd frontend
npm run generate-certs
```

This creates:
- `localhost-key.pem` (private key)
- `localhost.pem` (certificate)

### Step 2: Run with HTTPS

```bash
npm run dev:https
```

### Step 3: Open Browser

Go to: **https://localhost:3000**

⚠️ You'll see a security warning (this is normal for self-signed certificates)

**Chrome:** Click "Advanced" → "Proceed to localhost (unsafe)"
**Firefox:** Click "Advanced" → "Accept the Risk and Continue"
**Edge:** Click "Advanced" → "Continue to localhost (unsafe)"

### Step 4: Test Microphone

Click "Connect" and grant microphone permissions when prompted.

## 🌐 Alternative: ngrok (For Phone/Remote Access)

If you need to access from your phone or another device:

### Step 1: Install ngrok

```bash
# Windows (with Chocolatey)
choco install ngrok

# Mac
brew install ngrok

# Or download from: https://ngrok.com/download
```

### Step 2: Start Your App (HTTP is fine with ngrok)

```bash
npm run dev:http
```

### Step 3: Create ngrok Tunnel

```bash
ngrok http 3000
```

You'll get a URL like: `https://abc123.ngrok.io`

### Step 4: Update Environment Variables

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_LIVEKIT_HOST=localhost
NEXT_PUBLIC_LIVEKIT_PORT=7880
```

### Step 5: Access via ngrok URL

Open the ngrok HTTPS URL in your browser or phone.

## 🔧 Troubleshooting

### "OpenSSL not found"

**Windows:**
```bash
choco install openssl
# Or download from: https://slproweb.com/products/Win32OpenSSL.html
```

**Mac:**
```bash
brew install openssl
```

**Linux:**
```bash
sudo apt-get install openssl
```

### "Certificate not trusted"

This is expected for self-signed certificates. Just click "Advanced" and proceed.

### "Microphone still blocked"

1. Check you're using `https://` (not `http://`)
2. Check you're using `localhost` (not an IP address like `192.168.x.x`)
3. Clear browser cache and reload
4. Check browser permissions: Settings → Privacy → Microphone

### "LiveKit connection failed"

Make sure:
1. LiveKit server is running: `livekit-server --dev`
2. Backend agent is running: `cd backend && uv run python src/agent.py dev`
3. Environment variables are correct in `.env.local`

## 📋 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev:http` | HTTP on localhost (microphone works on localhost only) |
| `npm run dev:https` | HTTPS on localhost (microphone works everywhere) |
| `npm run generate-certs` | Generate self-signed SSL certificates |
| `npm run dev` | Alias for `dev:http` |

## 🎯 Production Deployment

For production, use a proper SSL certificate from:
- Let's Encrypt (free)
- Your hosting provider (Vercel, Netlify, etc.)
- CloudFlare

Never use self-signed certificates in production.

## ✅ Success Checklist

- [ ] SSL certificates generated
- [ ] App running on `https://localhost:3000`
- [ ] Browser shows padlock icon (even if "Not Secure")
- [ ] Microphone permission popup appears
- [ ] Agent connects successfully
- [ ] No security errors in console

## 🔗 Resources

- [MDN: Secure Contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
- [WebRTC Security](https://webrtc-security.github.io/)
- [LiveKit Docs](https://docs.livekit.io/)

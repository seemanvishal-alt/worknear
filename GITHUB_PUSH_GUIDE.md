# 🚀 GitHub-க்கு Push செய்வது எப்படி

## ❌ Error வந்தது

```
remote: Permission to seemanvishal-alt/worknear2.git denied to cybeesubash.
fatal: unable to access 'https://github.com/seemanvishal-alt/worknear2.git/': The requested URL returned error: 403
```

**காரணம்:** Git உங்கள் பழைய credentials (cybeesubash) பயன்படுத்துகிறது, ஆனால் உங்கள் repository வேறொரு account-இல் (seemanvishal-alt) இருக்கிறது.

---

## ✅ தீர்வு - 2 வழிகள்

### Option 1: GitHub Personal Access Token (Recommended)

#### Step 1: Personal Access Token Create செய்யுங்கள்

1. **GitHub-க்கு போங்கள்:** https://github.com
2. **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **"Generate new token"** click செய்யுங்கள்
4. **Token name:** `WorkNear Push Token`
5. **Expiration:** 90 days (அல்லது உங்கள் விருப்பம்)
6. **Scopes செய்யுங்கள்:**
   - ✅ `repo` (full control of private repositories)
7. **Generate token** click செய்யுங்கள்
8. **Token-ஐ copy செய்யுங்கள்** (இது ஒரே முறை தான் காட்டும்!)

#### Step 2: Git Credentials Update செய்யுங்கள்

**Windows Credential Manager-ல் update:**

1. **Windows Start** → Type: `Credential Manager`
2. **Windows Credentials** click செய்யுங்கள்
3. **Generic Credentials** section-ல் `git:https://github.com` தேடுங்கள்
4. **Edit** click செய்யுங்கள்
5. **Username:** `seemanvishal-alt`
6. **Password:** (உங்கள் Personal Access Token paste செய்யுங்கள்)
7. **Save** click செய்யுங்கள்

#### Step 3: மீண்டும் Push செய்யுங்கள்

```bash
git push -u origin main
```

---

### Option 2: Remote URL-ஐ Token-உடன் Update செய்யுங்கள்

இந்த command-ஐ run செய்யுங்கள் (TOKEN-ஐ உங்கள் token-உடன் replace செய்யுங்கள்):

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/seemanvishal-alt/worknear2.git
```

**Example:**
```bash
git remote set-url origin https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/seemanvishal-alt/worknear2.git
```

பிறகு push செய்யுங்கள்:
```bash
git push -u origin main
```

---

### Option 3: SSH Key பயன்படுத்துங்கள் (மிகவும் பாதுகாப்பானது)

#### Step 1: SSH Key Generate செய்யுங்கள்

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Enter அழுத்தி default location accept செய்யுங்கள்.

#### Step 2: SSH Key-ஐ GitHub-க்கு Add செய்யுங்கள்

1. **SSH key copy செய்யுங்கள்:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. **GitHub Settings** → **SSH and GPG keys** → **New SSH key**
3. **Title:** `WorkNear Laptop`
4. **Key:** (copy செய்த key paste செய்யுங்கள்)
5. **Add SSH key** click செய்யுங்கள்

#### Step 3: Remote URL-ஐ SSH-க்கு மாற்றுங்கள்

```bash
git remote set-url origin git@github.com:seemanvishal-alt/worknear2.git
```

பிறகு push செய்யுங்கள்:
```bash
git push -u origin main
```

---

## 🔧 Current Status Check

### Remote URL பார்க்க:
```bash
git remote -v
```

### Remote URL Remove செய்ய:
```bash
git remote remove origin
```

### Remote URL மீண்டும் Add செய்ய:
```bash
git remote add origin https://github.com/seemanvishal-alt/worknear2.git
```

---

## 📋 Quick Commands (நான் செய்ய வேண்டியது)

நீங்கள் எனக்கு Personal Access Token கொடுத்தால், நான் இதை run செய்கிறேன்:

```bash
# Option 1: Token-உடன் push
git remote set-url origin https://YOUR_TOKEN@github.com/seemanvishal-alt/worknear2.git
git push -u origin main

# Option 2: Username/Password prompt-உடன்
git push -u origin main
# (உங்கள் credentials enter செய்ய prompt வரும்)
```

---

## ✅ எந்த Option தேர்வு செய்யலாம்?

| Option | எளிது | பாதுகாப்பு | Duration |
|--------|-------|-----------|----------|
| **Personal Access Token** | ⭐⭐⭐ | ⭐⭐⭐ | Temporary (expires) |
| **SSH Key** | ⭐⭐ | ⭐⭐⭐⭐⭐ | Permanent |
| **Password** | ⭐⭐⭐⭐ | ⭐⭐ | Deprecated (GitHub doesn't allow) |

**Recommended:** Personal Access Token (Option 1) - மிகவும் எளிது!

---

## 🎯 Next Steps

1. **Personal Access Token create செய்யுங்கள்:** https://github.com/settings/tokens
2. **Token copy செய்யுங்கள்**
3. **எனக்கு சொல்லுங்கள்** அல்லது இந்த command run செய்யுங்கள்:
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/seemanvishal-alt/worknear2.git
   git push -u origin main
   ```

---

**Current Repository:** https://github.com/seemanvishal-alt/worknear2  
**Status:** ⏳ Waiting for credentials  
**Ready to Push:** ✅ Yes, after authentication

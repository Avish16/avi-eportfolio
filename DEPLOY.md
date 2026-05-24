# Deploying to Vercel — Step by Step

This guide takes your portfolio from a local folder to a live URL with a
working AI chatbot.

---

## What you need first

1. A **GitHub account** (you have one: github.com/Avish16)
2. A **Vercel account** — sign up free at https://vercel.com (use "Continue with GitHub")
3. An **Anthropic API key** — get one at https://console.anthropic.com
   - Sign in, go to "API Keys", create a key
   - Copy it somewhere safe — it looks like `sk-ant-api03-xxxxx...`
   - You'll paste it into Vercel later. NEVER put it in your code.

---

## Step 1 — Push your project to GitHub

Your portfolio currently lives at `C:\Users\AVI\my-projects\eportfolio`.
It needs to be a GitHub repository.

Option A — GitHub Desktop (easiest if you're not comfortable with git CLI):
1. Download GitHub Desktop: https://desktop.github.com
2. File → Add Local Repository → pick the `eportfolio` folder
3. It'll say "this isn't a git repo, create one?" → yes
4. Write a commit summary like "Initial portfolio", click "Commit"
5. Click "Publish repository" → name it `eportfolio` (or anything) → Publish

Option B — git command line (from inside the eportfolio folder):
```
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/Avish16/eportfolio.git
git push -u origin main
```
(Create the empty `eportfolio` repo on github.com first.)

IMPORTANT: The `.gitignore` file makes sure `.env` files never get pushed.
Your API key is never in the code, so nothing secret goes to GitHub.

---

## Step 2 — Import the project into Vercel

1. Go to https://vercel.com/new
2. You'll see your GitHub repos. Find `eportfolio`, click "Import"
3. Vercel auto-detects it's a static site + serverless functions.
   Leave all build settings as default (no build command needed).
4. DON'T click Deploy yet — first add your API key (next step).

---

## Step 3 — Add your API key as an environment variable

This is the secure part. The key lives in Vercel, never in your code.

1. On the import screen, expand "Environment Variables"
2. Add one variable:
   - **Name:**  `ANTHROPIC_API_KEY`
   - **Value:** your `sk-ant-api03-...` key
3. Make sure it's enabled for Production, Preview, and Development
4. Now click **Deploy**

(If you already deployed without it: go to your project →
Settings → Environment Variables → add it there → then redeploy
from the Deployments tab.)

---

## Step 4 — Done

Vercel builds and gives you a live URL like `eportfolio-xxxx.vercel.app`.

Test it:
- Open the URL
- Click the chatbot launcher (bottom-right orange button)
- Ask "who are you" — it should now answer via real Claude, not the
  local fallback bank
- Try something off-topic like "write me a poem" — the bot should
  politely redirect to talking about Avi

---

## Updating the site later

Any time you change a file:
- GitHub Desktop: Commit → Push
- git CLI: `git add . && git commit -m "update" && git push`

Vercel auto-redeploys within ~30 seconds of every push. No manual steps.

---

## Custom domain (optional)

If you want `avisharma.com` or similar:
1. Buy a domain (Namecheap, Cloudflare, Google Domains, etc.)
2. Vercel project → Settings → Domains → add your domain
3. Follow Vercel's DNS instructions
Free `.vercel.app` URL works perfectly fine for job applications too.

---

## Security recap — what protects you

- API key is in Vercel env vars only, never in code or GitHub
- `/api/chat` only accepts POST requests
- Input is capped at 600 characters (stops token-burning abuse)
- Rate limited to 12 messages per minute per visitor
- `max_tokens` capped at 400 (bounds cost per reply)
- System prompt keeps the bot on-topic (won't be hijacked into
  doing free work for strangers)
- Security headers set in vercel.json

## Cost expectations

Using Claude Haiku (cheapest model). A portfolio chatbot handling
normal recruiter traffic costs cents per month. The rate limit and
token caps prevent any surprise bills. Monitor usage at
console.anthropic.com.

# Luqman's Cookie Co. website

A static, mobile-first page for the Luqman's Cookie Co. vending machine. It is built from plain files (`index.html`, `styles.css`, `script.js`) with no build step, so it runs on GitHub Pages as-is.

## Editing the content

All the placeholders in `index.html` are marked with HTML comments, so you can find each one by searching for its label:

| Search for | What to change |
|---|---|
| `MENU:` | Item names, prices and descriptions. Each `<li class="card">` is one menu item. |
| `LOCATION:` | The exact building and floor. |
| `FORMSPREE:` | Your Formspree form ID (see below). |
| `INSTAGRAM:` | Your Instagram profile URL. |

### Photos
The menu photos in `images/` are free stock images: 800×500 WebP files of about 45–130 KB each. To use your own photos of the real products, save each one under the same file name at 800×500 and keep it under about 120 KB. https://squoosh.app is a free tool for resizing and compressing them.

**Credits.** These photos are free under the [Unsplash License](https://unsplash.com/license), which allows commercial use without attribution, but crediting the photographers is good practice.

| File | Photographer | Source |
|---|---|---|
| chocolate-chip.webp | Fernanda Martinez | https://unsplash.com/photos/P4EtUOqkKfc |
| double-chocolate.webp | With Mahdy | https://unsplash.com/photos/hMO34T7Kwnk |
| oat-date.webp | Caroline Green | https://unsplash.com/photos/Ir1EmjxRua4 |
| fudge-brownie.webp | Anna Przepiorka | https://unsplash.com/photos/LjtviHokbr4 |
| blueberry-muffin.webp | Tayla Brand | https://unsplash.com/photos/HsxSCnDkU_s |
| mini-croissant.webp | Conor Brown | https://unsplash.com/photos/sqkXyyj4WdE |
| share.jpg (link preview) | Girl with red hat | https://unsplash.com/photos/4Mh3AjljekQ |

### Videos (not on the site yet)
The original videos are saved in `..\LuqmansCookieCo-media\videos\`. They are free under the [Pexels License](https://www.pexels.com/license/).

| File | Creator | Source |
|---|---|---|
| cookies-on-baking-tray_roman-odintsov.mp4 (18.8 MB, 20s) | Roman Odintsov | https://www.pexels.com/video/6093664/ |
| cookies-on-a-tray_gustavo-fring.mp4 (14.4 MB, 16s) | Gustavo Fring | https://www.pexels.com/video/4267057/ |
| baking-sheet-cookies_image-hunter.mp4 (7.1 MB, 11s) | Image Hunter | https://www.pexels.com/video/27818226/ |

At these sizes they are far too heavy for a page people open by scanning a QR code. To use one, first compress it to a short, silent 720p loop of about 1–2 MB.

## Feedback form options (no server needed)

| Option | Free tier | Notes |
|---|---|---|
| **Formspree** (currently set up) | 50 submissions a month | Uses the styled form already on the page, sends submissions to your email and has built-in spam filtering. |
| Web3Forms | 250 submissions a month | Works the same way. Change the form `action` to `https://api.web3forms.com/submit` and add a hidden `access_key` input. |
| Google Form | Unlimited | Responses go to a Google Sheet. You would link to it with a button or embed it in an iframe, which looks less polished on a phone. |

### Connecting Formspree
1. Sign up at https://formspree.io and create a new form.
2. Copy the form ID: the part after `/f/` in its endpoint, for example `xyzabcd`.
3. In `index.html`, replace `YOUR_FORM_ID` in `action="https://formspree.io/f/YOUR_FORM_ID"` with that ID.
4. Send one test message and confirm the email Formspree sends you.

Until you add the ID, the form shows a friendly "not connected yet" message.

## Deploying to GitHub Pages
1. Create a GitHub repository and upload these files to its root.
2. Go to **Settings → Pages → Build and deployment → Source: Deploy from a branch**, then choose `main` and `/ (root)`.
3. After a minute the site will be live at `https://<username>.github.io/<repo>/`. Point the QR code on the machine at that URL.

## Previewing locally
Open `index.html` in a browser, or run `python -m http.server` in this folder and visit http://localhost:8000.

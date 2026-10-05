/**
 * Build-time responsive image pipeline.
 *
 * For every JPEG in public/assets/images this generates smaller copies in
 * two formats (WebP + JPEG fallback) and writes a manifest that
 * <ImageWithFallback> reads to build <picture>/srcset markup. The browser —
 * not JavaScript — then picks the right file for the slot it is rendering
 * into, so a ~150px grid tile no longer downloads a 1600px phone photo.
 *
 * Why the filenames carry a content hash (story-p1-480.ab12cd34.webp):
 * the generated files are served with a one-year `immutable` cache header
 * (see vercel.json). That is only safe if the URL changes whenever the
 * picture does — so replacing story-p1.jpg later produces new URLs and
 * returning visitors fetch the new photo instead of a stale cached one.
 *
 * Runs automatically via the Vite plugin in vite.config.js (dev server
 * start and every build), and by hand with `npm run images`. Outputs
 * (public/assets/images/generated, src/generated) are git-ignored — they are
 * rebuilt on every deploy from the originals you commit.
 *
 * Failure policy: optimisation must never take the site down. If `sharp`
 * is missing or an image can't be processed, we log a loud warning, leave
 * that image out of the manifest, and the site serves the original file.
 */
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'public/assets/images')
const OUT_DIR = path.join(SRC_DIR, 'generated')
const MANIFEST_PATH = path.join(ROOT, 'src/generated/imageManifest.json')
const PUBLIC_PREFIX = '/assets/images'

// Quality is deliberately high: these are the photos people judge the NGO by.
// Slow connections get the smaller widths (and a blurred preview) instead of
// lower quality at every size.
const TARGET_WIDTHS = [480, 800, 1200, 1600]
const WEBP_QUALITY = 85
const JPEG_QUALITY = 85
// Tiny blurred stand-in inlined into the manifest (~300 bytes each) so every
// photo has something to show the instant it renders, before any network.
const LQIP_WIDTH = 32
const LQIP_QUALITY = 40
// Bump when the settings above change so every variant is re-encoded.
const PIPELINE_VERSION = '2'

// Never resized or re-encoded:
//  - upi-qr.jpg: lossy re-encoding / resizing can break QR scanning.
//  - og-cover.jpg: fetched by social crawlers at its fixed URL (index.html).
const SKIP = new Set(['upi-qr.jpg', 'og-cover.jpg'])

const isSource = (file) => /\.jpe?g$/i.test(file) && !SKIP.has(file)

/** Widths to emit for a source of `srcWidth` px: never upscale. */
const pickWidths = (srcWidth) => {
  const max = TARGET_WIDTHS[TARGET_WIDTHS.length - 1]
  const widths = new Set(TARGET_WIDTHS.filter((w) => w <= srcWidth))
  if (srcWidth < max) widths.add(srcWidth) // the source itself is the top tier
  return [...widths].sort((a, b) => a - b)
}

const writeManifest = async (manifest) => {
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
}

const loadSharp = async () => {
  try {
    return (await import('sharp')).default
  } catch (err) {
    console.warn(`[images] could not load sharp (${err.message.split('\n')[0]}).`)
    return null
  }
}

async function processImage(sharp, file, keep) {
  const buf = await readFile(path.join(SRC_DIR, file))
  const hash = createHash('sha1').update(PIPELINE_VERSION).update(buf).digest('hex').slice(0, 8)

  const meta = await sharp(buf).metadata()
  // EXIF orientations 5-8 are rotated 90deg: stored width is the display height.
  const rotated = (meta.orientation ?? 1) >= 5
  const srcWidth = rotated ? meta.height : meta.width
  const srcHeight = rotated ? meta.width : meta.height
  if (!srcWidth || !srcHeight) throw new Error('could not read image dimensions')

  const base = file.replace(/\.[^.]+$/, '')
  const variants = []

  for (const w of pickWidths(srcWidth)) {
    const stem = `${base}-${w}.${hash}`
    const outputs = [
      { name: `${stem}.webp`, encode: (img) => img.webp({ quality: WEBP_QUALITY, effort: 5 }) },
      { name: `${stem}.jpg`, encode: (img) => img.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }) },
    ]
    for (const { name, encode } of outputs) {
      keep.add(name)
      const outPath = path.join(OUT_DIR, name)
      if (existsSync(outPath)) continue // same source bytes + settings => same file
      // rotate() with no args applies EXIF orientation; output metadata is stripped.
      await encode(sharp(buf).rotate().resize({ width: w, withoutEnlargement: true })).toFile(outPath)
    }
    variants.push({
      w,
      webp: `${PUBLIC_PREFIX}/generated/${stem}.webp`,
      jpg: `${PUBLIC_PREFIX}/generated/${stem}.jpg`,
    })
  }

  const lqipBuf = await sharp(buf)
    .rotate()
    .resize({ width: LQIP_WIDTH })
    .blur(1)
    .webp({ quality: LQIP_QUALITY })
    .toBuffer()
  const lqip = `data:image/webp;base64,${lqipBuf.toString('base64')}`

  return { width: srcWidth, height: srcHeight, lqip, variants }
}

export async function generateImageVariants() {
  const sharp = await loadSharp()
  if (!sharp) {
    console.warn('[images] Skipping variant generation — run `npm install`. Serving original images.')
    await writeManifest({})
    return {}
  }

  const files = (await readdir(SRC_DIR)).filter(isSource).sort()
  await mkdir(OUT_DIR, { recursive: true })

  const manifest = {}
  const keep = new Set()
  for (const file of files) {
    try {
      manifest[`${PUBLIC_PREFIX}/${file}`] = await processImage(sharp, file, keep)
    } catch (err) {
      console.warn(`[images] ${file}: ${err.message} — serving the original.`)
    }
  }

  // Drop variants of photos that were replaced or deleted. OUT_DIR holds
  // only generated files, so pruning it is safe.
  for (const existing of await readdir(OUT_DIR)) {
    if (!keep.has(existing)) await rm(path.join(OUT_DIR, existing), { force: true })
  }

  await writeManifest(manifest)
  console.log(`[images] ${Object.keys(manifest).length}/${files.length} images ready (${keep.size} variant files).`)
  return manifest
}

// `node scripts/generate-image-variants.mjs` (or `npm run images`)
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateImageVariants().catch((err) => {
    console.error('[images] failed:', err)
    process.exit(1)
  })
}

/**
 * Re-Wear BH brand mark.
 *
 * Icon: a near-complete green circular arrow (circular economy) with a
 * gold clothes-hanger inside (fashion / clothing).  The 30° gap in the
 * circle sits at the top-left; the arrowhead closes the loop visually.
 *
 * Props:
 *   iconSize   – px height/width of the SVG icon   (default 36)
 *   showText   – render the wordmark beside the icon (default true)
 *   textSize   – 'sm' | 'md' | 'lg'                (default 'md')
 *   white      – invert to white + gold for dark backgrounds (default false)
 */

const GREEN  = '#2D6A4F'
const GOLD   = '#CA8A04'
const WHITE  = '#FFFFFF'

export default function Logo({ iconSize = 36, showText = true, textSize = 'md', white = false }) {
  const stroke  = white ? WHITE : GREEN
  const hanger  = GOLD
  const textClr = white ? WHITE : GREEN
  const badgeBg = white ? 'rgba(255,255,255,0.15)' : '#FEF9C3'
  const badgeFg = white ? WHITE : GOLD

  const fontSizes = { sm: '0.95rem', md: '1.2rem', lg: '1.65rem' }
  const gaps      = { sm: '0.45rem', md: '0.55rem', lg: '0.7rem' }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: gaps[textSize], lineHeight: 1 }}>
      {/* ── SVG icon mark ── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/*
          Circular arrow  (center 18,18  radius 14)
          330° clockwise from 12-o'clock (18,4) → 11-o'clock (11, 5.9)
          large-arc-flag=1 (330° > 180°), sweep-flag=1 (CW)
        */}
        <path
          d="M 18 4 A 14 14 0 1 1 11 5.9"
          stroke={stroke}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/*
          Arrowhead polygon at (11, 5.9).
          Travel direction at that point: (cos330°, sin330°) = (0.866, −0.5) — upper-right.
          Back-centre offset 5.5 px: (6.24, 8.65)
          Left barb  (+perp 2.8 px): (7.64, 11.07)
          Right barb (−perp 2.8 px): (4.84,  6.23)
        */}
        <polygon
          points="11,5.9 7.64,11.07 4.84,6.23"
          fill={stroke}
        />

        {/*
          Gold clothes-hanger inside the circle.
          Neck sits at (18, 13); hook curves upper-right; shoulders fan to bar.
        */}
        {/* Hook */}
        <path
          d="M 18 13 C 18 8.5 23.5 8.5 23.5 12"
          stroke={hanger}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Shoulders */}
        <path
          d="M 11.5 21 L 18 13.5 L 24.5 21"
          stroke={hanger}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bar */}
        <line
          x1="10.5" y1="21" x2="25.5" y2="21"
          stroke={hanger}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Wordmark ── */}
      {showText && (
        <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.3rem' }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 600,
            fontSize: fontSizes[textSize],
            color: textClr,
            letterSpacing: '-0.3px',
            lineHeight: 1,
          }}>
            Re-Wear
          </span>
          <span style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: `calc(${fontSizes[textSize]} * 0.62)`,
            fontWeight: 700,
            background: badgeBg,
            color: badgeFg,
            border: `1px solid ${white ? 'rgba(255,255,255,0.3)' : '#FCD34D'}`,
            borderRadius: '4px',
            padding: '1px 5px',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
          }}>
            BH
          </span>
        </span>
      )}
    </span>
  )
}

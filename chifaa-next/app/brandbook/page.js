import PageShell from '@/components/PageShell';

export const metadata = {
  title: 'Chifaa Brand Book',
  description:
    'Chifaa brand guidelines: logo usage, color palette, typography, visual elements, spacing system, and brand voice.',
  alternates: { canonical: '/brandbook.html' },
};

// Legacy brandbook.html loads no rtl.css and no i18n/music scripts;
// script set kept identical (script.js, header.js, splash-cursor.js).
const SCRIPTS = ['/js/script.js', '/js/header.js', '/js/splash-cursor.js'];

export default function BrandbookPage() {
  return (
    <PageShell
      faUrl="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      css={['/css/brandbook.css']}
      scripts={SCRIPTS}
    >
      <main className="brandbook-container">
        <section className="brandbook-hero">
          <div className="hero-content">
            <span className="hero-label">Brand Guidelines</span>
            <h1 className="hero-title">Chifaa Brand Book</h1>
            <p className="hero-subtitle">A comprehensive guide to our visual identity, design principles, and brand standards</p>
          </div>
          <div className="hero-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </section>

        <section className="brand-section">
          <div className="section-header">
            <span className="section-number">01</span>
            <h2 className="section-title">Brand Essence</h2>
          </div>
          <div className="essence-grid">
            <div className="essence-card">
              <div className="essence-icon">??</div>
              <h3>Mission</h3>
              <p>Empowering women across North Africa and the Arab world with culturally-sensitive health information and AI-driven support</p>
            </div>
            <div className="essence-card">
              <div className="essence-icon">??</div>
              <h3>Vision</h3>
              <p>A world where every woman has access to healthcare information that truly sees and serves her</p>
            </div>
            <div className="essence-card">
              <div className="essence-icon">&#10024;</div>
              <h3>Values</h3>
              <p>Compassion, Cultural Sensitivity, Dignity, Empowerment, Innovation</p>
            </div>
          </div>
        </section>

        <section className="brand-section">
          <div className="section-header">
            <span className="section-number">02</span>
            <h2 className="section-title">Logo</h2>
          </div>
          <div className="logo-showcase">
            <div className="logo-display">
              <div className="logo-box light-bg">
                <img src="/assets/images/logo.png" alt="Chifaa Logo" className="logo-image" />
                <span className="logo-label">Primary Logo</span>
              </div>
              <div className="logo-box dark-bg">
                <img src="/assets/images/logo-yellow.png" alt="Chifaa Logo" className="logo-image" />
                <span className="logo-label">On Dark Background</span>
              </div>
            </div>
            <div className="logo-guidelines">
              <div className="guideline-item">
                <h4>Clear Space</h4>
                <p>Maintain minimum clear space equal to the height of the butterfly element around the logo</p>
              </div>
              <div className="guideline-item">
                <h4>Minimum Size</h4>
                <p>Digital: 120px width | Print: 30mm width</p>
              </div>
              <div className="guideline-item">
                <h4>Usage</h4>
                <p>Always use the original logo files. Never recreate, distort, or alter the logo</p>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-section">
          <div className="section-header">
            <span className="section-number">03</span>
            <h2 className="section-title">Color Palette</h2>
          </div>
          <div className="color-system">
            <div className="color-category">
              <h3 className="color-category-title">Primary Colors</h3>
              <div className="color-grid">
                <div className="color-card">
                  <div className="color-swatch" style={{ backgroundColor: '#E8A0B0' }}></div>
                  <div className="color-info">
                    <h4 className="color-name">Rose Pink</h4>
                    <div className="color-values">
                      <span className="color-value">HEX: #E8A0B0</span>
                      <span className="color-value">RGB: 232, 160, 176</span>
                      <span className="color-value">HSL: 348&deg;, 61%, 77%</span>
                    </div>
                    <p className="color-usage">Primary brand color, used for main UI elements and accents</p>
                  </div>
                </div>
                <div className="color-card">
                  <div className="color-swatch" style={{ backgroundColor: '#C4687E' }}></div>
                  <div className="color-info">
                    <h4 className="color-name">Deep Rose</h4>
                    <div className="color-values">
                      <span className="color-value">HEX: #C4687E</span>
                      <span className="color-value">RGB: 196, 104, 126</span>
                      <span className="color-value">HSL: 346&deg;, 43%, 59%</span>
                    </div>
                    <p className="color-usage">Accent color for headings, CTAs, and emphasis</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="color-category">
              <h3 className="color-category-title">Secondary Colors</h3>
              <div className="color-grid">
                <div className="color-card">
                  <div className="color-swatch" style={{ backgroundColor: '#7BBCB0' }}></div>
                  <div className="color-info">
                    <h4 className="color-name">Healing Teal</h4>
                    <div className="color-values">
                      <span className="color-value">HEX: #7BBCB0</span>
                      <span className="color-value">RGB: 123, 188, 176</span>
                      <span className="color-value">HSL: 169&deg;, 32%, 61%</span>
                    </div>
                    <p className="color-usage">Represents healing, calm, and medical trust</p>
                  </div>
                </div>
                <div className="color-card">
                  <div className="color-swatch" style={{ backgroundColor: '#F5EFE6' }}></div>
                  <div className="color-info">
                    <h4 className="color-name">Warm Cream</h4>
                    <div className="color-values">
                      <span className="color-value">HEX: #F5EFE6</span>
                      <span className="color-value">RGB: 245, 239, 230</span>
                      <span className="color-value">HSL: 36&deg;, 43%, 93%</span>
                    </div>
                    <p className="color-usage">Main background color, creates warmth and comfort</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="color-category">
              <h3 className="color-category-title">Neutral Colors</h3>
              <div className="color-grid">
                <div className="color-card">
                  <div className="color-swatch" style={{ backgroundColor: '#FDFAF7' }}></div>
                  <div className="color-info">
                    <h4 className="color-name">Surface White</h4>
                    <div className="color-values">
                      <span className="color-value">HEX: #FDFAF7</span>
                      <span className="color-value">RGB: 253, 250, 247</span>
                    </div>
                    <p className="color-usage">Card backgrounds and elevated surfaces</p>
                  </div>
                </div>
                <div className="color-card">
                  <div className="color-swatch" style={{ backgroundColor: '#2C2420' }}></div>
                  <div className="color-info">
                    <h4 className="color-name">Rich Brown</h4>
                    <div className="color-values">
                      <span className="color-value">HEX: #2C2420</span>
                      <span className="color-value">RGB: 44, 36, 32</span>
                    </div>
                    <p className="color-usage">Primary text color, ensures readability</p>
                  </div>
                </div>
                <div className="color-card">
                  <div className="color-swatch" style={{ backgroundColor: '#666666' }}></div>
                  <div className="color-info">
                    <h4 className="color-name">Muted Gray</h4>
                    <div className="color-values">
                      <span className="color-value">HEX: #666666</span>
                      <span className="color-value">RGB: 102, 102, 102</span>
                    </div>
                    <p className="color-usage">Secondary text, labels, and subtle elements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-section">
          <div className="section-header">
            <span className="section-number">04</span>
            <h2 className="section-title">Typography</h2>
          </div>
          <div className="typography-system">
            <div className="font-family-card">
              <div className="font-specimen" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                <h3 className="font-name">Cormorant Garamond</h3>
                <p className="font-role">Heading Font</p>
                <div className="font-sample-large">Healing Through Compassion</div>
                <div className="font-weights">
                  <span style={{ fontWeight: 400 }}>Regular</span>
                  <span style={{ fontWeight: 600 }}>Semi-Bold</span>
                  <span style={{ fontWeight: 700 }}>Bold</span>
                  <span style={{ fontWeight: 400, fontStyle: 'italic' }}>Italic</span>
                </div>
                <div className="font-alphabet">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789 !@#$%^&amp;*()
                </div>
              </div>
            </div>

            <div className="font-family-card">
              <div className="font-specimen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <h3 className="font-name">DM Sans</h3>
                <p className="font-role">Body Font</p>
                <div className="font-sample-body">Empowering women with culturally-sensitive health information and AI-driven support across North Africa and the Arab world.</div>
                <div className="font-weights">
                  <span style={{ fontWeight: 300 }}>Light</span>
                  <span style={{ fontWeight: 400 }}>Regular</span>
                  <span style={{ fontWeight: 500 }}>Medium</span>
                  <span style={{ fontWeight: 400, fontStyle: 'italic' }}>Italic</span>
                </div>
                <div className="font-alphabet">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                  abcdefghijklmnopqrstuvwxyz<br />
                  0123456789 !@#$%^&amp;*()
                </div>
              </div>
            </div>

            <div className="font-family-card">
              <div className="font-specimen" style={{ fontFamily: "'Playball', cursive" }}>
                <h3 className="font-name">Playball</h3>
                <p className="font-role">Decorative Font</p>
                <div className="font-sample-decorative">Hear them out &rarr;</div>
                <p className="font-usage-note">Used sparingly for special emphasis and decorative elements</p>
              </div>
            </div>

            <div className="typography-scale">
              <h3 className="scale-title">Type Scale</h3>
              <div className="scale-examples">
                <div className="scale-item">
                  <span className="scale-label">H1 / Hero</span>
                  <h1 style={{ fontSize: '3.4rem', margin: 0 }}>AI for Healing and Dignity</h1>
                  <span className="scale-specs">3.4rem / 54.4px</span>
                </div>
                <div className="scale-item">
                  <span className="scale-label">H2 / Section</span>
                  <h2 style={{ fontSize: '2.5rem', margin: 0 }}>Brand Guidelines</h2>
                  <span className="scale-specs">2.5rem / 40px</span>
                </div>
                <div className="scale-item">
                  <span className="scale-label">H3 / Subsection</span>
                  <h3 style={{ fontSize: '1.75rem', margin: 0 }}>Typography System</h3>
                  <span className="scale-specs">1.75rem / 28px</span>
                </div>
                <div className="scale-item">
                  <span className="scale-label">Body / Regular</span>
                  <p style={{ fontSize: '1rem', margin: 0 }}>Empowering women with culturally-sensitive health information</p>
                  <span className="scale-specs">1rem / 16px</span>
                </div>
                <div className="scale-item">
                  <span className="scale-label">Small / Caption</span>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>Secondary information and labels</p>
                  <span className="scale-specs">0.875rem / 14px</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-section">
          <div className="section-header">
            <span className="section-number">05</span>
            <h2 className="section-title">Visual Elements</h2>
          </div>
          <div className="visual-elements-grid">
            <div className="visual-element-card">
              <h3>Iconography</h3>
              <div className="icon-showcase">
                <img src="/assets/images/Butterfly.gif" alt="Butterfly" className="element-sample" />
                <img src="/assets/images/heart.png" alt="Heart" className="element-sample" />
                <img src="/assets/images/flower.png" alt="Flower" className="element-sample" />
              </div>
              <p>Soft, organic shapes that evoke healing, growth, and transformation</p>
            </div>
            <div className="visual-element-card">
              <h3>Border Radius</h3>
              <div className="radius-examples">
                <div className="radius-box" style={{ borderRadius: 8 }}>8px<br />Small</div>
                <div className="radius-box" style={{ borderRadius: 16 }}>16px<br />Medium</div>
                <div className="radius-box" style={{ borderRadius: 20 }}>20px<br />Large</div>
                <div className="radius-box" style={{ borderRadius: 50 }}>50px<br />Pill</div>
              </div>
            </div>
            <div className="visual-element-card">
              <h3>Shadows</h3>
              <div className="shadow-examples">
                <div className="shadow-box shadow-sm">Small<br />0 2px 4px</div>
                <div className="shadow-box shadow-md">Medium<br />0 8px 16px</div>
                <div className="shadow-box shadow-lg">Large<br />0 20px 45px</div>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-section">
          <div className="section-header">
            <span className="section-number">06</span>
            <h2 className="section-title">Spacing System</h2>
          </div>
          <div className="spacing-system">
            <p className="spacing-intro">We use an 8px base unit for consistent spacing throughout the design</p>
            <div className="spacing-scale">
              {[8, 16, 24, 32, 48, 64, 80].map((px) => (
                <div className="spacing-item" key={px}>
                  <div className="spacing-visual" style={{ width: px }}></div>
                  <span className="spacing-label">{px}px / {px / 16}rem</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-section">
          <div className="section-header">
            <span className="section-number">07</span>
            <h2 className="section-title">Brand Voice &amp; Tone</h2>
          </div>
          <div className="voice-grid">
            <div className="voice-card">
              <h3>We Are</h3>
              <ul className="voice-list positive">
                <li>Compassionate and understanding</li>
                <li>Culturally sensitive and respectful</li>
                <li>Empowering and supportive</li>
                <li>Clear and accessible</li>
                <li>Warm and human</li>
              </ul>
            </div>
            <div className="voice-card">
              <h3>We Are Not</h3>
              <ul className="voice-list negative">
                <li>Clinical or cold</li>
                <li>Patronizing or condescending</li>
                <li>Overly technical or jargon-heavy</li>
                <li>Dismissive of cultural context</li>
                <li>Impersonal or robotic</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

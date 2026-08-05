/**
 * @file MenaMap.js
 * @description Interactive D3 map component for visualizing MENA region women's health data.
 * Handles SVG rendering, hover mechanics, boundary clamping, and accessibility points.
 */

// We assume D3 is available globally via script tag (e.g. <script src="https://d3js.org/d3.v7.min.js"></script>)

/**
 * Valid MENA Country ISO-3 Codes to filter from World GeoJSON
 */
const MENA_COUNTRIES = [
    "DZA", "BHR", "COM", "DJI", "EGY", "IRQ", "JOR", "KWT", "LBN", "LBY", 
    "MRT", "MAR", "OMN", "PSE", "ISR", "QAT", "SAU", "SOM", "SDN", "SYR", "TUN", "ARE", "YEM"
];

class MenaMap {
    constructor(containerSelector, dataPath, geoJsonPath) {
        this.containerSelector = containerSelector;
        this.dataPath = dataPath;
        this.geoJsonPath = geoJsonPath; // Path to standard world GeoJSON
        this.data = new Map();
        
        // Colors extracted from site styling
        this.colors = {
            primary: "#E8A0B0",
            accent: "#C4687E",
            surface: "#FDFAF7",
            textBody: "#2C2420",
            defaultFill: "rgba(196, 104, 126, 0.15)", // accent @ 15%
            hoverFill: "rgba(196, 104, 126, 0.65)",   // accent @ 65%
            border: "rgba(196, 104, 126, 0.40)"
        };
        
        this.init();
    }

    async init() {
        this.showSkeleton();
        
        try {
            // Fetch visualization datasets
            const [mapData, healthData, moroccoSvg] = await Promise.all([
                d3.json(this.geoJsonPath),
                d3.json(this.dataPath),
                fetch("assets/images/morocco.svg").then(response => {
                    if (!response.ok) throw new Error("Failed to load Morocco SVG");
                    return response.text();
                })
            ]);

            // Filter for MENA only
            const menaFeatures = mapData.features.filter(d => MENA_COUNTRIES.includes(d.id)).map(d => {
                if (d.id === "ISR") {
                    d.id = "PSE"; // Combine Israel into Palestine
                    d.properties.name = "Palestine";
                }
                return d;
            });

            this.moroccoSvg = moroccoSvg;

            // Map data lookup
            healthData.forEach(d => this.data.set(d.id, d));

            this.hideSkeleton();
            this.render(menaFeatures);
            this.setupTooltip();
        } catch (error) {
            console.error("Error loading MENA Map Data:", error);
            document.querySelector(this.containerSelector).innerHTML = "<p>Data unavailable at this time.</p>";
        }
    }

    showSkeleton() {
        const container = document.querySelector(this.containerSelector);
        if(container) {
            container.innerHTML = `<div class="mena-skeleton" style="width:100%; height: 500px; background: #EEE; border-radius: 12px; animation: pulse 1.5s infinite;"></div>`;
        }
    }

    hideSkeleton() {
        const container = document.querySelector(this.containerSelector);
        if(container) container.innerHTML = '';
    }

    render(features) {
        const width = 800;
        const height = 500;
        
        const container = d3.select(this.containerSelector)
            .style("position", "relative")
            .style("width", "100%")
            .style("max-width", "900px")
            .style("margin", "0 auto")
            .style("transform", "translateX(8%)");

        // Set up SVG with responsive viewBox
        this.svg = container.append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("width", "100%")
            .style("height", "auto")
            .style("overflow", "visible");

        // Create projection targeting MENA region nicely
        const projection = d3.geoMercator()
            .center([25, 25]) // Central MENA longitude/latitude roughly
            .scale(700)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);
        const moroccoFeature = features.find(d => d.id === "MAR");
        const algeriaFeature = features.find(d => d.id === "DZA");
        const standardFeatures = features.filter(d => d.id !== "MAR");

        if (moroccoFeature && this.moroccoSvg) {
            this.renderMoroccoSvg(path, moroccoFeature, algeriaFeature);
        }

        // Draw Map Features
        this.svg.selectAll("path")
            .data(standardFeatures)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", this.colors.defaultFill)
            .attr("stroke", this.colors.border)
            .attr("stroke-width", 1)
            .attr("tabindex", 0) // Keyboard access
            .style("transition", "fill 200ms ease, stroke-width 200ms ease")
            .style("outline", "none")
            .style("cursor", "pointer")
            // Interactions
            .on("click", (event, d) => {
                event.stopPropagation();
                this.onCountryFocus(event, d);
            })
            .on("mouseenter", (event, d) => {
                d3.select(event.currentTarget)
                    .attr("fill", this.colors.hoverFill)
                    .attr("stroke-width", 2);
            })
            .on("mouseleave", (event, d) => {
                if (this.activeCountryId !== d.id) {
                    d3.select(event.currentTarget)
                        .attr("fill", this.colors.defaultFill)
                        .attr("stroke-width", 1);
                }
            });

        // this.renderLegend(container);
    }

    renderMoroccoSvg(path, moroccoFeature, algeriaFeature) {
        const parser = new DOMParser();
        const moroccoDoc = parser.parseFromString(this.moroccoSvg, "image/svg+xml");
        
        // Grab the actual map shapes (could be <path>, <g>, etc - get the first top level path or g)
        const svgShape = moroccoDoc.querySelector("path, g");
        if (!svgShape) return;

        const bounds = path.bounds(moroccoFeature);
        const algeriaBounds = algeriaFeature ? path.bounds(algeriaFeature) : null;
        const targetWidth = bounds[1][0] - bounds[0][0];
        const targetHeight = bounds[1][1] - bounds[0][1];
        
        const moroccoData = {
            id: "MAR",
            properties: { name: "Morocco" }
        };

        const moroccoNode = document.importNode(svgShape, true);
        moroccoNode.removeAttribute("fill");
        moroccoNode.removeAttribute("stroke");

        const targetScaleAndTranslation = this.svg.append("g");
        
        const morocco = targetScaleAndTranslation.append("g")
            .datum(moroccoData)
            .attr("class", "morocco-svg-country")
            .attr("tabindex", 0)
            .style("transition", "fill 200ms ease, stroke-width 200ms ease")
            .style("outline", "none")
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                event.stopPropagation();
                this.onCountryFocus(event, d);
            })
            .on("mouseenter", (event) => {
                d3.select(event.currentTarget)
                    .attr("fill", this.colors.hoverFill)
                    .attr("stroke-width", 2 / this.moroccoScale);
            })
            .on("mouseleave", (event) => {
                if (this.activeCountryId !== "MAR") {
                    d3.select(event.currentTarget)
                        .attr("fill", this.colors.defaultFill)
                        .attr("stroke-width", 1 / this.moroccoScale);
                }
            });

        morocco.node().appendChild(moroccoNode);

        this.moroccoScale = 1;

        targetScaleAndTranslation.attr("transform", "");
            
        morocco
            .attr("fill", this.colors.defaultFill)
            .attr("stroke", this.colors.border)
            .attr("stroke-width", 1);
    }

    setupTooltip() {
        this.tooltip = d3.select(this.containerSelector)
            .append("div")
            .attr("class", "mena-tooltip")
            .style("position", "absolute")
            .style("width", "340px")
            .style("max-height", "80vh")
            .style("overflow-y", "auto")
            .style("background", this.colors.surface)
            .style("border-radius", "16px")
            .style("box-shadow", "0 20px 45px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0,0,0,0.06)")
            .style("padding", "24px")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("transform", "translateY(15px)")
            .style("transition", "all 300ms cubic-bezier(0.2, 0.8, 0.2, 1)")
            .style("z-index", "100")
            .style("font-family", "var(--font-body)")
            .style("color", "var(--color-text-body)");
            
        document.addEventListener("click", (event) => {
            const isTooltip = event.target.closest(".mena-tooltip");
            const isMapShape = event.target.closest("path");
            if (event.target.classList.contains("mena-close-btn") || (!isTooltip && !isMapShape)) {
                this.closeTooltip();
            }
        });
    }

    closeTooltip() {
        if(this.activeCountryId) {
            this.setCountryVisual(this.activeCountryId, this.colors.defaultFill, 1);
            this.activeCountryId = null;
        }
        if(this.tooltip) {
            this.tooltip
                .style("opacity", 0)
                .style("transform", "translateY(10px)")
                .style("pointer-events", "none");
        }
    }

    onCountryFocus(event, d) {
        if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
        this.closeTooltip();
        this.activeCountryId = d.id;

        // Highlight logic
        // Highlight all shapes belonging to the same country id.
        this.setCountryVisual(d.id, this.colors.hoverFill, 2);

        // Map data fetch
        const countryData = this.data.get(d.id) || {
            country: d.properties.name || "Unknown",
            iso2: null,
            flag: "",
            womensHealth: {},
            chronicDisease: {},
            cervicalCancer: {}
        };

        const safeVal = (v) => v || "<span style='color: #a0a0a0; font-style: italic;'>Data unavailable</span>";

        const flagHtml = countryData.iso2 
            ? `<img src="https://flagcdn.com/w40/${countryData.iso2.toLowerCase()}.png" width="32" alt="${countryData.country} flag" style="vertical-align: middle; margin-left: 12px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" />`
            : `${countryData.flag} `;

        const lang = localStorage.getItem('chifaa_lang') || 'en';
        const t = {
            info: lang === 'ar' ? 'معلومات البلد' : 'Country information',
            womensHealth: lang === 'ar' ? 'صحة المرأة' : 'Women\'s Health',
            femalePop: lang === 'ar' ? 'نسبة الإناث' : 'Female Pop',
            lifeExp: lang === 'ar' ? 'متوسط العمر' : 'Life Exp',
            maternal: lang === 'ar' ? 'وفيات الأمهات' : 'Maternal Mort',
            literacy: lang === 'ar' ? 'القراءة' : 'Literacy',
            chronic: lang === 'ar' ? 'الأمراض المزمنة' : 'Chronic Disease',
            diabetes: lang === 'ar' ? 'السكري' : 'Diabetes',
            cvd: lang === 'ar' ? 'أمراض القلب' : 'CVD Rate',
            obesity: lang === 'ar' ? 'السمنة' : 'Obesity',
            cervical: lang === 'ar' ? 'سرطان عنق الرحم' : 'Cervical Cancer',
            incidence: lang === 'ar' ? 'الإصابة' : 'Incidence',
            mortality: lang === 'ar' ? 'الوفيات' : 'Mortality',
            hpv: lang === 'ar' ? 'لقاح HPV' : 'HPV Vac',
            screening: lang === 'ar' ? 'الفحص' : 'Screening'
        };

        const htmlContent = `
            <div style="display: flex; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.06);">
                <span class="icon-tooltip" aria-label="${t.info}" title="${t.info}">i</span>
                <h3 style="margin: 0; font-family: var(--font-heading); color: var(--color-text-body); font-size: 1.4rem; font-weight: 700;">
                    ${countryData.country}
                </h3>
                ${flagHtml}
                <button class="mena-close-btn" style="margin-left: auto; background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #a0a0a0; padding: 0; line-height: 1;">&times;</button>
            </div>
            
            <div style="background: rgba(196, 104, 126, 0.04); padding: 14px; border-radius: 10px; margin-bottom: 12px; border: 1px solid rgba(196, 104, 126, 0.1);">
                <strong style="color: var(--color-accent); display: flex; align-items: center; margin-bottom: 10px; font-size: 0.95rem; font-weight: 600;">
                    ${t.womensHealth}
                </strong>
                <div style="font-size: 0.85rem; line-height: 1.5; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.femalePop}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.womensHealth.femalePopShare)}</strong></div>
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.lifeExp}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.womensHealth.lifeExpectancy)}</strong></div>
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.maternal}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.womensHealth.maternalMortality)}</strong></div>
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.literacy}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.womensHealth.literacyRate)}</strong></div>
                </div>
            </div>

            <div style="background: rgba(196, 104, 126, 0.04); padding: 14px; border-radius: 10px; margin-bottom: 12px; border: 1px solid rgba(196, 104, 126, 0.1);">
                <strong style="color: var(--color-accent); display: flex; align-items: center; margin-bottom: 10px; font-size: 0.95rem; font-weight: 600;">
                    ${t.chronic}
                </strong>
                <div style="font-size: 0.85rem; line-height: 1.5; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.diabetes}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.chronicDisease.diabetesPrevalence)}</strong></div>
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.cvd}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.chronicDisease.cardiovascularRate)}</strong></div>
                    <div style="grid-column: span 2;"><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.obesity}</span> <strong style="font-size:1rem; color: var(--color-text-body, #333); margin-left: 5px;">${safeVal(countryData.chronicDisease.obesityRate)}</strong></div>
                </div>
            </div>

            <div style="background: rgba(196, 104, 126, 0.04); padding: 14px; border-radius: 10px; border: 1px solid rgba(196, 104, 126, 0.1);">
                <strong style="color: var(--color-accent); display: flex; align-items: center; margin-bottom: 10px; font-size: 0.95rem; font-weight: 600;">
                    ${t.cervical}
                </strong>
                <div style="font-size: 0.85rem; line-height: 1.5; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.incidence}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.cervicalCancer.incidenceRate)}</strong></div>
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.mortality}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.cervicalCancer.mortalityRate)}</strong></div>
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.hpv}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.cervicalCancer.hpvVacCoverage)}</strong></div>
                    <div><span style="color: var(--color-text-muted, #666); font-size: 0.8rem; text-transform: uppercase;">${t.screening}</span><br/><strong style="font-size:1rem; color: var(--color-text-body, #333);">${safeVal(countryData.cervicalCancer.screeningCoverage)}</strong></div>
                </div>
            </div>
        `;

        this.tooltip.html(htmlContent);
        this.tooltip
            .style("opacity", 1)
            .style("transform", "translateY(0)")
            .style("pointer-events", "auto"); 
        
        // Always position near the country bounding box instead of exact mouse/cursor
        const bbox = event.currentTarget.getBoundingClientRect();
        const containerRect = document.querySelector(this.containerSelector).getBoundingClientRect();
        
        // Calculate center of country or bounding box inside container
        const centerX = bbox.left - containerRect.left + (bbox.width / 2);
        const topY = bbox.top - containerRect.top;
        
        this.positionTooltip(centerX, topY);
    }

    positionTooltip(x, y) {
        const offset = 10;
        const tooltipNode = this.tooltip.node();
        const tooltipRect = tooltipNode.getBoundingClientRect();
        const containerRect = document.querySelector(this.containerSelector).getBoundingClientRect();

        let posX = x + offset;
        let posY = y + offset;

        // Smart boundary clamping (Right Side)
        if (posX + tooltipRect.width > containerRect.width) {
            posX = x - tooltipRect.width - offset;
        }
        
        // Smart boundary clamping (Bottom Side)
        if (posY + tooltipRect.height > containerRect.height) {
            posY = containerRect.height - tooltipRect.height - offset;
        }

        // Left Boundary Clamping
        if (posX < 0) posX = offset;

        this.tooltip
            .style("left", `${posX}px`)
            .style("top", `${posY}px`);
    }

    setCountryVisual(countryId, fill, strokeWidth) {
        this.svg.selectAll("path").filter(p => p && p.id === countryId)
            .attr("fill", fill)
            .attr("stroke-width", strokeWidth);

        if (countryId === "MAR" && this.moroccoScale) {
            this.svg.selectAll(".morocco-svg-country")
                .attr("fill", fill)
                .attr("stroke-width", strokeWidth / this.moroccoScale);
        }
    }

    onCountryBlur(event, d) {
        // Remove active state
        this.setCountryVisual(d.id, this.colors.defaultFill, 1);

        // Add a small delay so user can move mouse onto tooltip
        this.hideTimeout = setTimeout(() => {
            this.tooltip.style("opacity", 0).style("transform", "translateY(10px)");
        }, 150);
    }
    
    renderLegend(container) {
        // Legend has been removed per request
    }
}

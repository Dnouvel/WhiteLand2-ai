# Design Guidelines: Geographical Portal for City Plot HBU Analysis

## Design Approach

**System**: Professional Dashboard inspired by Google Maps' interface clarity + Zillow's property data presentation + Linear's typography hierarchy

**Rationale**: This is a utility-focused, information-dense professional tool requiring precision, clarity, and efficient workflows. Visual appeal supports function, not vice versa.

**Core Principle**: Map-first interface where the interactive map is the hero element, occupying primary screen real estate with supporting panels for data and analysis.

## Layout System

**Primary Layout**: Full-screen split view
- Interactive map: 60-70% viewport width (left/main area)
- Information panel: 30-40% viewport width (right sidebar, collapsible on mobile)
- Top navigation bar: Fixed, 64px height
- Mobile: Stack vertically with map first, swipeable panel overlay

**Spacing Units**: Tailwind units of 2, 4, 6, and 8 for consistency
- Component padding: p-6 or p-8
- Section gaps: gap-4 or gap-6
- Generous whitespace in data panels: py-8 between sections

**Container Widths**:
- Sidebar panels: Fixed width ~400-480px
- Modal overlays: max-w-4xl for HBU reports
- Form elements: max-w-sm to max-w-md

## Typography Hierarchy

**Fonts**: Inter (primary UI) + JetBrains Mono (data/coordinates)

**Scale**:
- Page title/heading: text-2xl, font-semibold
- Section headers: text-lg, font-semibold
- Property labels: text-sm, font-medium, uppercase tracking
- Body text: text-base
- Data values: text-lg, font-mono
- Map labels: text-xs
- Captions/metadata: text-xs

## Component Library

### Navigation Bar
- Logo/brand left, user account right
- Search bar center (location/address search)
- "Request HBU Study" primary CTA button (top right)
- Breadcrumb trail below for selected plot context

### Interactive Map Component
- Full-height map canvas with Leaflet/Mapbox integration
- Custom plot overlays with boundary visualization
- Hover states: subtle border highlight
- Selected state: bold boundary, semi-transparent fill
- Map controls: zoom +/-, layer toggle, fullscreen (bottom-left)
- Coordinates display (bottom-right corner)

### Plot Information Panel (Sidebar)
**Collapsed state**: Thin vertical tab with expand icon
**Expanded state**: Full sidebar with sections:

1. **Plot Header**
   - Address (text-xl, font-semibold)
   - Plot ID/parcel number (text-sm, mono)
   - Quick actions: Save, Share, Print icons

2. **Key Metrics Grid** (2-column)
   - Lot size, Zoning, Current use, Market value
   - Label above, value below in each cell
   - Dividers between metric pairs

3. **Details Accordion**
   - Collapsible sections: Location, Ownership, History, Zoning details
   - Expand/collapse icons
   - Indented content with list styling

4. **AI Analysis CTA**
   - Prominent button: "Generate HBU Study"
   - Subtext explaining AI analysis (~2-3 min processing)
   - Previous studies list below (if any exist)

### HBU Study Report Modal
**Full-screen overlay** with:
- Header: Plot address, generation timestamp, close button
- Content area with scrollable sections:
  - Executive Summary (highlighted box)
  - Zoning Analysis
  - Market Demand Assessment
  - Financial Feasibility
  - Development Recommendations
  - Supporting Data Tables
- Footer: Export PDF, Share, Save buttons
- Typography: Generous line-height (leading-relaxed) for readability

### Map Legend & Layers
- Floating panel (top-left below nav)
- Toggle switches for: Plot boundaries, Zoning overlay, Demographics, Transit
- Compact design, semi-transparent background

### Loading States
- Skeleton screens for data panels
- Map loading: Simple spinner overlay
- AI processing: Progress indicator with estimated time
- Toast notifications for save/share actions

## Data Visualization

**Tables**: 
- Striped rows, hover highlights
- Monospace fonts for numerical data
- Right-align numbers, left-align text
- Compact row height: py-3

**Status Badges**:
- Pill-shaped, text-xs, font-medium
- Different visual weights for: Active, Pending, Approved, Restricted

**Property Cards** (for search results):
- Thumbnail map preview (120x80px)
- Address headline
- 3-4 key metrics in grid
- Compact spacing: p-4

## Images

**No traditional hero image**. This application is map-first.

**Image Usage**:
1. **Empty states**: Illustrated graphics when no plot selected (~300x200px, center-aligned)
2. **Plot thumbnails**: Auto-generated map snapshots in search results/history
3. **Logo**: Simple wordmark in navigation (no complex imagery needed)

## Responsive Behavior

**Desktop (lg:)**: Full split view, sidebar always visible
**Tablet (md:)**: Map 70%, collapsible sidebar overlay
**Mobile (base)**: 
- Map full-screen with floating bottom sheet for plot info
- Swipe up to expand plot details
- Hamburger menu for navigation
- Single-column data layouts

## Animations

**Minimal, functional only**:
- Map transitions: Smooth pan/zoom (300ms ease)
- Sidebar collapse/expand: slide transition (200ms)
- Modal entry: Fade in (150ms)
- NO scroll-triggered animations
- NO decorative motion

## Forms & Inputs

**Search bar**: Rounded, shadow-sm, icon prefix (magnifying glass)
**Select dropdowns**: Native styling with custom arrow
**Toggle switches**: For map layers and filters
**Text inputs**: Border, focus ring, clear helper text below
**Button hierarchy**:
- Primary: Filled (Generate HBU Study, Export)
- Secondary: Outlined (Cancel, Filter)
- Tertiary: Text-only (Clear, Reset)

## Accessibility

- Semantic HTML throughout
- ARIA labels for map interactions
- Keyboard navigation for map panning (arrow keys)
- Focus indicators on all interactive elements
- High contrast ratios for text over maps
- Screen reader announcements for AI processing states

This design prioritizes **clarity, efficiency, and professional presentation** for a tool that professionals will use repeatedly. The map is the star; everything else supports rapid property analysis and decision-making.
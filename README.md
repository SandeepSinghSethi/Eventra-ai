MTDMHM
# Eventra — Expert Celebration & Event Planner
**Built for PromptWars Challenge 5: Celebration & Event Planning**

Eventra is an AI-powered celebration and event-planning web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. It combines the expertise of a professional planner, a budget analyst, and a creative consultant to plan weddings, milestone birthdays, and community festivals.

---

## 🌟 Key Features

1. **Intelligent Event Intake & Persona**
   - Natural conversational interface tailored for weddings, birthdays, and community gatherings.
   - Structured 5-point intake flow or instant draft generation from a single prompt.

2. **Budget Optimization Engine (`calculateBudget`)**
   - Exact mathematical breakdown across categories summing to the total.
   - Strict **8-10% contingency buffer** (10% for community events) positioned as the final row.
   - Dynamic SVG donut chart with center total and per-category progress bars.

3. **Backward Timeline Generator (`buildTimeline`)**
   - Tasks and milestones counted backward from the target event date ($T-12$, $T-4$, etc.).
   - Overdue tasks automatically scheduled as **Do Now** with current date.
   - Owner assignments (`user`, `family`, `vendor`, `volunteer`) and priority flags.
   - Grouped chronologically by month with interactive checkboxes.

4. **Comprehensive Vendor Checklists**
   - Collapsible accordion cards with permitted icon mappings.
   - Screenings: *Questions to ask before booking*, *Contract must-haves*, *Payment advice*, and *Red flags*.

5. **Personalized Creative Themes (Ideas Grid)**
   - Exactly 3 curated aesthetic styles: **Classic**, **Modern**, and **Budget DIY**.
   - Hex color palette swatches with hover tooltips, decor notes, food pairings, and signature moments.

6. **Safety & Risk Mitigation**
   - 3 to 5 contingency plans addressing weather disruptions, vendor backups, and overflow buffers.
   - Community compliance reminders for sound, permits, and first aid.

7. **Multi-Format Exports**
   - **Export PDF**: Dedicated print stylesheet formatting the entire plan into an executive report.
   - **Add to Calendar (.ics)**: Standard RFC 5545 iCalendar file generation containing all dated milestones and tasks.

---

## 🎨 Design System & Tokens

* **Light Theme**:
  * Background Ivory: `#FFFBF7`
  * Surface White: `#FFFFFF`
  * Text Primary: `#1F1A17`
  * Muted Text: `#6B625B`
  * Border: `#EADFD6`
  * Primary Plum: `#7A3E9D` (AA compliant)
  * Accent Coral: `#E8684A`
* **Dark Theme**:
  * Background: `#15121A`
  * Surface: `#1E1A25`
  * Text: `#F5F0EA`
  * Muted: `#B8AFC0`
  * Border: `#332D3D`
  * Primary: `#C9A0E6`
  * Accent: `#F08A70`
* **Responsive Layouts**:
  * **Desktop (≥1024px)**: 3-zone architecture — 280px left sidebar, center chat panel, 450px right plan drawer.
  * **Tablet (640px-1023px)**: Collapsible sidebar and slide-over plan drawer.
  * **Mobile (<640px)**: Single column with pinned composer and bottom tab navigation (`Chat`, `Plan`, `Events`).

---

## 🛠️ Tech Stack & Architecture

* **Framework**: Next.js 16 (App Router)
* **Language**: TypeScript (strict mode)
* **Validation**: Zod schema validation on all inputs and server tools
* **Styling**: Tailwind CSS v4 with custom design tokens
* **Icons**: `lucide-react`
* **Persistence**: Local database store (`.data/events.json`) with zero external DB prerequisites

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

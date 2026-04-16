# Design System Documentation: The Stealth Aesthetic

## 1. Overview & Creative North Star

**Creative North Star: "The Shadow Architect"**
This design system is built on the philosophy of "Stealth Luxury." It moves away from the noisy, colorful interfaces of the mass market toward a high-end, editorial experience that feels engineered rather than merely "designed." By utilizing a monochromatic palette and high-tech typography, we create an environment where content is illuminated like an artifact in a dark gallery.

To break the "template" look, we lean into **intentional asymmetry** and **tonal depth**. Rather than rigid grids, we use expansive negative space to create a sense of breathing room, allowing the high-tech precision of Space Grotesk to command attention. This is a system of whispers, not shouts—where premium quality is communicated through the softness of a radius and the subtle glow of a layered surface.

---

## 2. Colors

The color strategy is strictly monochromatic, specifically curated to avoid all blue or cool undertones. We utilize a "Neutral-Warm" spectrum that feels grounded and expensive.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Structural boundaries must be defined exclusively through background color shifts. For example, a `surface_container_low` (#1c1b1b) section should sit on a `surface` (#131313) background to create a felt edge rather than a seen one.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
- **Base Layer:** `surface` (#131313)
- **Recessed Areas:** Use `surface_container_lowest` (#0e0e0e) for deep-set elements like input fields or background canvases.
- **Elevated Layers:** Use `surface_container_high` (#2a2a2a) and `highest` (#353534) for floating elements or interactive cards.

### The "Glass & Gradient" Rule
To add "soul" to the stealth aesthetic, utilize Glassmorphism for floating navigation and overlays. Use semi-transparent versions of `surface_variant` with a `20px` to `40px` backdrop-blur. 
- **Signature Textures:** Apply a subtle linear gradient to Primary CTAs (transitioning from `primary` #ffffff to `primary_container` #d4d4d4 at a 45-degree angle). This prevents "flatness" and gives buttons a machined, metallic quality.

---

## 3. Typography

This system employs a dual-typeface strategy to balance high-tech precision with human-centric readability.

*   **Display & Headlines (Space Grotesk):** This is our "Technical Signature." Space Grotesk’s geometric quirks provide a modern, engineered feel. Use `display-lg` (3.5rem) with tight tracking (-2%) for hero sections to create an editorial, high-contrast impact.
*   **Body & Titles (Manrope):** We use Manrope for all functional reading. It is cleaner and more legible at small scales than Space Grotesk, ensuring that the "stealth" look doesn't sacrifice usability.
*   **Hierarchy as Brand:** Use extreme scale contrast. A `display-lg` headline paired with a `label-md` (0.75rem) sub-header creates a sophisticated, asymmetrical tension that feels custom-built.

---

## 4. Elevation & Depth

In a stealth system, depth replaces color as the primary carrier of meaning.

*   **The Layering Principle:** Stack surfaces from darkest (bottom) to lightest (top). Place a `surface_container_highest` (#353534) element atop a `surface` background to create a "lift" that feels natural and physical.
*   **Micro-Glows (Ambient Shadows):** Traditional black shadows are invisible on a #131313 background. Instead, use "Micro-Glows." For floating elements, apply a shadow with a large blur (30px-50px) using a low-opacity white/silver (e.g., `on_surface` at 4% opacity). This creates an atmospheric "aura" around the component.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a container edge, use a "Ghost Border." This is a 1px stroke using `outline_variant` (#474747) at 15% opacity. Never use 100% opaque borders.
*   **Glassmorphism:** For top-tier navigation or modals, use semi-transparent surface colors with `backdrop-filter: blur(16px)`. This allows the "Stealth" background to bleed through, ensuring the UI feels like a single cohesive environment.

---

## 5. Components

All components must strictly adhere to the `ROUND_FULL` (9999px) aesthetic to maintain the "pill-shaped" modernism the system demands.

*   **Buttons:**
    *   **Primary:** `on_primary_fixed` (#ffffff) background with `on_primary` (#1a1c1c) text. High-contrast, maximum visibility. 
    *   **Secondary:** `surface_container_highest` background with `on_surface` text. Subtle and integrated.
    *   **Tertiary:** No background; `primary` text with an underline that only appears on hover.
*   **Cards & Lists:** 
    *   **Strict Rule:** No dividers. Separate list items using 8px–16px of vertical whitespace or by alternating between `surface` and `surface_container_low`.
    *   **Cards:** Use `surface_container_low` with a `ROUND_XL` (3rem) or `ROUND_FULL` corner radius.
*   **Input Fields:** 
    *   Use `surface_container_lowest` (#0e0e0e) for the field background to create a "hollowed out" effect. Use `outline_variant` for the "Ghost Border" on focus.
*   **Chips:** 
    *   Selection chips should be `ROUND_FULL` with a `surface_container_high` background. On selection, transition to `primary` (white) background with `on_primary` (black) text.

---

## 6. Do's and Don'ts

### Do
*   **Do** use massive amounts of negative space to signify luxury.
*   **Do** use "Micro-Glows" to define hierarchy in dark environments.
*   **Do** lean into the `ROUND_FULL` aesthetic for all interactive hit areas.
*   **Do** use Manrope for any text longer than two lines to preserve readability.

### Don't
*   **Don't** use blue, purple, or cool-grey tones. Stick to neutral/warm blacks and silvers.
*   **Don't** use 1px solid, high-contrast borders.
*   **Don't** use standard "Drop Shadows." Use tonal shifts and glows.
*   **Don't** crowd the layout. If the design feels busy, increase the margins between surface containers.
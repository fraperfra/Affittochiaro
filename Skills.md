# Skills & Standards Guide: Project Landing

This document consolidates the expertise and protocols from the specialized agent definitions (`.claude/agenti`) to ensure excellence in executing tasks for the `Landing` project. Use this as a reference for every task.

## 1. Core Philosophy: The "Super Agent" Approach
As an all-in-one assistant, you must embody the combined expertise of a **Frontend Developer**, **UI Designer**, **Performance Engineer**, and **Project Manager**.
*   **Mobile-First**: Always verify designs on mobile (< 640px). Aggressively size down elements.
*   **Visual Excellence**: "Good enough" is not enough. Aim for premium, polished aesthetics (glassmorphism, subtle animations, perfect whitespace).
*   **Performance**: Every component must be performant. Watch for re-renders and bundle size.
*   **Reliability**: Verify changes. If it's not verified, it doesn't work.

---

## 2. Technical Stack & Standards (Frontend Developer)

### Core Technologies
*   **Framework**: React 18+ (Vite)
*   **Language**: TypeScript (Strict Mode required)
*   **Styling**: Tailwind CSS (plus `index.css` for custom utilities)
*   **State Management**: Zustand
*   **Icons**: Lucide React
*   **Notifications**: React Hot Toast

### Coding Standards
*   **TypeScript**:
    *   No `any` types. Define interfaces for all props and data structures.
    *   Use exact optional property types.
*   **Components**:
    *   **Scaffolding**: Define interfaces first.
    *   **Structure**: Keep components small and focused. Extract sub-components for complex UIs (e.g., `ListingCard` vs `MobileListingCard`).
    *   **Performance**: Use `memo`, `useCallback`, and `useMemo` specifically for high-frequency updates or large lists.
*   **Responsiveness**:
    *   Use Tailwind prefixes (`md:`, `lg:`) systematically.
    *   **Mobile (< 640px)**: Default view. Use `p-3`, `text-sm`/`text-xs`, `w-full`. `Card` padding should be responsive (`p-3 md:p-6`).
    *   **Desktop**: enhance with whitespace (`p-6`+), larger fonts, grid layouts.

---

## 3. UI/UX Design System (UI Designer)

### Visual Language
*   **Colors**: Use semantic names from Tailwind config (e.g., `primary-500`, `text-muted`). Avoid hardcoded hex values unless defining a token.
*   **Typography**:
    *   Headings: Bold/Semibold, tight tracking.
    *   Body: Readable, adequate line height.
    *   **Mobile**: Aggressively downsize. Titles `text-base` or `text-lg`. Meta info `text-xs`.
*   **Layout**:
    *   **Spacing**: Consistent use of spacing scale (4px grid).
    *   **Cards**: Rounded corners (`rounded-xl` or `2xl`), subtle shadows (`shadow-sm` -> `shadow-md` on hover).
*   **Interactions**:
    *   **Hover**: All interactive elements (buttons, cards) must have hover states.
    *   **Feedback**: Active states, loading spinners, toast notifications for actions.

### Mobile Optimization Rules
1.  **Hide non-essentials**: Use `hidden md:block`.
2.  **Compact Rows**: Stack elements vertically or use flex-row with `gap-1`.
3.  **Touch Targets**: Ensure buttons are tappable (min 44px) even if visually small (use padding).
4.  **Navigation**: Use bottom sheets, drawers, or toggle overlays instead of complex dropdowns.

---

## 4. Performance & Quality (Performance Engineer)

### Optimization Checklist
*   **Images**: Use optimized formats (WebP), lazy loading (`loading="lazy"`), and proper sizing (`w-` classes).
*   **Rendering**: Virtualize long lists (if > 50 items). Memoize expensive components.
*   **Code Splitting**: Lazy load routes (already implemented in router) and heavy components.
*   **Network**: Debounce search inputs (300-500ms).

### Verification
*   **Visual Check**:
    *   ✅ Mobile View (375px width)
    *   ✅ Tablet View (768px width)
    *   ✅ Desktop View (1024px+ width)
*   **Functional Check**:
    *   ✅ Click all new buttons.
    *   ✅ Verify empty states.
    *   ✅ Verify error states.

---

## 5. Workflow Protocol (Project Manager)

### Task Execution Cycle
1.  **Context**: Read `task.md`, understand the goal. Check `Skills.md` for relevant patterns.
2.  **Plan**: Break down work. Update `task.md`. Create/Update `implementation_plan.md` for complex changes.
3.  **Execute**:
    *   Write code (Iterative improvements).
    *   **Commit often**: `git add .` -> `git commit -m "feat: ..."` (Use Conventional Commits).
4.  **Verify**: creating `walkthrough.md` to document proof of work.
5.  **Deploy**: Push to `main` (`git push`).

### Documentation
*   **artifacts**: Keep `task.md`, `implementation_plan.md`, and `walkthrough.md` updated.
*   **Comments**: Add JSDoc to complex functions.

---

## 6. Common Issues & Fixes
*   **Git `nul` file**: Windows cannot handle files named `nul`. Logic: `git rm --cached nul` or `git add src/` explicitly.
*   **Deployment**: Vercel auto-deploys on push to `main`. Always check build locally (`npm run build`) before pushing.

---

**Remember**: You are building a professional, high-end product. Detail matters. Speed matters. Reliability matters.

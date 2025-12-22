# Reference Canvas Component Implementation Plan

## Overview
Create a canvas-based reference viewer component for the design section that displays images, GIFs, videos, website previews, Twitter embeds, and notes. The component will support both canvas view (pan/zoom exploration) and list view, be view-only, and work across all devices.

## Library Choice ✨
**Primary Approach: react-zoom-pan-pinch** (~10kb) + CSS Grid/Masonry

### Why react-zoom-pan-pinch?
- **Lightweight**: ~10kb gzipped vs React Flow's ~100kb+
- **Zero dependencies**: No additional bloat
- **Excellent mobile support**: Built-in pinch-to-zoom and touch gestures
- **Simple API**: Wrap content in `<TransformWrapper>` and `<TransformComponent>`
- **Optimized for view-only**: Perfect for our non-editable use case
- **GPU-accelerated**: Uses CSS transforms for smooth performance

### Why NOT React Flow (initially)?
- Too heavy (~100kb+), designed for complex node editing (overkill)
- Performance issues reported at 600+ nodes
- Feature mismatch - we don't need graph/edge capabilities
- More complex API than needed for simple pan/zoom

### Additional libraries:
- `react-tweet` by Vercel for Twitter embeds (static rendering, no API needed, SSR compatible)
- `@unpic/react` for images (already in use)
- CSS Grid/masonry for list view (pattern from photography page)

---

## Fallback Plan: React Flow (If Needed)

**When to consider switching to React Flow:**
- react-zoom-pan-pinch doesn't provide enough control over interactions
- Need more sophisticated layout algorithms (auto-arrange nodes)
- Want to add relationships/connections between references
- Need built-in minimap or advanced controls
- User feedback indicates need for more features

### React Flow Migration Path

If we need to switch to React Flow later, the migration would be straightforward:

#### Step 1: Install React Flow
```bash
bun add @xyflow/react
```

#### Step 2: Replace CanvasView Component
**File**: `src/components/references/canvas-view.tsx`
```tsx
import { ReactFlow, Node, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Convert ReferenceItems to React Flow nodes
const referencesToNodes = (references: ReferenceItem[]): Node[] => {
  return references.map(ref => ({
    id: ref.id,
    type: ref.type, // Custom node type
    position: ref.position,
    data: ref, // Pass entire reference as data
    draggable: false,
  }));
};

export function CanvasView({ references }: { references: ReferenceItem[] }) {
  const nodes = referencesToNodes(references);

  return (
    <ReactFlow
      nodes={nodes}
      edges={[]} // No connections
      nodeTypes={nodeTypes} // Register custom node components
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={true}
      fitView
      minZoom={0.5}
      maxZoom={3}
    >
      <Background />
      <Controls />
    </ReactFlow>
  );
}
```

#### Step 3: Create Custom Node Types
```tsx
// src/components/references/canvas-view.tsx

import { NodeProps } from '@xyflow/react';
import { ReferenceCard } from './reference-card';

function ImageNode({ data }: NodeProps<ReferenceItem>) {
  return <ReferenceCard {...data} />;
}

function VideoNode({ data }: NodeProps<ReferenceItem>) {
  return <ReferenceCard {...data} />;
}

// ... similar for other types

const nodeTypes = {
  image: ImageNode,
  video: VideoNode,
  twitter: TwitterNode,
  website: WebsiteNode,
  note: NoteNode,
};
```

#### Step 4: Update Styling
- Add React Flow styles import
- Customize controls and background to match site theme
- Style nodes to match existing design

#### Migration Advantages:
- ReferenceCard component stays the same (no changes)
- Data structure stays the same (ReferenceItem type unchanged)
- List view completely unaffected
- Main wrapper component needs minimal changes

#### Migration Time Estimate:
- ~2-4 hours for basic migration
- Minimal risk since ReferenceCard is reusable

---

## Data Schema

### Reference Item Type
```typescript
type ReferenceType = 'image' | 'gif' | 'video' | 'website' | 'twitter' | 'note';

type ReferenceItem = {
  id: string;
  type: ReferenceType;
  position: { x: number; y: number }; // Canvas positioning

  // Common metadata
  title?: string;
  notes?: string;

  // Content URLs
  imageUrl?: string;      // For image/gif types
  videoUrl?: string;      // For video type
  embedUrl?: string;      // For website/twitter embeds

  // Attribution
  sourceLink?: string;    // Link back to original source
  author?: {
    name: string;
    url?: string;
  };

  // Display properties
  width?: number;         // Optional fixed width
  height?: number;        // Optional fixed height
};

type ReferenceCanvasProps = {
  references: ReferenceItem[];
  defaultView?: 'canvas' | 'list';
};
```

### Data Storage Strategy
**Recommended**: Centralized TypeScript file `src/lib/references.ts` (following pattern from `src/lib/data.ts`)

**Why this approach**:
- Follows existing codebase pattern (photography data in data.ts)
- Type-safe with TypeScript
- Can be shared across multiple designs
- Easier to maintain large collections
- Can export by design name or as a registry

**Alternative for small collections**: Inline MDX props

---

## Component Structure

### File Organization (Simplified)
```
src/components/references/
├── index.tsx              # Main wrapper (follows DesignViewer pattern)
├── canvas-view.tsx        # TransformWrapper + positioned cards
├── list-view.tsx          # Masonry grid (follows photography page)
└── reference-card.tsx     # Universal card component (handles all types)

src/lib/
├── references.ts          # Data + TypeScript types
└── reference-utils.ts     # Viewport culling, helpers

src/routes/api/
└── unfurl.ts             # Server function for website previews (optional Phase 3)
```

### Component Hierarchy (Simplified)
```
ReferenceCanvas (index.tsx)
├── View toggle buttons (top-right, like DesignViewer)
├── Theme toggle (optional, inherits from parent)
└── Conditional render:
    ├── CanvasView
    │   └── TransformWrapper (react-zoom-pan-pinch)
    │       └── TransformComponent
    │           └── Absolute positioned ReferenceCards
    └── ListView
        └── Masonry columns (CSS columns-2 sm:columns-3)
            └── ReferenceCards

ReferenceCard (universal component)
├── Renders based on type prop
├── Image type → @unpic/react Image
├── Video type → HTML5 video
├── Twitter type → react-tweet
├── Website type → Preview card or iframe
├── Note type → Styled text card
└── Common elements: title, author, source link
```

---

## Implementation Steps (Phased Approach)

### Phase 1: Core Structure & List View 🎯
**Goal**: Get basic functionality working quickly

#### 1.1 Install Dependencies
```bash
bun add react-zoom-pan-pinch
```

#### 1.2 Create Type Definitions
**File**: `src/lib/references.ts`
```typescript
export type ReferenceType = 'image' | 'gif' | 'video' | 'twitter' | 'website' | 'note';

export type ReferenceItem = {
  id: string;
  type: ReferenceType;
  position: { x: number; y: number }; // For canvas positioning

  // Common metadata
  title: string;
  notes?: string;

  // Type-specific data (discriminated union)
  data: ImageData | VideoData | TwitterData | WebsiteData | NoteData;

  // Attribution
  sourceUrl?: string;
  author?: { name: string; url?: string };
};

// Type-specific data interfaces
export type ImageData = { imageUrl: string; alt: string };
export type VideoData = { videoUrl: string; poster?: string };
// ... etc

// Example data export
export const designViewerReferences: ReferenceItem[] = [
  // ... example data
];
```

#### 1.3 Build Main Wrapper Component
**File**: `src/components/references/index.tsx`
- Follow DesignViewer pattern exactly
- State management for view mode ('canvas' | 'list')
- View toggle buttons (LayoutGrid and List icons from lucide-react)
- Theme integration (inherit from parent or manage internally)
- Top-right controls positioning
- Export as `ReferenceCanvas` for MDX

#### 1.4 Create Universal Reference Card
**File**: `src/components/references/reference-card.tsx`
- Single component that renders all reference types based on `type` prop
- Use switch/match pattern for type-specific rendering
- Common wrapper with: title, author link, source link button
- Tailwind styling matching site design
- Responsive sizing

#### 1.5 Implement List View (Masonry)
**File**: `src/components/references/list-view.tsx`
- Copy masonry pattern from `src/routes/photography.tsx`:
  ```tsx
  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
    {references.map(ref => <ReferenceCard key={ref.id} {...ref} />)}
  </div>
  ```
- Map through references and render ReferenceCard for each
- Simple, fast, works perfectly on mobile

#### 1.6 Register in MDX Components
**File**: `src/components/mdx-components.tsx`
```typescript
import { ReferenceCanvas } from "./references";

const components = {
  // ... existing components
  ReferenceCanvas,
};
```

#### 1.7 Create Example Data & Test in MDX
**File**: `src/lib/references.ts` (add example data)
**File**: `src/content/designs/01-design-viewer.mdx`
```mdx
import { designViewerReferences } from "@/lib/references";

## Design References

<ReferenceCanvas references={designViewerReferences} defaultView="list" />
```

**Test**: Verify list view works with image and note types

---

### Phase 2: Canvas View with Pan/Zoom 🎨
**Goal**: Add interactive canvas exploration

#### 2.1 Implement Canvas View
**File**: `src/components/references/canvas-view.tsx`
```tsx
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export function CanvasView({ references }: { references: ReferenceItem[] }) {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={3}
      limitToBounds={false}
      panning={{ velocityDisabled: false }}
      wheel={{ smoothStep: 0.01 }}
    >
      <TransformComponent>
        <div className="relative" style={{ width: '3000px', height: '2000px' }}>
          {references.map(ref => (
            <div
              key={ref.id}
              className="absolute"
              style={{ left: ref.position.x, top: ref.position.y }}
            >
              <ReferenceCard {...ref} />
            </div>
          ))}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
```

#### 2.2 Add Viewport Culling (Optional Performance)
**File**: `src/lib/reference-utils.ts`
- Create `useVisibleReferences` hook
- Calculate which items are in viewport based on transform state
- Only render visible items + buffer zone
- Only needed if 50+ references

#### 2.3 Update Example Data with Positions
Add `position: { x, y }` to example references in `src/lib/references.ts`

**Test**: Verify canvas view pan/zoom works on desktop and mobile

**Evaluation Point**:
- Does pan/zoom feel smooth?
- Are touch gestures working well on mobile?
- Do we need more control features?
- If issues arise, consider React Flow migration

---

### Phase 3: Rich Embeds (Twitter, Video, Website) 🎬
**Goal**: Add support for embedded content

#### 3.1 Add Twitter Support
```bash
bun add react-tweet
```

Update `ReferenceCard` to handle Twitter embeds:
```tsx
import { Tweet } from 'react-tweet';

case 'twitter':
  return <Tweet id={data.tweetId} />;
```

#### 3.2 Add Video Support
Update `ReferenceCard` for HTML5 video:
```tsx
case 'video':
  return (
    <video controls poster={data.poster} className="rounded-lg">
      <source src={data.videoUrl} />
    </video>
  );
```

#### 3.3 Add Website Preview (Optional)
**Option A**: Simple link preview card (no external API)
**Option B**: Server function to fetch metadata:

**File**: `src/routes/api/unfurl.tsx`
```tsx
export const unfurlUrl = createServerFn("POST")
  .validator(z.object({ url: z.string().url() }))
  .handler(async ({ data }) => {
    // Fetch and parse OG tags
    // Cache in Cloudflare KV
  });
```

---

### Phase 4: Polish & Optimization ✨
**Goal**: Production ready

#### 4.1 Loading States & Error Handling
- Skeleton loaders for embeds
- Image error fallbacks
- Retry mechanisms
- Timeout handling

#### 4.2 Accessibility Improvements
- Keyboard navigation (arrow keys in canvas)
- Focus management
- ARIA labels on all controls
- Alt text validation
- Reduced motion support

#### 4.3 Mobile Optimizations
- Larger touch targets
- Simplified mobile layout
- Consider list-only for very small screens
- Test on real devices

#### 4.4 Performance Monitoring
- Add Sentry performance tracking
- Lazy load embeds with IntersectionObserver
- Monitor bundle size
- Virtual scrolling if needed (50+ items)

---

## Key Design Patterns to Follow

### 1. DesignViewer Pattern (`src/components/design-viewer/index.tsx`)
- Theme state with `useState<"light" | "dark">`
- OKLCH color transitions
- Top-right control buttons with absolute positioning
- Non-invasive to children
- Clean, minimal API

### 2. Photography Masonry (`src/routes/photography.tsx`)
- CSS columns for responsive masonry
- `columns-1 sm:columns-2 lg:columns-3 xl:columns-4`
- Gradient background placeholders
- Lazy loading with `@unpic/react`

### 3. Data Structure (`src/lib/data.ts`)
- Centralized TypeScript file
- Strongly typed exports
- Separate data from components

---

## Critical Files

### Files to Create
1. `src/components/references/index.tsx` - Main wrapper
2. `src/components/references/canvas-view.tsx` - Pan/zoom canvas
3. `src/components/references/list-view.tsx` - Masonry grid
4. `src/components/references/reference-card.tsx` - Universal card
5. `src/lib/references.ts` - Types and data
6. `src/lib/reference-utils.ts` - Helper functions (Phase 2+)

### Files to Modify
1. `src/components/mdx-components.tsx` - Register ReferenceCanvas
2. `src/content/designs/01-design-viewer.mdx` - Add example usage

### Reference Files (Patterns to Follow)
1. `src/components/design-viewer/index.tsx` - Control pattern
2. `src/routes/photography.tsx` - Masonry layout
3. `src/lib/data.ts` - Data structure
4. `src/components/mdx-components.tsx` - MDX registration

---

## Dependencies

### Primary Approach
- **Phase 1**: `bun add react-zoom-pan-pinch`
- **Phase 3**: `bun add react-tweet` (optional)

### Fallback Approach (if needed)
- `bun add @xyflow/react`

---

## Success Criteria
✅ Fast initial load (list view works immediately)
✅ Smooth pan/zoom on desktop and mobile
✅ Supports all reference types (image, gif, video, twitter, website, note)
✅ View toggle works seamlessly
✅ Follows existing codebase patterns
✅ Accessible and mobile-friendly
✅ Type-safe with TypeScript

---

## Risks & Mitigations
| Risk | Mitigation |
|------|-----------|
| react-zoom-pan-pinch limitations | Have React Flow migration plan ready (2-4 hours) |
| Twitter embed rate limits | Use `react-tweet` (static rendering, no API) |
| Mobile performance issues | Viewport culling, lazy loading, list view fallback |
| Complex positioning for canvas | Start simple (grid layout), iterate based on feedback |
| Large bundle size | Only import react-zoom-pan-pinch initially, lazy load embeds |

---

## Decision Points & Evaluation

### After Phase 1
- ✅ Does list view work well?
- ✅ Is the component structure clean and maintainable?
- ✅ Are we following existing patterns correctly?

### After Phase 2
- ⚠️ **CRITICAL EVALUATION**: Is react-zoom-pan-pinch meeting our needs?
  - Is pan/zoom smooth and intuitive?
  - Do touch gestures work well on mobile?
  - Do we need more advanced features (minimap, controls)?
  - **If NO → Migrate to React Flow** (see Fallback Plan above)
  - **If YES → Continue with current approach**

### After Phase 3
- ✅ Are all embed types working?
- ✅ Is performance acceptable with real content?
- ✅ Does it work across all target devices?

---

## Future Enhancements (Out of Scope)
- Filtering by reference type
- Search functionality
- Admin UI for visual editing
- Auto-layout for canvas items (would require React Flow)
- Grouping/categories
- Zoom to specific reference from list
- Export/share functionality
- Connections/relationships between references (would require React Flow)

---

## Notes

**Last Updated**: 2025-12-16

**Recommended Approach**: Start with react-zoom-pan-pinch for simplicity and performance. The architecture is designed to make a potential React Flow migration straightforward if needed. The ReferenceCard component is intentionally decoupled from the canvas implementation, making library swaps low-risk.

# ElevateBusiness 360° - TODO

### **COMPLETED DESIGN DECISIONS:**

✅ **1. WO Tab CTA Configuration** - **RESOLVED**
   - **Decision**: Hide CTA for WO Tab (exception case usage principle)
   - **Implementation**: Updated CTA_CONFIG to `wo: { showCTA: false }`
   - **Rationale**: WO creation is typically automatic from Sales Orders, manual creation is rare
   - **Alternative**: Individual WO actions available on each card (Start, Update, Complete, Pause/Resume)

✅ **2. Machine Tab MVP Decision** - **COMPLETED**
   - **Decision**: Machine Tab NOT required for MVP
   - **Documentation**: Added comprehensive design decision to VISUAL_DESIGN_SPECIFICATION.md
   - **Implementation**: Complete removal of Machine Tab from Production module
   - **Technical**: Updated Production.tsx and WorkOrderPlanning.tsx to remove machine dependencies
   - **Rationale**: MSME scale (3-4 machines) doesn't justify digital complexity
   - **Alternative**: Machine-based filtering in WO Tab provides needed visibility
   - **Future**: Customer-demand driven approach for post-MVP consideration

### **PENDING TASKS:**

🔄 **3. Terminology Standardization** - **NEW REQUIREMENT**
   - **Task**: Update all documentation to use "WO" instead of "W.O."
   - **Scope**: All documents, code comments, and UI labels
   - **Impact**: Consistency across codebase and documentation

🔄 **4. QC Tab Implementation** - **COMPREHENSIVE PLAN DEFINED**

#### **4.1 ARCHITECTURAL DECISIONS**

✅ **Universal QC Requirement**
   - **Decision**: ALL Work Orders require QC inspection (no exceptions)
   - **Scope**: Weaving, Dyeing, Finishing - every production stage gets QC
   - **Business Logic**: Every completed WO → QC Tab → QC Inspection → Next stage
   - **Rationale**: Quality control at every production step ensures consistent standards

✅ **Modal vs Expanded View Pattern**
   - **Decision**: Actions use modals, Information uses expanded views
   - **Rationale**: Actions require focus (eliminate distractions), Information allows context
   - **Implementation**: QC Inspection → Modal | QC Details → Expanded View
   - **Cross-Platform**: Apply pattern to all action workflows system-wide

✅ **Work Order-Centric Data Architecture**
   - **Decision**: QC Tab shows Work Orders with QC context (not QC items directly)
   - **Data Model**: 1 Work Order → 1 QC Item (separate entities, foreign key relationship)
   - **Visual Focus**: Work Order information prominence with QC status overlay
   - **Business Logic**: QC workflow operates on Work Orders, creates/updates QC Items

✅ **Simplified Card Structure**
   - **Pattern**: Header → Status → Meta → Single Action (simplified from Work Order multi-actions)
   - **Header**: `WO#451 — Gujarat Garments | Loom A1` (Work Order context)
   - **Status**: `⏳ Pending QC • High Priority` (QC status + priority)
   - **Meta**: `1000m • Mixed fabric` + `Completed: 22 Dec, 2:30 PM`
   - **Action**: `[Start QC]` (single action button) + `[More]` (expand indicator)
   - **IMPORTANT**: No multiple action buttons - only Start QC on card surface

#### **4.2 DATA STRUCTURE REQUIREMENTS**

**Enhanced QC Item Interface:**
```typescript
interface QCItem {
  id: string;                    // QC#301
  workOrderId: string;           // WO#451 (1:1 mapping)
  status: 'pending_inspection' | 'in_progress' | 'approved' | 'rejected';
  inspector?: string;            // Ravi Sharma
  grade?: 'A Grade' | 'B Grade' | 'C Grade' | 'Reject';
  notes?: string;               // QC inspection notes
  photos?: string[];            // Photo evidence
  checklist?: QCChecklistItem[];// Quality checklist results
  startedTime?: string;         // When QC inspection started
  completedTime?: string;       // When QC completed
  priority: 'normal' | 'high' | 'urgent';
  
  // QC-specific quality specifications
  qualitySpecs: {
    targetGrade: string;         // A Grade
    colorCode: string;           // Pantone 19-4052
    gsmTarget: string;           // 180 ± 5
    widthTarget: string;         // 58" ± 0.5"
    shrinkageLimit: string;      // <3%
  };
  specialInstructions?: string[];
}
```

**Universal QC Logic:**
```typescript
// Display ALL completed work orders requiring QC inspection
const qcWorkOrders = useMemo(() => {
  const completedWOs = workOrders.filter(wo => wo.status === 'completed');
  return completedWOs.map(wo => ({
    workOrder: wo,
    qcItem: qcItems.find(qc => qc.workOrderId === wo.id)
  }));
}, [workOrders, qcItems]);

// ALL completed WOs require QC - no exceptions
// Works for all production stages: weaving, dyeing, finishing
```

#### **4.3 VISUAL DESIGN SPECIFICATION COMPLIANCE**

**QC Tab Display (184px height with actions - Global Design System):**
```
🔎 COMPLETED WORK ORDERS

┌─────────────────────────────────────┐
│ WO#451 — Gujarat Garments | Loom A1 │ ← Header (Work Order context)
│ ⏳ Pending QC • High Priority       │ ← Status (QC status + priority)
│ 1000m • Mixed fabric                │ ← Meta (quantity + product)
│ Completed: 22 Dec, 2:30 PM          │ ← Meta (completion timing)
│ [Start QC]                  [More]  │ ← Single Action + Expand
└─────────────────────────────────────┘ ← 184px height (140px + 44px actions)
```

**IMPORTANT UPDATES**: 
- **Height**: 184px (140px base + 44px actions) using `ds-card-with-actions` class
- Changed header from "QC QUEUE" to "COMPLETED WORK ORDERS" (reflects universal QC requirement)
- Single action button "Start QC" only (no multiple actions like Work Order cards)
- ALL completed WOs appear here regardless of production stage (weaving, dyeing, finishing)

**QC Form Modal (Visual Design Spec Exact):**
```
┌─────────────────────────────────────┐
│ QC Inspection — WO#451          [×] │ Modal header + close
│ Gujarat Garments | Mixed fabric     │ Context details
├─────────────────────────────────────┤
│ ✅ QUALITY CHECKLIST                │ Section 1 (32px items)
│ Color match: [✓] GSM: [✓]          │ Interactive checkboxes
│ Width specs: [✓] Defects: [0]      │ Input field for counts
├─────────────────────────────────────┤
│ 📷 PHOTO EVIDENCE                   │ Section 2 (44px button)
│ [📷 Capture]                        │ Photo capture interface
├─────────────────────────────────────┤
│ 📝 QC REMARKS                       │ Section 3 (60px textarea)
│ ┌─────────────────────────────────┐ │
│ │ Enter inspection notes...       │ │ Quality observation notes
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 🎯 QC RESULT                        │ Section 4 (56px buttons)
│ Grade: [A Grade ▼]                  │ Quality grade selection
│ [    ✅ Pass    ] [  ⚠️ Rework   ] │ Final decision buttons
└─────────────────────────────────────┘
```

#### **4.4 EXPANDED VIEW CONTENT**

**Before QC (Pending) - QC-Focused Information:**
```
├─────────────────────────────────────┤
│ 🎯 Quality Specifications           │
│ Target Grade: A Grade               │
│ Color: Blue (Pantone 19-4052)       │
│ GSM Target: 180 ± 5                 │
│ Width: 58" ± 0.5"                   │
│ Shrinkage Limit: <3%                │
├─────────────────────────────────────┤
│ 📋 QC Checklist Preview             │
│ □ Color match verification          │
│ □ GSM weight check                  │
│ □ Width measurement                 │
│ □ Shrinkage test                    │
│ □ Surface defect inspection         │
├─────────────────────────────────────┤
│ 📦 Batch Information                │
│ Batch: B2025-045                    │
│ Raw Material: Cotton Yarn 30s       │
│ Dye Lot: DL-2024-089               │
│ Production: 20-22 Dec 2024          │
├─────────────────────────────────────┤
│ ⚠️ Special Instructions             │
│ • Customer requires strict color match│
│ • Photo documentation mandatory     │
│ • Rush order - complete within 2hrs │
└─────────────────────────────────────┘
```

**After QC (Completed) - QC Results:**
```
├─────────────────────────────────────┤
│ ✅ QC Results                       │
│ Grade: A Grade (Premium)            │
│ Inspector: Ravi Sharma              │
│ Completed: 22 Dec, 3:45 PM          │
│ Duration: 1 hour 15 minutes         │
├─────────────────────────────────────┤
│ ✅ Quality Checklist Results        │
│ ☑️ Color match within tolerance     │
│ ☑️ Width specifications met         │
│ ☑️ Weight/GSM correct               │
│ ☑️ Shrinkage test passed            │
│ ☑️ No visible defects               │
│ Score: 5/5 passed                   │
├─────────────────────────────────────┤
│ 📝 QC Notes                         │
│ "Excellent quality batch. Color     │
│ consistency perfect. Meets all      │
│ customer specifications."           │
├─────────────────────────────────────┤
│ 📷 Quality Evidence                 │
│ [Photo 1] [Photo 2] [Photo 3]       │
│ 3 photos captured                   │
└─────────────────────────────────────┘
```

#### **4.5 IMPLEMENTATION PHASES**

**✅ Phase 1: Mock Data Enhancement** - **COMPLETED**
   - **Task**: Update `mockQCItems` with proper Work Order mapping
   - **Requirements**: Add quality specifications, special instructions, batch info
   - **Data Integrity**: Ensure 1:1 Work Order → QC Item relationship
   - **Test Data**: Create QC items for completed Work Orders (WO#451, WO#452, etc.)

**✅ Phase 2: QC Component Architecture** - **COMPLETED**
   - **File**: `QualityControlManagement.tsx` (complete rewrite from scratch)
   - **Pattern**: Work Order-centric display with QC Item context
   - **State Management**: Modal state + card expansion state
   - **Data Integration**: Combine Work Orders with QC Items for display

**🔄 Phase 3: QC Card Implementation** - **NEEDS MAJOR UPDATES**
   - **❌ Wrong Header**: Shows "🔎 QC QUEUE" - should be "🔎 COMPLETED WORK ORDERS"
   - **❌ Missing Actions Class**: Using `ds-card` only - needs `ds-card ds-card-with-actions`
   - **❌ Action Button Location**: Action button in expanded view - should be on card surface
   - **❌ Wrong Height**: Using 140px - needs 184px with actions
   - **✅ Global Classes**: Correctly using `ds-card-header`, `ds-card-status`, `ds-card-meta`
   - **✅ JSX Pattern**: Using `ds-card-container` and `data-card-id` correctly
   - **✅ Expansion**: Using global `.ds-expanded-details` classes correctly

**🔄 Phase 4: QC Form Modal** - **PLACEHOLDER ONLY**
   - **✅ Basic Modal**: Modal overlay and header structure implemented
   - **❌ QC Form**: Only placeholder text "QC Form will be implemented in next task..."
   - **❌ 4-Section Layout**: NOT implemented - needs Quality Checklist, Photo Evidence, QC Remarks, QC Result
   - **❌ Measurements**: No 32px/44px/56px/60px element heights per spec
   - **❌ Real Workflow**: Only test button, no actual QC inspection form

**✅ Phase 5: CSS Implementation** - **PARTIALLY COMPLETED**
   - **File**: `QualityControlManagement.module.css` (rewritten for global design system)
   - **Design System**: 100% design token usage (zero hardcoded values)
   - **Global Cards**: NO custom card CSS (use global ds-card system from index.css)
   - **CRITICAL**: Remove all `.qcCard`, `.cardHeader`, `.cardStatus`, `.cardMeta` custom styling
   - **Reference Comment**: Add `/* Card styles handled by global .ds-card system */`
   - **Component-Specific Only**: Modal overlay, expanded content sections, action button layout
   - **Mobile**: Container padding removal pattern (`padding-left: 0; padding-right: 0;` at max-width: 767px)
   - **Missing**: QC modal CSS needs implementation

#### **4.6 CURRENT STATUS SUMMARY**

**✅ COMPLETED (Working Code)**
- ✅ Mock data with QC Items and Work Order mapping
- ✅ Basic QC component architecture with global design system classes
- ✅ Expanded view with QC specifications and results rendering
- ✅ CSS with design system tokens and mobile patterns
- ✅ Modal overlay structure and basic state management

**🔄 CRITICAL ISSUES TO FIX**
1. **Header Text**: "🔎 QC QUEUE" → "🔎 COMPLETED WORK ORDERS"
2. **Card Class**: `ds-card` → `ds-card ds-card-with-actions` (for 184px height)
3. **Action Button**: Move from expanded view to card surface with `ds-card-actions`
4. **QC Form**: Replace placeholder with 4-section Visual Design Spec layout
5. **Variable Rename**: `qcQueue` → `qcWorkOrders` (consistent with universal QC)

**❌ NOT IMPLEMENTED**
- ❌ Real QC inspection form (4 sections with exact measurements)
- ❌ Surface-level action buttons (currently only in expanded view)
- ❌ Proper 184px card height with actions

#### **4.7 TECHNICAL SPECIFICATIONS**

**Component State Management:**
```typescript
const [workOrders, setWorkOrders] = useState<WorkOrder[]>();
const [qcItems, setQcItems] = useState<QCItem[]>();
const [activeQCForm, setActiveQCForm] = useState<string | null>(null);
const { toggleExpansion, isExpanded } = useCardExpansion();
```

**QC Workflow Functions:**
```typescript
const startQC = (workOrderId: string) => {
  // Create QC item if doesn't exist
  // Update QC status to 'in_progress'
  // Open modal form
};

const completeQC = (workOrderId: string, result: QCResult) => {
  // Update QC item with results
  // Update status to 'approved' or 'rejected'
  // Close modal
  // Handle cross-module workflow (Ready tab or rework)
};
```

**Filter Integration (Universal QC):**
```typescript
// ALL completed Work Orders shown - filter by QC status only
switch (filterState) {
  case 'pending_inspection': return qcWorkOrders.filter(({ qcItem }) => 
    !qcItem || qcItem.status === 'pending_inspection'
  );
  case 'in_progress': return qcWorkOrders.filter(({ qcItem }) => 
    qcItem?.status === 'in_progress'
  );
  case 'approved': return qcWorkOrders.filter(({ qcItem }) => 
    qcItem?.status === 'approved'
  );
  case 'rejected': return qcWorkOrders.filter(({ qcItem }) => 
    qcItem?.status === 'rejected'
  );
  default: return qcWorkOrders; // Show ALL completed WOs by default
}
```

#### **4.7 SUCCESS CRITERIA**

**Visual Design Specification Compliance:**
   - ✅ Work Order-centric display (not QC items as primary focus)
   - ✅ Universal QC requirement (ALL completed WOs require inspection)
   - ✅ 184px card height with actions (140px base + 44px actions using `ds-card-with-actions`)
   - ✅ "🔎 COMPLETED WORK ORDERS" section header (updated from "QC QUEUE")
   - ✅ Single action button pattern (Start QC only on card surface)
   - ✅ 4-section QC modal form with exact measurements
   - ✅ Element heights: 32px checklist, 44px photo, 56px result, 60px textarea

**Architecture Standards:**
   - ✅ Global card system integration (ds-card classes)
   - ✅ Design system token usage (100%, zero hardcoded values)
   - ✅ Mobile container padding removal
   - ✅ Modal for actions, expanded view for information pattern
   - ✅ Consistent card structure across all production components

**Business Workflow:**
   - ✅ Universal QC requirement (ALL Work Orders require QC inspection)
   - ✅ Single action workflow (Start QC button → Modal → Pass/Fail decision)
   - ✅ QC-focused information in expanded view (no action buttons inside)
   - ✅ Complete QC inspection workflow (start → inspect → pass/rework)
   - ✅ Cross-module integration (QC pass → Ready tab, QC fail → rework WO)
   - ✅ Quality documentation system (grades, notes, photos, checklists)

**Data Architecture:**
   - ✅ Proper Work Order ↔ QC Item relationship (1:1 mapping)
   - ✅ QC-specific data structure (quality specs, instructions, evidence)
   - ✅ Mock data enhancement for realistic QC workflow testing
   - ✅ Filter system integration for QC status-based filtering

#### **4.8 IMPLEMENTATION NOTES**

**Critical Requirements:**
   - **Universal QC**: ALL completed Work Orders require QC inspection (no exceptions)
   - **Single Action**: ONLY "Start QC" button on card surface (no multiple actions)
   - **QC Tab Layout**: Show Work Orders (with QC context), NOT QC items directly
   - **Modal Design**: Must match Visual Design Specification exactly (4 sections, measurements)
   - **Card Structure**: Simplified from Work Order cards (140px height, global classes, single action)
   - **Global Classes**: MUST use global `.ds-card` system from index.css - NO custom card CSS allowed
   - **Expanded View**: QC-relevant information only (NO action buttons inside expanded view)
   - **JSX Pattern**: Follow exact Work Order pattern with `ds-card-container` and `data-card-id`

**Mandatory Global Classes (From Component Design Patterns):**
   - `.ds-card-container` - Card wrapper with `data-card-id` attribute
   - `.ds-card` - Main card with 140px height (replaces custom `.qcCard`)
   - `.ds-card-header` - Header section (replaces custom `.cardHeader`)
   - `.ds-card-status` - Status section (replaces custom `.cardStatus`)
   - `.ds-card-meta` - Meta information section (replaces custom `.cardMeta`)
   - `.ds-card-expand-indicator` - More/Less button (replaces custom expand button)
   - `.ds-expanded-details` - Expanded content wrapper
   - `.ds-details-content` - Expanded content section

**Global Status Classes for QC:**
   - `ds-card-status-active` - QC approved (green border)
   - `ds-card-status-pending` - QC pending/in-progress (amber border)
   - `ds-card-status-inactive` - QC rejected (gray border)
   - `ds-card-priority-high` - Urgent QC (red/orange border)

**Architecture Decisions:**
   - Actions (QC inspection) → Modal interface (focus and completion enforcement)
   - Information (QC details) → Expanded view (context preservation)
   - Work Order prominence → Display Work Order information as primary, QC as overlay
   - Design system compliance → Zero custom card CSS, 100% design tokens
   - Global card system → Mandatory usage as per Component Design Patterns document

**Implementation Reference:**
   - **Base Pattern**: Purchase Request example from Component Design Patterns
   - **JSX Structure**: Copy exact `ds-card-container` → `ds-card` → global classes pattern
   - **Status Mapping**: Use global status classes for QC states
   - **CSS Scope**: Only modal, expanded content, action buttons - NO card styling

**Cross-Module Integration:**
   - QC Pass → Work Order eligible for Ready tab (dispatch preparation)
   - QC Fail → Create rework Work Order, return to WO tab for reassignment  
   - QC In Progress → Work Order remains in QC queue with progress visibility
   - Filter synchronization → QC status filters align with overall production workflow

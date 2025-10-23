# ElevateBusiness 360° - TODO

### **ROUGH NOTE:**

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

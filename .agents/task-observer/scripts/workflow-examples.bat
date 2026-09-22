# task-observer Scripts — Task Workflow Examples

; ================================
; Example: Multi-step Task Tracking
; ================================

; Task: Audit and optimize OTServer code
task_observer_start("Audit OTServer C++ code for smart pointers and concurrency")

; Step 1: Analyze code
task_step_start(1, "Analyze C++ files for raw pointers")
; ... analysis code ...
task_step_complete(1)

; Step 2: Identify concurrency issues
task_step_start(2, "Identify data races and lock patterns")
; ... concurrency analysis ...
task_step_complete(2)

; Step 3: Apply optimizations
task_step_start(3, "Apply smart pointers and scoped_lock patterns")
; ... optimization code ...
task_step_complete(3)

; Task complete
task_observer_complete()
task_generate_summary()

; ================================
; Example: Skill Improvement Capture
; ================================

; When user corrects or improves approach:
task_capture_correction(
    "User suggested std::scoped_lock instead of manual lock/unlock",
    "cpp_smart_pointers_optimization"
)

; When new pattern discovered:
task_record_pattern(
    "table.create(n) improves Lua table performance 40%",
    "lua_optimization_pattern"
)

; When following up needed:
task_add_followup(
    "Refactor remaining C++ modules with same patterns",
    "priority: high"
)
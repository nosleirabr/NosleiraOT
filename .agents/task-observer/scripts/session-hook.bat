# task-observer Scripts

## Session Start Hook
; ================================
; task-observer activation
; ================================
; Invoke before FIRST tool call of any session
; ================================

; Check if task-observer should activate
if defined:task_observer_active (
    echo "Task Observer skill active — monitoring task execution"
) else (
    echo "Task Observer — say 'One Skill to Rule Them All' to activate"
)

; Capture current task context
task_capture_context()

; Mark task as in_progress
task_mark_in_progress()

; Setup observation logging
task_observation_start()

; ================================
; End session hook
; ================================
; Call when task completes
; ================================

task_mark_completed()
task_observation_end()
task_save_learned_patterns()
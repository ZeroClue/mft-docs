(module
  ;; Host function provided by the MFTPlus runtime (module "mft")
  (import "mft" "log" (func $log (param i32 i32) (result i32)))

  ;; Plugins must export linear memory so the host can read/write strings
  (memory (export "memory") 1)

  ;; Message written to the agent log on init
  (data (i32.const 0) "hello from mftplus plugin\00")

  ;; Hook invoked by the loader when the plugin is initialized.
  ;; Returns the host function result (0 = success).
  (func (export "on_init") (result i32)
    i32.const 0           ;; pointer to message
    i32.const 25          ;; length of message
    call $log
  )
)

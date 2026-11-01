# Dependency compatibility patches

`motion-v@1.10.3.patch` keeps layout projection's optional presence callback optional in both ESM and CommonJS. The upstream default presence context is an empty object; an unowned shared-layout node can otherwise call an absent `onMotionExitComplete` while measuring a document transition or responsive layout.

Registered callbacks receive the same arguments. Layout, springs, component APIs and existing copyright/license notices remain unchanged. The dependency remains Motion for Vue 1.10.3 under its original MIT license. Revisit this patch when upgrading that dependency.

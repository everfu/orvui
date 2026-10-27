// Vue public prop types, derived from the actual components.
export type VoiceOrbProps = InstanceType<
  (typeof import("./VoiceOrb.vue"))["default"]
>["$props"];

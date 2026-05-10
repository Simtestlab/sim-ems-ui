export type TelemetryState = {
  lastUpdated?: string
}

const state: TelemetryState = {}

export default function getTelemetryStore() {
  return {
    get: () => state,
    set: (patch: Partial<TelemetryState>) => Object.assign(state, patch),
  }
}

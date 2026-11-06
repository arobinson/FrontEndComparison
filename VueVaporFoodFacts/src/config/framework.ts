import type { InjectionKey } from 'vue';

// Id of this app in shared-types' FRAMEWORKS. Provided app-wide in main.ts, so main.ts stays
// the only file that differs between the Vue and Vue Vapor apps.
export const currentFrameworkKey: InjectionKey<string> = Symbol('currentFramework');

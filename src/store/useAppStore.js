import { create } from "zustand";

export const useAppStore = create((set) => ({
  // Bot simulator modal
  activeBotId: null,
  openBotDemo: (botId) => set({ activeBotId: botId }),
  closeBotDemo: () => set({ activeBotId: null }),

  // Project detail modal
  activeProjectId: null,
  openProjectDetail: (projectId) => set({ activeProjectId: projectId }),
  closeProjectDetail: () => set({ activeProjectId: null }),

  // Cost estimator / configurator selections
  configurator: {
    step: 1,
    projectType: null,
    features: [],
    timeline: null,
  },
  setConfiguratorType: (projectType) =>
    set((state) => ({ configurator: { ...state.configurator, projectType, step: 2 } })),
  toggleConfiguratorFeature: (featureId) =>
    set((state) => {
      const has = state.configurator.features.includes(featureId);
      const features = has
        ? state.configurator.features.filter((id) => id !== featureId)
        : [...state.configurator.features, featureId];
      return { configurator: { ...state.configurator, features } };
    }),
  setConfiguratorTimeline: (timeline) =>
    set((state) => ({ configurator: { ...state.configurator, timeline, step: 4 } })),
  setConfiguratorStep: (step) => set((state) => ({ configurator: { ...state.configurator, step } })),
  resetConfigurator: () =>
    set({ configurator: { step: 1, projectType: null, features: [], timeline: null } }),
}));

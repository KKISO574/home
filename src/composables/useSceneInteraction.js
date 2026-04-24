import { computed, ref } from "vue";

const scene = ref("hero");
const activeTarget = ref("");

const sceneNames = {
  hero: "Celia",
  live: "Today",
  links: "Links",
  music: "Music",
  contact: "Contact",
};

const sceneActions = {
  hero: "Home",
  live: "Now",
  links: "Open",
  music: "Play",
  contact: "Profile",
};

export const useSceneInteraction = () => {
  const setScene = (value, target = "") => {
    if (!sceneNames[value]) return;
    scene.value = value;
    activeTarget.value = target;
  };

  const setActiveTarget = (target = "") => {
    activeTarget.value = target;
  };

  const clearActiveTarget = () => {
    activeTarget.value = "";
  };

  const sceneTitle = computed(() => activeTarget.value || sceneNames[scene.value]);
  const sceneAction = computed(() => sceneActions[scene.value]);

  return {
    scene,
    activeTarget,
    sceneTitle,
    sceneAction,
    setScene,
    setActiveTarget,
    clearActiveTarget,
  };
};

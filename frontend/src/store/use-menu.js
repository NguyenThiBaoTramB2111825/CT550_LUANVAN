import { defineStore } from "pinia";
export const useMenu = defineStore('menu', {
  state: () => ({
    isMenuVisible: true
  }),
  actions: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
     }
  }
})
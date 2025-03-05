import { defineStore } from "pinia";
export const useMenu = defineStore("menu", {
  state: () => {
        return {
            isMenuOpen: false,
            isAdminOpne: false,
    //   selectedKeys: [],
    //   openKeys: [],
    };
  },
    actions: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        toggleAdmin() {
            this.isAdminOpen = !this.isAdminOpen
        },
        closeAll() {
            this.isMenuOpen = false;
            this.isAdminO = false;
        }
  },
});

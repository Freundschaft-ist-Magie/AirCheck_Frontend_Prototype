import { defineStore } from "pinia";

export const useToastStore = defineStore("toast", {
  state: () => ({
    message: "",
    show: false,
    color: "light",
  }),
  actions: {
    setToast(message: string, color: string = "light") {
      this.message = message;
      this.show = true;
      this.color = color;
    },
    hideToast() {
      this.message = "";
      this.show = false;
    }
  }
});

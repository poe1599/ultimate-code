import { useStorage } from "@vueuse/core";

export default useStorage<{code:number,range:[number,number],newCode:number| null}>('gameStore', { code: 0, range:[0,0], newCode:0 });


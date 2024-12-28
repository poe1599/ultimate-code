import { useStorage } from "@vueuse/core";

interface GameStoreType {
  code:number,
  range:[number,number],
  newCode:number| null
  gameMode: 'single-elimination'|'normal'
}

export default useStorage<GameStoreType>('gameStore', { 
  code: 0,
  range: [0,0],
  newCode: 0,
  gameMode: 'normal'
});


import { useStorage } from "@vueuse/core";

interface PlayerType {
  name: string,
  id: string
  color: string
}

interface GameStoreType {
  code:number,
  range:[number,number],
  newCode:number| null
  gameMode: 'single-elimination'|'normal'
  players: PlayerType[]
  survivePlayers: PlayerType[]
  playerColors: string[]
}

export default useStorage<GameStoreType>('gameStore', { 
  code: 0,
  range: [0,0],
  newCode: 0,
  gameMode: 'normal',
  players: [],
  survivePlayers: [],
  playerColors: [
    '--p-green-400',
    '--p-lime-400',
    '--p-red-400',
    '--p-cyan-300',
    '--p-blue-600',
    '--p-violet-300',
    '--p-zinc-200',
    '--p-yellow-200',
    '--p-teal-100',
  ]
});


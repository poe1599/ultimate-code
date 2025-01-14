/*
 * @Author: Allen Yeh poe1599@gmail.com
 * @Date: 2024-12-30 00:06:00
 * @LastEditors: Allen Yeh poe1599@gmail.com
 * @LastEditTime: 2025-01-14 23:34:28
 * @FilePath: \ultimate-code\src\stores\gameStore.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useStorage } from '@vueuse/core'

interface PlayerType {
  name: string
  id: string
  color: string
  avatar: string
}

interface GameStoreType {
  code: number
  range: [number, number]
  newCode: number | null
  gameMode: 'single-elimination' | 'normal'
  players: PlayerType[]
  survivePlayers: PlayerType[]
  playerColors: string[]
  playerAvatars: string[]
}

export default useStorage<GameStoreType>('gameStore', {
  code: 0,
  range: [0, 0],
  newCode: null,
  gameMode: 'single-elimination',
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
  ],
  playerAvatars: [
    '/imgs/01.jpg',
    '/imgs/02.jpg',
    '/imgs/03.jpg',
    '/imgs/04.jpg',
    '/imgs/05.jpg',
    '/imgs/06.jpg',
    '/imgs/07.jpg',
    '/imgs/08.jpg',
  ],
})

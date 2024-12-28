/*
 * @Author: Allen Yeh poe1599@gmail.com
 * @Date: 2024-12-28 19:42:31
 * @LastEditors: Allen Yeh poe1599@gmail.com
 * @LastEditTime: 2024-12-28 20:36:55
 * @FilePath: \ultimate-code\src\utils\ultimateCode.ts
 * @Description: 終極密碼遊戲的工具函數
 */

export const ULTIMATE_CODE_RANGE_MIN = 0

export const ULTIMATE_CODE_RANGE_MAX = 100

export const getRandomCode = (min:number,max:number):number => Math.floor(Math.random() * (max - min + 1)) + min

export const getNewCodeRange = (code:number, range:[number,number] , newCode:number):[number,number] => {
  const list =[...new Set([code,...range,newCode])].sort((a,b)=>a-b)
  const index = list.indexOf(code)
  return [list[index-1],list[index+1]]
}
import applyType from "./applyType"
import { ClipmanOptionType } from "../types"

test('it should cast string to string', () => {
  expect(applyType(ClipmanOptionType.string, '12')).toEqual('12')
})

test('it should cast string to number', () => {
  expect(applyType(ClipmanOptionType.number, '12')).toEqual(12)
})

test('it should cast string to boolean', () => {
  expect(applyType(ClipmanOptionType.boolean, 'true')).toEqual(true)
})
import * as castr from 'castr'
import { ClipmanOptionType, ClipmanOptionValue } from "../types"

export default function applyType(type: ClipmanOptionType.string, value: any): string

export default function applyType(type: ClipmanOptionType.number, value: any): number

export default function applyType(type: ClipmanOptionType.boolean, value: any): boolean

export default function applyType(type: ClipmanOptionType, value: any): any {
  switch (type) {
    case ClipmanOptionType.string: return castr.toString(value)
    case ClipmanOptionType.boolean: return castr.toBoolean(value)
    case ClipmanOptionType.number: return castr.toNumber(value)
    default: return castr.toString(value)
  }
}

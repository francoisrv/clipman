import * as castr from 'castr'
import { ClipmanOptionType, ClipmanOptionValue } from "../types"

export default function applyType(type: ClipmanOptionType.string, value: any): string

export default function applyType(type: ClipmanOptionType.number, value: any): number

export default function applyType(type: ClipmanOptionType.boolean, value: any): boolean

export default function applyType(type: ClipmanOptionType.object, value: any): object

export default function applyType(type: ClipmanOptionType, value: any): any {
  switch (type) {
    case ClipmanOptionType.string: return castr.toString(value)
    case ClipmanOptionType.boolean: return castr.toBoolean(value)
    case ClipmanOptionType.number: return castr.toNumber(value)
    case ClipmanOptionType.object: return castr.toObject(value)
    case ClipmanOptionType.array: return castr.toArray(value)
  }
}

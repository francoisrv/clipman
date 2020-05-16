import { Dictionary } from 'lodash'
import * as castr from 'castr'

export interface ClipmanOptions {
  help?: boolean
}

export interface ClipmanCommandInfo {
  arguments: string[]
}

export interface ClipmanResults {
  entry: string
  options: any
  arguments: string[]
  response: any
  error?: {
    message: string
    stack: string
  }
}

export type ClipmanInputOptions = Dictionary<
  | string
  | number
  | boolean
  | ClipmanInputOptions
>

export interface ClipmanOptionSchema {

}

export enum ClipmanOptionType {
  string = 'string',
  boolean = 'boolean',
  number = 'number',
  object = 'object',
  array = 'array',
}

export type ClipmanOptionValue =
| string
| number
| boolean

export type ClipmanDefaultOption  =
| {
  value: ClipmanOptionValue
  useTemplate?: boolean
}
| {
  command: string
  useTemplate?: boolean
}
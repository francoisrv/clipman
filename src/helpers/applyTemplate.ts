import { templateSettings, template } from "lodash";

templateSettings.interpolate = /{{([\s\S]+?)}}/g;

export default function applyTemplate(str: string, vars: any) {
  return template(str)(vars)
}
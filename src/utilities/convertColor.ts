import { ColorRgba } from "../../types/valueTypes"
import roundWithDecimals from "./roundWithDecimals"
import { tinycolor } from "@ctrl/tinycolor"

export const roundRgba = (
  rgba: {
    r: number
    g: number
    b: number
    a?: number
  },
  opacity?: number
): ColorRgba => ({
  r: roundWithDecimals(rgba.r * 255, 0) || 0,
  g: roundWithDecimals(rgba.g * 255, 0) || 0,
  b: roundWithDecimals(rgba.b * 255, 0) || 0,
  a: roundWithDecimals(opacity ?? rgba.a ?? 1) || 0,
})

export const convertPaintToRgba = (paint: Paint): ColorRgba => {
  if (paint.type === "SOLID" && paint.visible === true) {
    return roundRgba(paint.color, paint.opacity)
  }
  return {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  }
}

export const convertRgbaObjectToString = (rgbaObject: ColorRgba): string =>
  `rgba(${rgbaObject.r}, ${rgbaObject.g}, ${rgbaObject.b}, ${rgbaObject.a})`

export const rgbaObjectToHex8 = (rgbaObject: ColorRgba): string => {
  // return value
  return tinycolor(convertRgbaObjectToString(rgbaObject)).toHex8String()
}

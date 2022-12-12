import { effectPropertyInterface } from "../../types/propertyObject"
import { EffectType, UnitTypePixel, PropertyType } from "../../types/valueTypes"
import { roundRgba } from "../utilities/convertColor"

const effectType = {
  LAYER_BLUR: "layerBlur",
  BACKGROUND_BLUR: "backgroundBlur",
  DROP_SHADOW: "dropShadow",
  INNER_SHADOW: "innerShadow",
}

const blurValues = (effect: BlurEffect) => ({
  effectType: {
    value: effectType[effect.type] as EffectType,
    type: "string" as PropertyType,
  },
  radius: {
    value: effect.radius,
    unit: "pixel" as UnitTypePixel,
    type: "number" as PropertyType,
  },
})

const shadowValues = (effect: Effect) => ({
  effectType: {
    value: effectType[effect.type] as EffectType,
    type: "string" as PropertyType,
  },
  radius: {
    value: effect.radius,
    unit: "pixel" as UnitTypePixel,
    type: "number" as PropertyType,
  },
  color: {
    value: roundRgba(effect.color),
    type: "color" as PropertyType,
  },
  offset: {
    x: {
      value: effect.offset.x,
      unit: "pixel" as UnitTypePixel,
      type: "number" as PropertyType,
    },
    y: {
      value: effect.offset.y,
      unit: "pixel" as UnitTypePixel,
      type: "number" as PropertyType,
    },
  },
  spread: {
    value: effect.spread,
    unit: "pixel" as UnitTypePixel,
    type: "number" as PropertyType,
  },
})

const extractEffects = (
  tokenNodes: EffectStyle[]
): effectPropertyInterface[] => {
  // get effect styles
  return (
    tokenNodes
      // remove tokens with no grid
      .filter((node) => node.effects.length > 0)
      // build
      .map((node) => ({
        name: node.name,
        description: node.description || "",
        values: node.effects.map((effect: Effect) =>
          effect.type === "LAYER_BLUR" || effect.type === "BACKGROUND_BLUR"
            ? blurValues(effect)
            : shadowValues(effect)
        ),
      }))
  )
}

export default extractEffects

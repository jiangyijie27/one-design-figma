import { PropertyType } from "../types/valueTypes"
import { fillValuesType } from "../types/propertyObject"
import { convertPaintToRgba } from "./utilities/convertColor"

figma.showUI(__html__, { width: 480, height: 480 })

const transparentFill: fillValuesType = {
  fill: {
    value: { r: 0, g: 0, b: 0, a: 0 },
    type: "color",
    blendMode: "normal",
  },
}

const extractFills = (paint: Paint): fillValuesType => {
  if (paint.type === "SOLID") {
    return {
      fill: {
        value: convertPaintToRgba(paint),
        type: "color" as PropertyType,
        blendMode: paint.blendMode?.toLowerCase() || "normal",
      },
    }
  }
  return transparentFill
}

const getTokens = () => {
  // 获取 local styles
  const paints = figma.getLocalPaintStyles()
  const textStyles = figma.getLocalTextStyles()
  const effects = figma.getLocalEffectStyles()
  // grid 暂时用不到
  // const grids = figma.getLocalGridStyles

  const colors = paints.reduce((prevs, paint) => {
    const { description, paints } = paint
    // get description starts with "token="
    const token = description?.split("token=")[1]

    // 只支持了 solid 的 paint token 导出
    const values = paints.length
      ? paints.map((paint) => extractFills(paint))
      : [transparentFill]

    const { r, g, b, a } = values[0].fill.value

    return [
      ...prevs,
      {
        token,
        values,
        css: `--${token}: rgba(${r}, ${g}, ${b}, ${a});`,
      },
    ]
  }, [] as { token: string; values: fillValuesType[] }[])

  console.log("yijie", textStyles)

  return {
    colors,
  }
}

figma.ui.onmessage = (msg) => {
  if (msg.type === "export") {
    const tokens = getTokens()
    console.log("yijie", tokens)
  }
}

export {}

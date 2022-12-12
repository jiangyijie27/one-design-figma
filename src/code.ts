import { PropertyType } from "../types/valueTypes"
import { fillValuesType } from "../types/propertyObject"
import { convertPaintToRgba } from "./utilities/convertColor"
import extractEffects from "./utilities/extractEffects"

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

    if (!token) {
      return prevs
    }

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
        css: {
          [`--${token}`]: `rgba(${r}, ${g}, ${b}, ${a})`,
        },
      },
    ]
  }, [] as { token: string; values: fillValuesType[]; css: { [key: string]: string } }[])

  const texts = textStyles.reduce(
    (prevs, textStyle) => {
      const { description } = textStyle
      const token = description?.split("token=")[1]

      if (!token) {
        return prevs
      }

      const { fontSize, lineHeight } = textStyle

      const fontSizeValue = `${fontSize}px`
      let lineHeightValue = "auto"

      if (lineHeight.unit === "PIXELS") {
        lineHeightValue = `${lineHeight.value}px`
      }

      const values = {
        fontSize: fontSizeValue,
        lineHeight: lineHeightValue,
      }

      return [
        ...prevs,
        {
          token,
          values,
          css: {
            [`--${token}-font-size`]: `${fontSizeValue}`,
            [`--${token}-line-height`]: `${lineHeightValue}`,
          },
        },
      ]
    },
    [] as {
      token: string
      values: {
        fontSize: string
        lineHeight: string
      }
      css: { [key: string]: string }
    }[]
  )

  const shadowsExtracted = extractEffects(effects)

  const shadows = shadowsExtracted.map(({ values, description }) => {
    const token = description?.split("token=")[1]
    const shadows = values
      .reverse()
      .map(({ color, offset, radius, spread }) => {
        if (!color) {
          return ""
        }
        const { r, g, b, a } = color.value
        return `${offset?.x.value || 0}px ${offset?.y.value || 0}px ${
          radius?.value || 0
        }px ${spread?.value || 0}px rgba(${r}, ${g}, ${b}, ${a})`
      })

    return {
      token,
      values: shadows,
      css: {
        [`--${token}`]: shadows.join(", "),
      },
    }
  })

  return {
    colors,
    texts,
    shadows,
  }
}

figma.ui.onmessage = (msg) => {
  if (msg.type === "export") {
    const tokens = getTokens()
    console.log("yijie", tokens)
  }
}

export {}

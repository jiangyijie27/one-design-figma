import {
  ColorRgba,
  BlendType,
  GradientType,
  GridAlignment,
  GridPattern,
  NumericUnitTypes,
  StrokeAlign,
  StrokeJoin,
  StrokeCap,
  TextCase,
  TextDecoration,
  UnitTypePixel,
  EffectType,
  PropertyType,
  UnitTypeSeconds,
} from "./valueTypes"

export type fillValuesType = {
  fill: {
    value: ColorRgba
    type: PropertyType
    blendMode: BlendType
  }
}

export type gradientStopType = {
  color: {
    value: ColorRgba
    type: PropertyType
  }
  position: {
    value: number
    type: PropertyType
  }
}

export type gradientValuesType = {
  gradientType: {
    value: GradientType
    type: PropertyType
  }
  rotation: {
    value: number
    type: PropertyType
    unit: "degree"
  }
  stops: gradientStopType[]
  opacity: {
    value: number
    type: PropertyType
  }
}

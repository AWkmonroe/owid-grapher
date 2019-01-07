import { AxisSpec } from './AxisSpec'
import { Color } from './Color'
import { Colorable } from './Colorizer'

export interface IChartTransform {
    isValidConfig: boolean
    yAxis?: AxisSpec
    xAxis?: AxisSpec
    selectableKeys?: string[]
    colorables?: Colorable[]
}

import * as React from 'react'
import { clone, isEmpty, noop, extend, map } from '../charts/Util'
import { computed, action } from 'mobx'
import { observer } from 'mobx-react'
import ChartEditor from './ChartEditor'
import { NumericSelectField, NumberField, SelectField, TextField, Toggle, EditableList, EditableListItem, ColorBox, Section, FieldsRow, BindAutoString, BindAutoFloat } from './Forms'
import MapConfig from '../charts/MapConfig'
import MapProjection from '../charts/MapProjection'
import ColorSchemes from '../charts/ColorSchemes'
import { NumericBin, CategoricalBin } from '../charts/MapData'
import Color from '../charts/Color'

@observer
class VariableSection extends React.Component<{ mapConfig: MapConfig }> {
    @action.bound onVariableId(variableId: number) {
        this.props.mapConfig.props.variableId = variableId
    }

    @action.bound onProjection(projection: string) {
        this.props.mapConfig.props.projection = (projection as MapProjection)
    }

    render() {
        const {mapConfig} = this.props
        const { filledDimensions } = mapConfig.chart.data

        if (isEmpty(filledDimensions))
            return <section>
                <h2>Add some variables on data tab first</h2>
            </section>

        const projections = ['World', 'Africa', 'NorthAmerica', 'SouthAmerica', 'Asia', 'Europe', 'Australia']

        return <Section name="Map">
            <NumericSelectField label="Variable" value={mapConfig.variableId as number} options={filledDimensions.map(d => d.variableId)} optionLabels={filledDimensions.map(d => d.displayName)} onValue={this.onVariableId} />
            <SelectField label="Region" value={mapConfig.props.projection} options={projections} onValue={this.onProjection} />
        </Section>

    }
}

@observer
class TimelineSection extends React.Component<{ mapConfig: MapConfig }> {
    @action.bound onToggleHideTimeline(value: boolean) {
        this.props.mapConfig.props.hideTimeline = value||undefined
    }

    @action.bound onTolerance(tolerance: number) {
        this.props.mapConfig.props.timeTolerance = tolerance
    }

    render() {
        const {mapConfig} = this.props
        return <Section name="Timeline">
            <Toggle label="Hide timeline" value={!!mapConfig.props.hideTimeline} onValue={this.onToggleHideTimeline}/>
            <NumberField label="Tolerance of data" value={mapConfig.props.timeTolerance} onValue={this.onTolerance} helpText="Specify a range of years from which to pull data. For example, if the map shows 1990 and tolerance is set to 1, then data from 1989 or 1991 will be shown if no data is available for 1990."/>
        </Section>
    }
}

@observer
class NumericBinView extends React.Component<{ mapConfig: MapConfig, bin: NumericBin, index: number }> {
    @action.bound onColor(color: Color) {
        const { mapConfig, index } = this.props

        if (!mapConfig.isCustomColors) {
            // Creating a new custom color scheme
            mapConfig.props.customCategoryColors = {}
            mapConfig.props.customNumericColors = []
            mapConfig.props.customColorsActive = true
        }

        while (mapConfig.props.customNumericColors.length < mapConfig.data.numBins)
            mapConfig.props.customNumericColors.push(undefined)

        mapConfig.props.customNumericColors[index] = color
    }

    @action.bound onMaximumValue(value: number) {
        const { mapConfig, index } = this.props
        mapConfig.props.colorSchemeValues[index] = value
    }

    @action.bound onLabel(value: string) {
        const { mapConfig, index } = this.props
        while (mapConfig.props.colorSchemeLabels.length < mapConfig.data.numBins)
            mapConfig.props.colorSchemeLabels.push(undefined)
        mapConfig.props.colorSchemeLabels[index] = value
    }

    @action.bound onRemove() {
        const { mapConfig, index } = this.props
        mapConfig.props.colorSchemeValues.splice(index, 1)
        mapConfig.props.customNumericColors.splice(index, 1)
    }

    @action.bound onAddAfter() {
        const { mapConfig, index } = this.props
        const { colorSchemeValues, customNumericColors } = mapConfig.props
        const currentValue = colorSchemeValues[index]

        if (index === colorSchemeValues.length-1)
            colorSchemeValues.push(currentValue+mapConfig.data.binStepSizeDefault)
        else {
            const newValue = (currentValue+colorSchemeValues[index+1])/2
            colorSchemeValues.splice(index+1, 0, newValue)
            customNumericColors.splice(index+1, 0, undefined)
        }
    }

    render() {
        const { mapConfig, bin } = this.props

        return <EditableListItem className="numeric">
            <div className="clickable" onClick={this.onAddAfter}><i className="fa fa-plus"/></div>
            <ColorBox color={bin.color} onColor={this.onColor} />
            <NumberField value={bin.max} onValue={this.onMaximumValue}/>
            <TextField placeholder="Custom label" value={bin.label} onValue={this.onLabel} />
            {mapConfig.props.colorSchemeValues.length > 2 && <div className="clickable" onClick={this.onRemove}><i className="fa fa-remove"/></div>}
        </EditableListItem>
    }
}

@observer
class CategoricalBinView extends React.Component<{ mapConfig: MapConfig, bin: CategoricalBin }> {
    @action.bound onColor(color: Color) {
        const { mapConfig, bin } = this.props
        if (!mapConfig.isCustomColors) {
            // Creating a new custom color scheme
            mapConfig.props.customCategoryColors = {}
            mapConfig.props.customNumericColors = []
            mapConfig.props.customColorsActive = true
        }

        const customCategoryColors = clone(mapConfig.props.customCategoryColors)
        customCategoryColors[bin.value] = color
        mapConfig.props.customCategoryColors = customCategoryColors
    }

    @action.bound onLabel(value: string) {
        const { mapConfig, bin } = this.props
        const customCategoryLabels = clone(mapConfig.props.customCategoryLabels)
        customCategoryLabels[bin.value] = value
        mapConfig.props.customCategoryLabels = customCategoryLabels
    }

    @action.bound onToggleHidden() {
        const { mapConfig, bin } = this.props

        const customHiddenCategories = clone(mapConfig.props.customHiddenCategories)
        if (bin.isHidden)
            delete customHiddenCategories[bin.value]
        else
            customHiddenCategories[bin.value] = true
        mapConfig.props.customHiddenCategories = customHiddenCategories
    }

    render() {
        const { bin } = this.props

        return <EditableListItem className="categorical">
            <ColorBox color={bin.color} onColor={this.onColor} />
            <TextField value={bin.value} disabled={true} onValue={noop} />
            <TextField placeholder="Custom label" value={bin.label} onValue={this.onLabel} />
            <Toggle label="Hide" value={bin.isHidden} onValue={this.onToggleHidden} />
        </EditableListItem>
    }
}

@observer
class ColorSchemeEditor extends React.Component<{ map: MapConfig }> {
    @action.bound onMinimalValue(value: number) {
        this.props.map.props.colorSchemeMinValue = value
    }

    render() {
        const mapConfig = this.props.map
        const { dimension } = mapConfig.data
        if (!dimension) return null

        return <EditableList className="ColorSchemeEditor">
            {mapConfig.data.legendData.map((bin, index) => {
                if (bin instanceof NumericBin) {
                    return <NumericBinView mapConfig={mapConfig} bin={bin} index={index} />
                } else {
                    return <CategoricalBinView mapConfig={mapConfig} bin={bin} />
                }
            })}
        </EditableList>
    }
}

@observer
class ColorsSection extends React.Component<{ mapConfig: MapConfig }> {
    @action.bound onColorScheme(schemeKey: string) {
        const { mapConfig } = this.props
        if (schemeKey === 'custom') {
            mapConfig.props.customColorsActive = true
        } else {
            mapConfig.props.baseColorScheme = schemeKey
            mapConfig.props.customColorsActive = undefined
        }
    }

    @action.bound onInvert(invert: boolean) {
        this.props.mapConfig.props.colorSchemeInvert = invert || undefined
    }

    @action.bound onAutomatic(isAutomatic: boolean) {
        this.props.mapConfig.props.isManualBuckets = isAutomatic ? undefined : true
    }

    render() {
        const {mapConfig} = this.props
        const availableColorSchemes = map(ColorSchemes, (v: any, k: any) => extend({}, v, { key: k })).filter((v: any) => !!v.name)
        const currentColorScheme = mapConfig.isCustomColors ? 'custom' : mapConfig.baseColorScheme

        return <Section name="Colors">
            <FieldsRow>
                <SelectField label="Color scheme" value={currentColorScheme} options={availableColorSchemes.map(d => d.key).concat(['custom'])} optionLabels={availableColorSchemes.map(d => d.name).concat(['custom'])} onValue={this.onColorScheme} />
                <Toggle label="Invert colors" value={mapConfig.props.colorSchemeInvert || false} onValue={this.onInvert} />
            </FieldsRow>
            <FieldsRow>
                <Toggle label="Automatic classification" value={!mapConfig.props.isManualBuckets} onValue={this.onAutomatic} />
            </FieldsRow>
            {mapConfig.props.isManualBuckets && <ColorSchemeEditor map={mapConfig} />}
            {!mapConfig.props.isManualBuckets && <BindAutoFloat label="Step size" field="binStepSize" store={mapConfig.props} auto={mapConfig.data.binStepSizeDefault}/>}
        </Section>
    }
}

@observer
class MapLegendSection extends React.Component<{ mapConfig: MapConfig }> {
    @action.bound onEqualSizeBins(isEqual: boolean) {
        this.props.mapConfig.props.equalSizeBins = isEqual ? true : undefined
    }

    render() {
        const { mapConfig } = this.props
        return <Section name="Legend">
            <BindAutoString label="Label" field="legendDescription" store={mapConfig.props} auto={mapConfig.data.legendTitle}/>
            <Toggle label="Disable visual scaling of legend bins" value={!!mapConfig.props.equalSizeBins} onValue={this.onEqualSizeBins} />
        </Section>
    }
}

@observer
export default class EditorMapTab extends React.Component<{ editor: ChartEditor }> {
    @computed get chart() { return this.props.editor.chart }
    @computed get mapConfig() { return this.chart.map as MapConfig }

    render() {
        const { mapConfig } = this

        return <div className="EditorMapTab tab-pane">
            <VariableSection mapConfig={mapConfig} />
            {mapConfig.data.isReady &&
                [<TimelineSection mapConfig={mapConfig} />,
                <ColorsSection mapConfig={mapConfig} />,
                <MapLegendSection mapConfig={mapConfig} />]
            }
        </div>
    }
}

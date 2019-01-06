/* URLBinder.ts
 * ================
 *
 * This component is responsible for handling data binding between the
 * the chart and url parameters, to enable nice linking support
 * for specific countries and years.
 *
 */

import { debounce, isNumber, includes, filter, uniq, toString, isFinite } from './Util'
import { computed, when, runInAction, reaction, toJS } from 'mobx'
import { ChartTabOption } from './ChartTabOption'
import { defaultTo } from './Util'
import { ChartConfig, ChartConfigProps } from './ChartConfig'
import { getQueryParams, setQueryStr, queryParamsToStr, QueryParams } from './Util'
import { MapProjection } from './MapProjection'

interface ChartQueryParams {
    tab?: string
    overlay?: string
    stackMode?: string
    xScale?: string
    yScale?: string
    time?: string
    year?: string
    region?: string
    country?: string
    shown?: string
    endpointsOnly?: string
}

declare const App: any
declare const Global: { rootUrl: string }

export class URLBinder {
    chart: ChartConfig
    origChartProps: ChartConfigProps
    chartQueryStr: string = "?"
    mapQueryStr: string = "?"
    debounceMode: boolean = false

    constructor(chart: ChartConfig, queryStr?: string) {
        this.chart = chart
        this.origChartProps = toJS(chart.props)

        if (chart.isSinglePage) {
            // Only work with the actual url if we're not an embed
            this.populateFromURL(getQueryParams())

            // There is a surprisingly considerable performance overhead to updating the url
            // while animating, so we debounce to allow e.g. smoother timelines
            const pushParams = () => setQueryStr(queryParamsToStr(this.params as QueryParams))
            const debouncedPushParams = debounce(pushParams, 100)

            reaction(
                () => this.params,
                () => this.debounceMode ? debouncedPushParams() : pushParams()
            )
        } else if (queryStr !== undefined) {
            this.populateFromURL(getQueryParams(queryStr))
        }
    }

    @computed get origChart() {
        if (App.isEditor) {
            // In the editor, the current chart state is always the "original" state
            return toJS(this.chart.props)
        } else {
            return this.origChartProps
        }
    }

    // Autocomputed url params to reflect difference between current chart state
    // and original config state
    @computed.struct get params(): ChartQueryParams {
        const params: ChartQueryParams = {}
        const { chart, origChart } = this

        params.tab = chart.props.tab === origChart.tab ? undefined : chart.props.tab
        //params.overlay = chart.props.overlay === origChart.overlay ? undefined : chart.props.overlay
        params.xScale = chart.props.xAxis.scaleType === origChart.xAxis.scaleType ? undefined : chart.xAxis.scaleType
        params.yScale = chart.props.yAxis.scaleType === origChart.yAxis.scaleType ? undefined : chart.yAxis.scaleType
        params.stackMode = chart.props.stackMode === origChart.stackMode ? undefined : chart.props.stackMode
        params.endpointsOnly = chart.props.compareEndPointsOnly === origChart.compareEndPointsOnly ? undefined : (chart.props.compareEndPointsOnly ? "1" : "0")
        params.year = this.yearParam
        params.time = this.timeParam
        params.country = this.countryParam

        if (chart.props.map && origChart.map && chart.props.map.projection !== origChart.map.projection)
            params.region = chart.props.map.projection

        return params
    }

    @computed get queryStr(): string {
        return queryParamsToStr(this.params as QueryParams)
    }

    @computed get baseUrl(): string | undefined {
        if (this.chart.isPublished)
            return Global.rootUrl + "/" + this.chart.data.slug
        else
            return undefined
    }

    // Get the full url representing the canonical location of this chart state
    @computed get canonicalUrl(): string | undefined {
        return this.baseUrl ? this.baseUrl + this.queryStr : undefined
    }

    @computed get yearParam(): string | undefined {
        const { chart, origChart } = this

        if (chart.props.map && origChart.map && chart.props.map.targetYear !== origChart.map.targetYear) {
            return toString(chart.props.map.targetYear)
        } else {
            return undefined
        }
    }

    @computed get timeParam(): string | undefined {
        const { chart, origChart } = this

        const { minTime, maxTime } = chart.props
        if (minTime !== origChart.minTime || maxTime !== origChart.maxTime) {
            if (isFinite(minTime) && isFinite(maxTime) && minTime !== maxTime) {
                return `${minTime}..${maxTime}`
            } else if (isNumber(minTime)) {
                return toString(minTime)
            } else {
                return undefined
            }
        } else {
            return undefined
        }
    }

    @computed get countryParam(): string | undefined {
        const { chart, origChart } = this
        if (chart.data.isReady && JSON.stringify(chart.props.selectedData) !== JSON.stringify(origChart.selectedData)) {
            return uniq(chart.data.selectedKeys.map(k => chart.data.lookupKey(k).shortCode).map(encodeURIComponent)).join("+")
        } else {
            return undefined
        }
    }

    /**
     * Set e.g. &shown=Africa when the user selects Africa on a stacked area chartView or other
     * toggle-based legend chartView.
     */
    /*updateLegendKeys() {
        var activeLegendKeys = chartView.model.get("activeLegendKeys");
        if (activeLegendKeys === null)
            setQueryVariable("shown", null);
        else {
            var keys = map(activeLegendKeys, function(key) {
                return encodeURIComponent(key);
            });
            setQueryVariable("shown", keys.join("+"));
        }
    }*/

    /**
     * Apply any url parameters on chartView startup
     */
    populateFromURL(params: ChartQueryParams) {
        const { chart } = this

        // Set tab if specified
        const tab = params.tab
        if (tab) {
            if (!includes(chart.availableTabs, tab))
                console.error("Unexpected tab: " + tab)
            else
                chart.props.tab = (tab as ChartTabOption)
        }

        const overlay = params.overlay
        if (overlay) {
            if (!includes(chart.availableTabs, overlay))
                console.error("Unexpected overlay: " + overlay)
            else
                chart.props.overlay = (overlay as ChartTabOption)
        }

        // Stack mode for bar and stacked area charts
        chart.props.stackMode = defaultTo(params.stackMode, chart.props.stackMode)

        // Axis scale mode
        const xScaleType = params.xScale
        if (xScaleType) {
            if (xScaleType === 'linear' || xScaleType === 'log')
                chart.xAxis.scaleType = xScaleType
            else
                console.error("Unexpected xScale: " + xScaleType)
        }

        const yScaleType = params.yScale
        if (yScaleType) {
            if (yScaleType === 'linear' || yScaleType === 'log')
                chart.yAxis.scaleType = yScaleType
            else
                console.error("Unexpected xScale: " + yScaleType)
        }

        const time = params.time
        if (time !== undefined) {
            const m = time.match(/^(\d+)\.\.(\d+)$/)
            if (m) {
                chart.timeDomain = [parseInt(m[1]), parseInt(m[2])]
            } else {
                chart.timeDomain = [parseInt(time), parseInt(time)]
            }
        }

        const endpointsOnly = params.endpointsOnly
        if (endpointsOnly !== undefined) {
            chart.props.compareEndPointsOnly = endpointsOnly === "1" ? true : undefined
        }

        // Map stuff below

        if (chart.props.map) {
            const year = parseInt(params.year || "")
            if (!isNaN(year)) {
                chart.props.map.targetYear = year
            }

            const region = params.region
            if (region !== undefined) {
                chart.props.map.projection = region as MapProjection
            }
        }

        // Selected countries -- we can't actually look these up until we have the data
        const country = params.country
        when(() => chart.data.isReady, () => {
            runInAction(() => {
                if (country) {
                    const entityCodes = country.split('+').map(decodeURIComponent)

                    if (chart.data.canChangeEntity) {
                        chart.data.availableEntities.forEach(entity => {
                            const entityMeta = chart.vardata.entityMetaByKey[entity]
                            if (entityMeta.code === entityCodes[0] || entityMeta.name === entityCodes[0])
                                chart.data.switchEntity(entityMeta.id)
                        })
                    } else {
                        chart.data.selectedKeys = filter(chart.data.availableKeys, datakey => {
                            const meta = chart.data.lookupKey(datakey)
                            const entityMeta = chart.vardata.entityMetaByKey[meta.entity]
                            return includes(entityCodes, meta.shortCode) || includes(entityCodes, entityMeta.code) || includes(entityCodes, entityMeta.name)
                        })
                    }
                }
            })
        })

        // Set shown legend keys for chartViews with toggleable series
        /*var shown = params.shown;
         if (isString(shown)) {
             var keys = map(shown.split("+"), function(key) {
                 return decodeURIComponent(key);
             });

             chart.activeLegendKeys = keys
         }*/
    }
}

import { extend } from './Util'
import * as React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import Bounds from './Bounds'
import ChartConfig from './ChartConfig'
import { SourceWithDimension } from './ChartData'
const linkifyHtml = require('linkifyjs/html')
import * as Cookies from 'js-cookie'

function linkify(s: string) {
    return linkifyHtml(s).replace(/(?:\r\n|\r|\n)/g, '<br/>')
}

declare const Global: { rootUrl: string }

@observer
export default class SourcesTab extends React.Component<{ bounds: Bounds, chart: ChartConfig }> {
    @computed get bounds() {
        return this.props.bounds
    }

    @computed get sources() {
        return this.props.chart.data.sources
    }

    renderSource(source: SourceWithDimension) {
        const { dimension } = source
        const { variable } = dimension

        const editUrl = Cookies.get('isAdmin') ? `${Global.rootUrl}/admin/datasets/${variable.datasetId}` : undefined

        return <div className="datasource-wrapper">
            <h2>{variable.name} {editUrl && <a href={editUrl} target="_blank"><i className="fa fa-pencil"/></a>}</h2>
            <table className="variable-desc">
                {variable.description && <tr><td>Variable description</td><td dangerouslySetInnerHTML={{__html: linkify(variable.description)}}/></tr>}
                {variable.coverage && <tr><td>Variable geographic coverage</td><td>{variable.coverage}</td></tr>}
                {variable.timespan && <tr><td>Variable time span</td><td>{variable.timespan}</td></tr>}
                {dimension.unitConversionFactor !== 1 && <tr><td>Unit conversion factor for chart</td><td>{dimension.unitConversionFactor}</td></tr>}
                {source.dataPublishedBy && <tr><td>Data published by</td><td dangerouslySetInnerHTML={{__html: linkify(source.dataPublishedBy)}}/></tr>}
                {source.dataPublisherSource && <tr><td>Data publisher's source</td><td dangerouslySetInnerHTML={{__html: linkify(source.dataPublisherSource)}}/></tr>}
                {source.link && <tr><td>Link</td><td dangerouslySetInnerHTML={{__html: linkify(source.link)}}/></tr>}
                {source.retrievedDate && <tr><td>Retrieved</td><td>{source.retrievedDate}</td></tr>}
            </table>
            {source.additionalInfo && <p dangerouslySetInnerHTML={{__html: linkify(source.additionalInfo)}}/>}
        </div>
    }

    render() {
        const { bounds } = this

        return <div className="sourcesTab" style={extend(bounds.toCSS(), { position: 'absolute' })}>
            <div>
                <h2>Sources</h2>
                <div>
                    {this.sources.map(source => this.renderSource(source))}
                </div>
            </div>
        </div>
    }
}

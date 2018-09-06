import * as React from 'react'
import {observer} from 'mobx-react'
import {observable, computed, action, runInAction} from 'mobx'
const timeago = require('timeago.js')()
const fuzzysort = require("fuzzysort")
import * as _ from 'lodash'

import Admin from './Admin'
import AdminLayout from './AdminLayout'
import { SearchField, FieldsRow } from './Forms'
import Link from './Link'
import DatasetList, {DatasetListItem} from './DatasetList'

interface Searchable {
    dataset: DatasetListItem
    term: string
}

@observer
export default class DatasetsIndexPage extends React.Component {
    context!: { admin: Admin }

    @observable datasets: DatasetListItem[] = []
    @observable maxVisibleRows = 50
    @observable searchInput?: string

    @computed get searchIndex(): Searchable[] {
        const searchIndex: Searchable[] = []
        for (const dataset of this.datasets) {
            searchIndex.push({
                dataset: dataset,
                term: fuzzysort.prepare(dataset.name + " " + dataset.tags.map(t => t.name).join(" ") + " " + dataset.namespace + " " + dataset.dataEditedByUserName)
            })
        }

        return searchIndex
    }

    @computed get datasetsToShow(): DatasetListItem[] {
        const {searchInput, searchIndex, maxVisibleRows} = this
        if (searchInput) {
            const results = fuzzysort.go(searchInput, searchIndex, {
                limit: 50,
                key: 'term'
            })
            return _.uniq(results.map((result: any) => result.obj.dataset))
        } else {
            return this.datasets.slice(0, maxVisibleRows)
        }
    }

    @computed get namespaces() {
        return _.uniq(this.datasets.map(d => d.namespace))
    }

    @computed get numTotalRows(): number {
        return this.datasets.length
    }

    @action.bound onSearchInput(input: string) {
        this.searchInput = input
    }

    @action.bound onShowMore() {
        this.maxVisibleRows += 100
    }

    render() {
        const {datasetsToShow, searchInput, numTotalRows} = this

        const highlight = (text: string) => {
            if (this.searchInput) {
                const html = fuzzysort.highlight(fuzzysort.single(this.searchInput, text)) || text
                return <span dangerouslySetInnerHTML={{__html: html}}/>
            } else
                return text
        }

        return <AdminLayout title="Datasets">
            <main className="DatasetsIndexPage">
                <FieldsRow>
                    <span>Showing {datasetsToShow.length} of {numTotalRows} datasets</span>
                    <SearchField placeholder="Search all datasets..." value={searchInput} onValue={this.onSearchInput} autofocus/>
                </FieldsRow>
                <DatasetList datasets={datasetsToShow} searchHighlight={highlight}/>
                {!searchInput && <button className="btn btn-secondary" onClick={this.onShowMore}>Show more datasets...</button>}
            </main>
        </AdminLayout>
    }

    async getData() {
        const {admin} = this.context
        if (admin.currentRequests.length > 0)
            return

        const json = await admin.getJSON("/api/datasets.json")
        runInAction(() => {
            this.datasets = json.datasets
        })
    }

    componentDidMount() {
        this.getData()
     }
}

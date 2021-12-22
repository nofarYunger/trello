import React from 'react'
import { DashboardDataPreview } from './DashboardDataPreview'


export function DashboardDatalist({ prevsData }) {
    return (
        <ul className="dashboard-datalist clear-list flex column space-between">
            {prevsData.map(data => {
                return <DashboardDataPreview key={data.title} data={data} />
            })}
        </ul>
    )
}

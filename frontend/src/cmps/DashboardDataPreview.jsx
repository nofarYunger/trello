import React, { Component } from 'react'

export function DashboardDataPreview({ data }) {

    return (
        <article style={{color:data.bgColor}} className="dashboard-data-preview">
            <h3 className="data-title" style={{ backgroundColor: data.bgColor }}>{data.title}</h3>
            <h2 className="data-total">Total: {data.total}</h2>
            <span className="data-recent">This Week: {data.new}</span>
        </article>
    )
}

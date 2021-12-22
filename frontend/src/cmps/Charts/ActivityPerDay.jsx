import { Bar } from 'react-chartjs-2'
import { dashboardService } from '../../services/dashboardService'

import React, { Component } from 'react'

export default class ActivityPerDay extends Component {
    state = {
        data: {}
    }


    render() {
        const { board, className } = this.props,
            data = dashboardService.getActivityPerDayData(board)
        // const { data } = this.state
        if (!data) return <h1>Loading</h1>
        return (
            <div className={`activity-per-day ${className}`}>
                <h3>Activity per Day</h3>
                <Bar data={data} width={400} height={400} />
            </div>
        )
    }
}

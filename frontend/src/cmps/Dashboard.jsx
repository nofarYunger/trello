import React, { Component } from 'react'
import TasksPerPerson from './Charts/TasksPerPerson'
import ActivityPerDay from './Charts/ActivityPerDay'
import TasksPerDay from './Charts/TasksPerDay'
import { dashboardService } from '../services/dashboardService'
import { DashboardDatalist } from './DashboardDatalist'
import { DashboardDataPreview } from './DashboardDataPreview'

export class Dashboard extends Component {

    state = {

    }
    componentDidMount() {
        const { board } = this.props
        dashboardService.getDashboardPrevsData(board)
    }

    handleClickOutside = ev => {
        this.props.toggleDashboard(false)
    }

    render() {
        const { board } = this.props
        const prevsData = dashboardService.getDashboardPrevsData(board)
        const Charts = [
            { Chart: TasksPerPerson, props: { ...this.props, className: "grid-chart",width: 400,height: 400 } },
            { Chart: ActivityPerDay, props: { ...this.props, className: "grid-chart", width: 400,height: 400 } },
            { Chart: TasksPerDay, props: { ...this.props, className: "grid-chart",width: 400, height: 400 } },
        ]

        return (
            <div className="dashboard  board-layout">
                {prevsData.map((data, idx) => {
                    const { Chart, props } = Charts[idx]
                    return (
                        <section key={data.title} className="dashboard-grid-section">
                            <DashboardDataPreview data={data} />
                            <Chart {...props} />
                        </section>
                    )
                })}
            </div>
        )
    }
}



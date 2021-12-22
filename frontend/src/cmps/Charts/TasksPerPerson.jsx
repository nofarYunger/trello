import { Component } from 'react';
import { Doughnut } from 'react-chartjs-2'
import { dashboardService } from '../../services/dashboardService'

export default class MyChart extends Component {
    state = {
        data: {
            labels: [
                'Adult Toys',
                'Kid Toys',
                'Yellow'
            ],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56'
                ]
            }]
        }
    }

    render() {
        const { board, className } = this.props,
            { data } = dashboardService.getTasksPerPeopleData(board)
        // const { data } = this.state
        return (
            <div className={`tasks-per-person ${className}`}>
                <h3>Tasks per Person</h3>
                <Doughnut data={data} {...this.props} />
            </div>
        );
    }
}


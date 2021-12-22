import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz'

export const dashboardService = {
    getTasksPerPeopleData,
    getActivityPerDayData,
    getTasksPerDayData,
    getDashboardPrevsData
}

function getTasksPerPeopleData(board) {
    const labels = board.members.map(member => member.fullname)
    var boardTasks = []
    board.lists.forEach(list => {
        boardTasks = [...boardTasks, ...list.tasks]
    })
    const tasksPerPerson = boardTasks.reduce((acc, task) => {
        task.members?.length && task.members.forEach(member => {
            const currIdx = labels.indexOf(member.fullname)
            acc[currIdx] = acc[currIdx] ? acc[currIdx] + 1 : 1
        })

        return acc
    }, [])
    return {
        labels, tasksPerPerson, data: {
            labels,
            datasets: [{
                data: tasksPerPerson,
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
}

function getActivityPerDayData(board) {
    var labels = []

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date()
    const zonedDate = utcToZonedTime(date, timeZone)

    for (var i = 5; i >= 0; i--) {
        labels[5 - i] = format(zonedDate, 'LLL') + ' ' + (zonedDate.getDate() - i)
    }

    const activityPerDay = board.activities.reduce((acc, activity) => {
        const zonedCreatedAt = utcToZonedTime(new Date(activity.createdAt), timeZone)
        const formattedTime = format(zonedCreatedAt, 'LLL') + ' ' + (zonedCreatedAt.getDate())
        const currIdx = labels.indexOf(formattedTime)
        if (currIdx !== -1) acc[currIdx] = acc[currIdx] ? acc[currIdx] + 1 : 1
        return acc
    }, [])

    return {
        labels,
        datasets: [
            {
                label: 'Activity',
                data: [200, 100, 250, 300, 80],
                barPercentage: 0.8,
                borderColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#c377e0',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                ],
                borderWidth: 2,
                backgroundColor: [
                    '#FF638450',
                    '#36A2EB50',
                    '#FFCE5650',
                    '#c377e050',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#c377e0',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                ]
            }
        ]
    }
}

function getTasksPerDayData(board) {
    var labels = []

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date()
    const zonedDate = utcToZonedTime(date, timeZone)

    for (var i = 6; i > 0; i--) {
        labels[i] = format(zonedDate, 'LLL') + ' ' + (zonedDate.getDate() - i)
    }

    var boardTasks = []
    board.lists.forEach(list => {
        boardTasks = [...boardTasks, ...list.tasks]
    })

    const tasksPerDay = boardTasks.reduce((acc, task) => {
        const zonedCreatedAt = utcToZonedTime(new Date(task.createdAt), timeZone)
        const formattedTime = format(zonedCreatedAt, 'LLL') + ' ' + (zonedCreatedAt.getDate())
        const currIdx = labels.indexOf(formattedTime)
        if (currIdx !== -1) acc[currIdx] = acc[currIdx] ? acc[currIdx] + 1 : 1
        return acc
    }, [])

    return {
        labels,
        datasets: [
            {
                label: 'Tasks',
                data: [12, 9, 14, 11, 18, 13, 21],
                barPercentage: 0.8,
                borderColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                ],
                borderWidth: 2,
                backgroundColor: [
                    '#FF638450',
                    '#36A2EB50',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                    '#FFCE56',
                ]
            }
        ]
    }
}

function getDashboardPrevsData(board) {

    const currTime = Date.now()
    const oneWeekMS = 6048000000

    const boardActivity = board.activities,
        totalActivity = boardActivity.length,
        newActivity = boardActivity.filter(activity => {
            return activity.createdAt >= currTime - oneWeekMS
        }),
        totalNewActivity = newActivity.length


    const boardTasks = _getAllTasks(board),
        totalTasks = boardTasks.length,
        newTasks = boardTasks.filter(task => {
            return task.createdAt >= currTime - oneWeekMS
        }),
        totalNewTasks = newTasks.length,

        overDueTasks = boardTasks.filter(task => {
            return task.dueDate > currTime
        }),
        totalOverDueTasks = overDueTasks.length,

        newOverdueTasks = overDueTasks.filter(task => {
            return task.createdAt >= currTime - oneWeekMS
        }),
        totalNewOverDueTasks = newOverdueTasks.length


    return [
        { title: 'Tasks', total: totalTasks, new: totalNewTasks, bgColor: '#56c991' },
        { title: 'Activity', total: totalActivity, new: totalNewActivity, bgColor: '#9895e0' },
        { title: 'Overdue', total: totalOverDueTasks, new: totalNewOverDueTasks, bgColor: '#3cc2e0' }
    ]

}

function _getAllTasks(board) {
    return board.lists.reduce((acc, list) => {
        acc = [...acc, ...list.tasks]
        return acc
    }, [])
}

function _getZonedDate(timestamp = Date.now()) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date(timestamp)
    const zonedDate = utcToZonedTime(date, timeZone)
    return zonedDate
}
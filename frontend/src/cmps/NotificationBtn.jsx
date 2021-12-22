import React, { Component } from 'react'

export class NotificationBtn extends Component {

    notificationRef = React.createRef()

    componentDidMount() {
        var button = document.getElementById("notifications");
        button.addEventListener('click', function (e) {
            Notification.requestPermission().then(function (result) {
                if (result === 'granted') {
                    randomNotification();
                }
            });
        });
    }


    randomNotification() {
        var randomItem = Math.floor(Math.random()*games.length);
        var notifTitle = games[randomItem].name;
        var notifBody = 'Created by '+games[randomItem].author+'.';
        var notifImg = 'data/img/'+games[randomItem].slug+'.jpg';
        var options = {
            body: notifBody,
            icon: notifImg
        }
        var notif = new Notification(notifTitle, options);
        setTimeout(randomNotification, 30000);
    }










    render() {
        return (
            <div>
<button ref={this.notificationRef} ></button>
            </div>
        )
    }
}

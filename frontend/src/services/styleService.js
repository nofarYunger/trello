import { httpService } from "./httpService"


export const styleService = {

    getBgOptions,
    // letterAvatar
}


async function getBgOptions() {

    return [
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088348/trello%20background/pexels-photo-3769139_szaes1.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088331/trello%20background/pexels-photo-2310885_zczpxr.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088313/trello%20background/pexels-photo-266451_cyv6ux.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088301/trello%20background/pexels-photo-417173_oq55fd.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088285/trello%20background/pexels-photo-326055_bxexhu.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088271/trello%20background/pexels-photo-39811_mauelm.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088256/trello%20background/pexels-photo-934718_xv1kkf.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088244/trello%20background/pexels-photo-2246476_xueoqq.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088228/trello%20background/pexels-photo-4101555_svdfsl.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611088214/trello%20background/pexels-photo-1591305_ui4iai.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611059426/photo-1610377551984-9dc3f82aa31f_wuk20y.jpg')",
        "url('https://res.cloudinary.com/nofar/image/upload/v1611328219/photo-1610720684893-619cd7a5cde5_zqn2tf.jpg')",

    ]
}


//  function letterAvatar(name, size) {

//     name = name || '';
//     size = size || 60;

//     var colours = [
//         "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50",
//         "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"
//     ],

//         nameSplit = String(name).toUpperCase().split(' '),
//         initials, charIndex, colourIndex, canvas, context, dataURI;


//     if (nameSplit.length === 1) {
//         initials = nameSplit[0] ? nameSplit[0].charAt(0) : '?';
//     } else {
//         initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
//     }


//     charIndex = (initials === '?' ? 72 : initials.charCodeAt(0)) - 64;
//     colourIndex = charIndex % 20;
//     canvas = d.createElement('canvas');
//     canvas.width = size;
//     canvas.height = size;
//     context = canvas.getContext("2d");

//     context.fillStyle = colours[colourIndex - 1];
//     context.fillRect(0, 0, canvas.width, canvas.height);
//     context.font = Math.round(canvas.width / 2) + "px Arial";
//     context.textAlign = "center";
//     context.fillStyle = "#FFF";
//     context.fillText(initials, size / 2, size / 1.5);

//     dataURI = canvas.toDataURL();
//     canvas = null;

//     return dataURI;
// }

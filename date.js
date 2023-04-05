
// module.exports.getDate = getDate;

// var getDate = function () {
//     let today = new Date();

//     let options = {
//         weekday: "long",
//         day: "numeric",
//         month: "long"
//     };
//     let day = today.toLocaleDateString("en-us", options);
//     return day;
// }


//refactored functions
module.exports.getDate = function () {
    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return today.toLocaleDateString("en-us", options);
}


module.exports.getDay = function () {
    const today = new Date();

    const options = {
        weekday: "long"
    };
    return today.toLocaleDateString("en-us", options);
}

// module.exports.getDay = getDay;

// function getDay() {
//     let today = new Date();

//     let options = {
//         weekday: "long"
//     };
//     let day = today.toLocaleDateString("en-us", options);
//     return day;
// }
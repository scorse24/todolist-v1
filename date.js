exports.getDate = function (){

    const today = new Date();
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const day = today.toLocaleDateString('en-US', options);

    return day;
};

exports.getDay = function (){

    const today = new Date();
    const options = {weekday: 'long'};
    const day = today.toLocaleDateString('en-US', options);

    return day;
};
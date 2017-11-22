if('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register("sw.js")
        .then(msg => console.log("SW registered"))
        .catch(console.error)
}

var classrooms = {};
var beacons = {};
var trajectories = {};

var classroom = {
    name: 'S2',
    top: 1250,
    left: 1380
};
var beacon = {
    name: 'DESKTOP-NB',
    top: 130,
    left: 1380
};

classrooms['S2'] =
    {
        name: 'S2',
        top: 1250,
        left: 1380
    };

beacons['DESKTOP-NB'] =
    {
        name: 'DESKTOP-NB',
        top: 130,
        left: 1380
    };

trajectories['DESKTOP-NB-S2'] =
    {
    name: 'DESKTOP-NB-S2',
    groups:
    [
        [
                {
                    top: 200,
                    left: 1395
                },
                {
                    top: 200,
                    left: 1465
                },
                {
                    top: 470,
                    left: 1465
                },
                {
                    top: 470,
                    left: 1495
                },
                {
                    top: 430,
                    left: 1495
                }
        ],
        [
            {
                top: 975,
                left: 1500
            },
            {
                top: 1020,
                left: 1500
            },
            {
                top: 1020,
                left: 1465
            },
            {
                top: 975,
                left: 1465
            }
        ],
        [
            {
                top: 1540,
                left: 1500
            },
            {
                top: 1585,
                left: 1500
            },
            {
                top: 1585,
                left: 1465
            },
            {
                top: 1340,
                left: 1465
            },
            {
                top: 1340,
                left: 1400
            },
            {
                top: 1310,
                left: 1400
            }
        ]
        ]
    };

setupSuggestions();

function bluetooth() {

    let filters = [{ services: ['0000feaa-0000-1000-8000-00805f9b34fb'] }];
  
    let options = {};
    if (false) {
        options.acceptAllDevices = true;
    } else {
        options.filters = filters;
    }

    console.log('Requesting Bluetooth Device...');
    console.log('with ' + JSON.stringify(options));
    navigator.bluetooth.requestDevice(options)
        .then(device => {
            beacon = beacons[device.name];

            if (beacon == null) {
                return Promise.reject("No beacon in database with such name");
            }

            console.log('Beacon found');

            drawBeacon();

            if ($('#to').css('visibility') == 'visible')
                drawTrajectory();
            
        })
        .catch(error => {
            console.log('Argh! ' + error);
            removeTrajectory();
            $('#from').css('visibility', 'hidden');
            alert('Failed to locate you');
        });
}

function search() {

    console.log("classroom search");


    classroom = classrooms[$('#search').val()];

    if (classroom == null) {
        $('#to').css('visibility', 'hidden')
        removeTrajectory();
        alert('Could not find this classroom');
        return;
    }

    console.log('Classroom found');

    drawClassroom();

    if ($('#from').css('visibility') == 'visible')
        drawTrajectory();
}

function drawTrajectory() {
    var trajectory = trajectories[beacon.name + '-' + classroom.name];

    if (trajectory == null) {
        console.log("Error");
        return;
    }

    for (var i = 0, len = trajectory.groups.length; i < len; i++) {
        var steps = trajectory.groups[i];

        var prevStep = steps[0];
        drawStep(prevStep.left, prevStep.top + 350);

        for (var j = 1, len2 = steps.length; j < len2; j++) {

            var step = steps[j];

            var difX = Math.abs(prevStep.left - step.left);
            var difY = Math.abs(prevStep.top - step.top);

            if (difX > difY) { //move horizonticly

                var times = Math.floor(difX / 20);

                var sign = prevStep.left - step.left < 0 ? 1 : -1;

                for (var z = 1; z <= times; z++){
                    drawStep(prevStep.left + (z * 20 + 5) * sign, prevStep.top + 350)
                }
            } else {//move verticly
                var times = Math.floor(difY / 20);

                var sign = prevStep.top - step.top < 0 ? 1 : -1;

                for (var z = 1; z <= times; z++) {
                    drawStep(prevStep.left, prevStep.top + 350 + (z * 20 + 5) * sign)
                }
            }
            prevStep = step;
            drawStep(step.left, step.top + 350);
        }
    }
}

function removeTrajectory() {

    $('.trajectory').each(function (a,b) {
        document.body.removeChild(b);
    });
}

function drawBeacon() {

    $('#from')
        .css('visibility', 'visible')
        .css('left', beacon.left)
        .css('top', beacon.top + 350 + 'px');
}

function drawClassroom() {
    $('#to')
        .css('visibility', 'visible')
        .css('left', classroom.left)
        .css('top', classroom.top + 350 + 'px');
}

function drawStep(x,y) {

    var div = document.createElement("div");
    div.className = 'trajectory';
    $(div)
        .css('visibility', 'visible')
        .css('left', x)
        .css('top', y + 'px');
    document.body.appendChild(div);
}

function setupSuggestions() {

    var suggestions = document.getElementById('suggestions');

    for (var key in classrooms){
        var option = document.createElement("option");
        option.value = key;
        suggestions.appendChild(option);
    }
}

//drawBeacon();
//drawClassroom();
//drawTrajectory();
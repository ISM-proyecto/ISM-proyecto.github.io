function bluetooth() {

    let filters = [{ services: ['0000feaa-0000-1000-8000-00805f9b34fb'] }];
    //let filterService = document.querySelector('#service').value;
    //if (filterService.startsWith('0x')) {
    //  filterService = parseInt(filterService);
    //}
    //if (filterService) {
    // filters.push({ services: [parseInt('9OIHjxyOHttHsm/9SXrIzQ==')]});
    //}

    //let filterName = document.querySelector('#name').value;
    //if (filterName) {
    //  filters.push({name: filterName});
    //}

    //let filterNamePrefix = document.querySelector('#namePrefix').value;
    //if (filterNamePrefix) {
    //  filters.push({namePrefix: filterNamePrefix});
    //}

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
            clear();
            log('> Name:             ' + device.name);
            log('> Id:               ' + device.id);
            log('> Connected:        ' + device.gatt.connected);
            log('> UUIDS:        ' + device.uuids);
            log('> Data:        ' + device.adData);
        })
        .catch(error => {
            clear()
            log('Argh! ' + error);
        });
}

function log(text) {
    $('#log').text($('#log').text() + text)
}

function clear(text) {
    $('#log').text('')
}
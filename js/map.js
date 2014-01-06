function rect2longlat(v) {
    var longitude = Math.atan2(v.x, v.z);
    var latitude = -Math.acos(v.y);
    return {
        longitude: longitude,
        latitude: latitude
    }
}

// TODO: Use longlat only when referring to the degrees
//       Use spherical when referring to radians
function longlat2rect(coords) {
    var x = Math.sin(coords.longitude) * Math.cos(-coords.latitude);
    var y = Math.sin(coords.longitude) * Math.sin(-coords.latitude);
    var z = Math.cos(coords.longitude);
    return new THREE.Vector3(x, y, z);
}

function longlat2mapuv(coords) {
    var x = 0.499 + coords.longitude / Math.PI / 2;
    var y = -coords.latitude / Math.PI;
    return new THREE.Vector2(x, y);
}

function degree2radian(degree) {
    return degree * (Math.PI / 180);
}

function radian2degree(radian) {
    return radian / (Math.PI / 180);
}
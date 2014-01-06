/**
 * A 4-ary tree of longitudes (-pi to pi) and latitudes (-pi/2 to pi/2)
 */
function CoordNode(value, vertex) {
    this.value = value;
    this.vertex = vertex;
    this.moreLongMoreLat = null;
    this.moreLongLessLat = null;
    this.lessLongMoreLat = null;
    this.lessLongLessLat = null;
}

function MakeCoordTree() {
    return new CoordNode({longitude: 0, latitude: 0});
}

window.maxLat = -999999;
window.minLat = 888888;

function pickChild(a, b) {
    window.maxLat = Math.max(window.maxLat, b.latitude);
    window.minLat = Math.min(window.minLat, b.latitude);
    if (a.longitude < b.longitude) {
        if (a.latitude < b.latitude)
            return 'moreLongMoreLat';
        else
            return 'moreLongLessLat';
    }
    else {
        if (a.latitude < b.latitude)
            return 'lessLongMoreLat';
        else
            return 'lessLongLessLat';
    }
}

CoordNode.prototype = {
    insert: function(coord, vertex) {
        var childName = pickChild(this.value, coord);

        if (this[childName] === null) {
            this[childName] = new CoordNode(coord, vertex);
            return this[childName];
        }
        else {
            return this[childName].insert(coord, vertex);
        }
    },

    getClosest: function(coord, closest) {
        var childName = pickChild(this.value, coord);

        if (this[childName] === null) {
            return closest;
        }

        // Pick a new closest point
        if (typeof closest === 'undefined') {
            closest = {
                longitude: 9999999999999,
                latitude: 9999999999999
            }
        }
        var newLatDiff = Math.pow(coord.latitude - this[childName].value.latitude, 2);
        var newLongDiff = Math.pow(coord.longitude - this[childName].value.longitude, 2);
        var oldLatDiff = Math.pow(closest.latitude - this[childName].value.latitude, 2);
        var oldLongDiff = Math.pow(closest.longitude - this[childName].value.longitude, 2);
        if ( (newLatDiff + newLongDiff) < (oldLatDiff + oldLongDiff) ) {
            closest = this[childName];
        }

        return this[childName].getClosest(coord, closest);


    }
}
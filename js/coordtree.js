/**
 * A 4-ary tree of Coordinate's spherical theta and phi values
 */
function CoordNode(value) {
    this.value = value;
    this.moreThetaMorePhi = null;
    this.moreThetaLessPhi = null;
    this.lessThetaMorePhi = null;
    this.lessThetaLessPhi = null;
}

function MakeCoordTree() {
    return new CoordNode(new Coordinate().setCartesian(0, 0, 1));
}

window.maxPhi = -999999;
window.minPhi = 888888;

function pickChild(a, b) {
    window.maxPhi = Math.max(window.maxPhi, b.getSpherical().phi);
    window.minPhi = Math.min(window.minPhi, b.getSpherical().phi);
    if (a.getSpherical().theta < b.getSpherical().theta) {
        if (a.getSpherical().phi < b.getSpherical().phi)
            return 'moreThetaMorePhi';
        else
            return 'moreThetaLessPhi';
    }
    else {
        if (a.getSpherical().phi < b.getSpherical().phi)
            return 'lessThetaMorePhi';
        else
            return 'lessThetaLessPhi';
    }
}

CoordNode.prototype = {
    insert: function(coord) {
        var childName = pickChild(this.value, coord);

        if (this[childName] === null) {
            this[childName] = new CoordNode(coord);
            return this[childName];
        }
        else {
            return this[childName].insert(coord);
        }
    },

    getClosest: function(coord, closest) {
        var childName = pickChild(this.value, coord);
        console.log('-------' + childName + '------------------------------');
        console.log(this.value);

        if (this[childName] === null) {
            return closest;
        }

        // Pick a new closest point
        if (typeof closest === 'undefined') {
            closest = this[childName].value;
            return this[childName].getClosest(coord, closest);
        }

        //console.log(this[childName].value);
        var distanceClosest = closest.getVector3().distanceToSquared(coord.getVector3());
        var distanceCurrent = this[childName].value.getVector3().distanceToSquared(coord.getVector3());
        if ( distanceCurrent < distanceClosest ) {
            closest = this[childName].value;
            console.log('new closest');
            console.log(closest);
        }

        return this[childName].getClosest(coord, closest);


    }
}
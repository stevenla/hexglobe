/**
 * Does not support radius in spherical
 * Supports cartesian (x y z), spherical (theta phi), geographic (long lat)
 */
function Coordinate() {
    this._vector = new THREE.Vector3();
}

Coordinate.prototype = {
    setVector3: function(v) {
        return this.setCartesian(v.x, v.y, v.z);
    },

    getVector3: function() {
        return this._vector;
    },

    setCartesian: function(x, y, z) {
        if (typeof x === 'number')
            this._vector.setX(x);
        if (typeof y === 'number')
            this._vector.setY(y);
        if (typeof z === 'number')
            this._vector.setZ(z);
        this._theta = Math.atan2(this._vector.x, this._vector.z);
        this._phi = -Math.acos(this._vector.y);

        return this;
    },

    getCartesian: function() {
        return this._vector;
    },

    setSpherical: function(theta, phi) {
        if (typeof theta === 'number')
            this._theta = theta;
        if (typeof phi === 'number')
            this._phi = phi;

        this._vector.setX(Math.sin(this._theta) * Math.cos(-this._phi));
        this._vector.setY(Math.sin(this._theta) * Math.sin(-this._phi));
        this._vector.setZ(Math.cos(this._theta));

        return this;
    },

    getSpherical: function() {
        if (typeof this._theta !== 'number')
            return null;

        return {
            theta: this._theta,
            phi: this._phi,
        };
    },

    setGeographic: function(longitude, latitude) {
        if (typeof longitude === 'number')
            this._theta = degree2radian(longitude);
        if (typeof latitude === 'number')
            this._phi = degree2radian(latitude);

        this.setSpherical(this._theta, this._phi);

        return this;
    },

    getGeographic: function() {
        if (typeof this._theta !== 'number')
            return null;

        return {
            longitude: radian2degree(this._theta),
            latitude: radian2degree(this._phi)
        };
    },

    getMapUV: function() {
        var x = 0.499 + this._theta / Math.PI / 2;
        var y = -this._phi / Math.PI;
        return new THREE.Vector2(x, y);
    }

}

function degree2radian(degree) {
    return degree * (Math.PI / 180);
}

function radian2degree(radian) {
    return radian / (Math.PI / 180);
}
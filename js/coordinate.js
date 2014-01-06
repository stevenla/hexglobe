/**
 * Does not support radius in spherical
 * Supports cartesian (x y z), spherical (theta phi), geographic (long lat)
 */
function Coordinate() {
}

Coordinate.prototype = {
    setVector3: function(v) {
        return this.setCartesian(v.x, v.y, v.z);
    },

    getVector3: function() {
        if (typeof this._x !== 'number')
            return null;

        return new THREE.Vector3(this._x, this._y, this._z);
    },

    setCartesian: function(x, y, z) {
        if (typeof x === 'number')
            this._x = x;
        if (typeof y === 'number')
            this._y = y;
        if (typeof z === 'number')
            this._z = z;
        this._theta = Math.atan2(this._x, this._z);
        this._phi = -Math.acos(this._y);

        return this;
    },

    getCartesian: function() {
        if (typeof this._x !== 'number')
            return null;

        return {
            x: this._x,
            y: this._y,
            z: this._z
        };
    },

    setSpherical: function(theta, phi) {
        if (typeof theta === 'number')
            this._theta = theta;
        if (typeof phi === 'number')
            this._phi = phi;
        this._x = Math.sin(this._theta) * Math.cos(-this._phi);
        this._y = Math.sin(this._theta) * Math.sin(-this._phi);
        this._z = Math.cos(this._theta);

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
        this._x = Math.sin(this._theta) * Math.cos(-this._phi);
        this._y = Math.sin(this._theta) * Math.sin(-this._phi);
        this._z = Math.cos(this._theta);

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
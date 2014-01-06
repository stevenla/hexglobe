/**
 * Returns a function that accepts a number between 0.0 - 1.0
 */
function generate3ColorGradientFn(left, middle, right) {
    var color1 = new THREE.Color(left);
    var color2 = new THREE.Color(middle);
    var color3 = new THREE.Color(right);
    return function(pos) {
        if (pos < 0.5) {
            return color1.clone().lerp(color2, pos * 2);
        }
        else {
            return color2.clone().lerp(color3, (pos - 0.5) * 2);
        }
    }
}
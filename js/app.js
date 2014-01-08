(function() {
    var attributes, uniforms;
    var scene, camera, renderer, controls, textures;
    var geo;
    /**
     * Taken and modified from http://nooshu.com/debug-axes-in-three-js
     * Change: doesn't draw negative axes
     */
    function debugaxis(axisLength){
        //Shorten the vertex function
        function v(x,y,z){ 
                return new THREE.Vertex(new THREE.Vector3(x,y,z)); 
        }
        
        //Create axis (point1, point2, colour)
        function createAxis(p1, p2, color){
                var line, lineGeometry = new THREE.Geometry(),
                lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
                lineGeometry.vertices.push(p1, p2);
                line = new THREE.Line(lineGeometry, lineMat);
                scene.add(line);
        }
        
        createAxis(v(0, 0, 0), v(axisLength, 0, 0), 0xFF0000);
        createAxis(v(0, 0, 0), v(0, axisLength, 0), 0x00FF00);
        createAxis(v(0, 0, 0), v(0, 0, axisLength), 0x0000FF);
    }

    function initGL() {
        // Create the scene and set the scene size.
        scene = new THREE.Scene();
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        scene.fog = new THREE.Fog(0x000000, 2.75, 3.25);

        // Create and display renderer
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(WIDTH, HEIGHT);
        renderer.setClearColor(0x000000, 1);
        document.body.appendChild(renderer.domElement);

        // Set camera
        camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 10000);
        camera.position.set(0, 0, 3);
        //var scale = 60;
        //camera = new THREE.OrthographicCamera( WIDTH / - scale, WIDTH / scale, HEIGHT / scale, HEIGHT / - scale, -10, 10000 );
        scene.add(camera);

        // Orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // Bind function to resize renderer
        window.onresize = function () {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }
    }


    function initScene() {
        // Create map canvas to pull pixel values from
        var mapCanvas = document.createElement('canvas');
        mapCanvas.width = 256;
        mapCanvas.height = 256;
        document.getElementById('hidden').appendChild(mapCanvas);
        var mapImage = document.getElementById('earth-image');
        var mapContext = mapCanvas.getContext('2d');
        mapContext.drawImage(mapImage, 0, 0, mapImage.width, mapImage.height);

        var light = new THREE.PointLight(0xffffff);
        light.position.set(10, 50, 130);
        scene.add(light);

        var icosahedron = new THREE.IcosahedronGeometry(1, 6);
        geo = new THREE.Geometry();

        // Generate color generator for points
        var gradient = generate3ColorGradientFn(0x3e2c06, 0xe19e0f, 0xffffff);

        window.coordTree = MakeCoordTree();
        var randomized = [];
        var totalLength = icosahedron.vertices.length;
        randomized.length = totalLength;

        // Copy points from icosahedron
        for (var i in icosahedron.vertices) {
            var current = icosahedron.vertices[i];
            var coordinate = new Coordinate().setVector3(current);
            var mapUV = coordinate.getMapUV();

            try {
                var data = mapContext.getImageData(mapUV.x * 256, mapUV.y * 256, 1, 1).data;
            }
            catch (e) {
            }

            // Skip me if black
            if (data[0] === 0 && data[1] === 0 && data[2] === 0)
                continue;

            geo.vertices.push(current);
            //geo.colors.push(new THREE.Color('rgb(' + data[0] + ',' + data[1] + ',' + data[2] +')'));
            var color = gradient(Math.random());
            geo.colors.push(color);
            randomized[Math.floor(Math.random() * totalLength)] = coordinate;
        }

        // Insert values into tree randomized for a somewhat more balanced tree maybe
        for (var i in randomized) {
            window.coordTree.insert(randomized[i]);
        }

        var material = new THREE.ParticleSystemMaterial({
            size: 0.01,
            vertexColors: true
        });

        var particleSys = new THREE.ParticleSystem(geo, material);
        scene.add(particleSys);
    }

    function init() {
        initGL();
        initScene();
        debugaxis(1);
        animate();
    }

    function findNearestPoint(coordinate) {
        /*
        Attempt to use a tree instead of O(N) searching through each, doesn't
        work quite yet. Probably need to unify coordinate system with a class.
        Currently too hard to convert to and from different coordinates

        console.log(coords);
        var closest = window.coordTree.getClosest(coords);
        console.log(closest);
        return {
            point: closest.vertex,
            index: 0
        }
        */
        var minDistance = 9999999999;
        var minPoint = null;
        var minPointIndex;
        for (var i in geo.vertices) {
            var vertex = geo.vertices[i];
            var distance = vertex.distanceToSquared(coordinate.getVector3());
            if (distance < minDistance) {
                minDistance = distance;
                minPoint = vertex;
                minPointIndex = i;
            }
        }
        return {
            point: minPoint,
            index: minPointIndex
        };
    }

    window.test = function(longitude, latitude) {
        var coordinate = new Coordinate().setGeographic(longitude, latitude);
        var nearest = findNearestPoint(coordinate);
        var index = nearest.index;
        var point = nearest.point;

        var onSphereCoordinate = new Coordinate().setVector3(point);
        var length = 0.25 + Math.random() / 4;

        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, 1));
        lineGeometry.vertices.push(new THREE.Vector3(0, 0, 1 + length));

        var line = new THREE.Line(lineGeometry);
        line.material.color = new THREE.Color(0x31e7ce);
        line.lookAt(point);

        scene.add(line);

        return point;
    };

    var t = 0;

    function animate() {
        requestAnimationFrame(animate);

        // var index = Math.floor(Math.random() * geo.colors.length);
        // geo.colors[index] = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);
        // geo.colorsNeedUpdate = true;

        t += 1;

        renderer.render(scene, camera);
        controls.update();
    }

    init();

    window.box = test( -122.116355, 37.402538); // Box
    console.log(new Coordinate().setVector3(box));
    test( -118.441318, 34.074949); // UCLA
    test(-98, 36);
})();
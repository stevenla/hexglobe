(function() {
    var attributes, uniforms;
    var scene, camera, renderer, controls, textures;

    init();

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
        
        createAxis(v(-0, 0, 0), v(axisLength, 0, 0), 0xFF0000);
        createAxis(v(0, -0, 0), v(0, axisLength, 0), 0x00FF00);
        createAxis(v(0, 0, -0), v(0, 0, axisLength), 0x0000FF);
    }


    function init() {
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

        start();
    }

    var geo; 

    function start() {
        debugaxis(1);
        /*
        var vertShader = document.getElementById('vertexshader').innerHTML;
        var fragShader = document.getElementById('fragmentshader').innerHTML;
        var earth = THREE.ImageUtils.loadTexture('./earth.gif');
        uniforms = {
            map: { type: 't', value: earth },
        };

        attributes = {
            color: { type: 'c', value: [] },
            size: { type: 'f', value: [] }
        };

        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            attributes: attributes,
            vertexShader: vertShader,
            fragmentShader: fragShader
        });
        */

        
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

        var gradient = generate3ColorGradientFn(0x000000, 0xe19e0f, 0xffffff);

        // Copy points
        for (var i in icosahedron.vertices) {
            var current = icosahedron.vertices[i];
            var coords = rect2longlat(current); // Convert cartesian coords 
            var mapUV = longlat2mapuv(coords);  // Get 0 to 1.0 from longlat

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
        }

        var material = new THREE.ParticleSystemMaterial({
            size: 0.01,
            vertexColors: true
        });

        var particleSys = new THREE.ParticleSystem(geo, material);
        scene.add(particleSys);

        animate();
    }

    function findNearestPoint(coords) {
        var target = longlat2rect(coords);
        var minDistance = 9999999999;
        var minPoint;
        var minPointIndex;
        for (var i in geo.vertices) {
            var vertex = geo.vertices[i];
            var distance = vertex.distanceToSquared(target);
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

    window.test = function(long, lat) {
        var nearest = findNearestPoint({longitude: degree2radian(long), latitude: degree2radian(lat)});
        var index = nearest.index;
        var point = nearest.point;

        var extended = point.clone().multiplyScalar(1 + Math.random()/2);

        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(point.clone());
        lineGeometry.vertices.push(extended);

        var line = new THREE.Line(lineGeometry);
        line.material.color = new THREE.Color(0x31e7ce);

        scene.add(line);

        geo.colors[index] = new THREE.Color('#ffffff');
        geo.colorsNeedUpdate = true;
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

    test( -122.116355, 37.402538); // Box
    test(-98, 36);
})();
(function() {
    var attributes, uniforms;
    var scene, camera, renderer, controls, textures;

    init();

    function init() {
        // Create the scene and set the scene size.
        scene = new THREE.Scene();
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

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

    var icosahedron;

    function start() {
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
            vertexShader: vertShader,
            fragmentShader: fragShader
        });

        var light = new THREE.PointLight(0xffffff);
        light.position.set(10, 50, 130);
        scene.add(light);

        icosahedron = new THREE.IcosahedronGeometry(1, 6);

        // Initialize colors
        for (var i in icosahedron.vertices) {
            icosahedron.colors[i] = new THREE.Color();
        }

        /*
        var material = new THREE.ParticleSystemMaterial({
            size: 0.01,
            vertexColors: true
        });
        */

        var particleSys = new THREE.ParticleSystem(icosahedron, material);
        scene.add(particleSys);

        animate();
    }

    var t = 0;

    function animate() {
        requestAnimationFrame(animate);

        var index = Math.floor(Math.random() * icosahedron.colors.length);
        icosahedron.colors[index] = new THREE.Color().setHSL(Math.random(), 1.0, 0.5);
        icosahedron.colorsNeedUpdate = true;

        t += 1;

        renderer.render(scene, camera);
        controls.update();
    }


})();
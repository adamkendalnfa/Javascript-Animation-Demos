// Create and set up renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);

// Add renderer to page
const sectionTag = document.querySelector('section');
sectionTag.appendChild(renderer.domElement);

// Create scene
const scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0x000000, 0.1, 7000); //linear fog, makes things further darker

// Add lighting
const ambientLight = new THREE.AmbientLight(0x777777);
scene.add(ambientLight);

const pointlight = new THREE.PointLight(0xffffff, 1, 0);
pointlight.position.set(500, 500, -2000);
scene.add(pointlight);

// Create and position camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = -4000;

// Loader
const loader = new THREE.TextureLoader();


// Make star background (large sphere with the texture on the inside)
const makeStars = function() {
    const texture = loader.load("./assets/2k_stars.jpg");
    const geometry = new THREE.SphereGeometry(5000, 128, 128);
    const material = new THREE.MeshLambertMaterial({
        map: texture
    })

    const mesh = new THREE.Mesh(geometry, material);
    mesh.material.side = THREE.BackSide;
    scene.add(mesh);
    return mesh;
};

// Make Sun
const makeSun = function() {
    const texture = loader.load("./assets/2k_sun.jpg");
    const geometry = new THREE.SphereGeometry(500, 128, 128);
    const material = new THREE.MeshLambertMaterial({
        // color: 0x2727e6,
        map: texture
    })

    const mesh = new THREE.Mesh(geometry, material);
    // mesh.material.side = THREE.BackSide;
    scene.add(mesh);
    return mesh;
};


// Make planet
const makePlanet = function(imgPath, radius){
    const texture = loader.load(imgPath);
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const material = new THREE.MeshLambertMaterial({
        map: texture
    });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
    return mesh;
}

// Make rings
const makeRing = function(width){
    const geometry = new THREE.TorusGeometry(width, 2, 16, 100);
    const material = new THREE.MeshBasicMaterial({
        color: 0xbfbfbf
    })

    const mesh = new THREE.Mesh(geometry, material);

    // Note difference between rotating mesh (relative to self) vs rotating geometry (relative to the world)
    mesh.geometry.rotateX(Math.PI/2);

    scene.add(mesh);
    return mesh;
}

// Make asteroid belt (single object)
const makeAsteroids = function(){
    const texture = loader.load("./assets/particle.png");
    const geometry = new THREE.Geometry();
    for (let i = 0; i < 1000; i = i + 1){

        // set spherical coordinates to point
        const point = new THREE.Vector3();
        const sphericalPoint = new THREE.Spherical(
            1250 + Math.random() * 50, //somewhere between 1250 and 1300
            2 * Math.PI * Math.random(), //somewhere between 0 and 2PI 
            0// somewhere between 0 and PI
        )
        point.setFromSpherical(sphericalPoint);
        geometry.vertices.push(point);
    };

    const material = new THREE.PointsMaterial({
        size: 50,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending, 
        depthTest: true, // add depth test and remove depth write due to random star field, z-index artifacts, prevents overlapping
        depthWrite: false,
        color: 0x4f2e1e
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    return points;
};

const stars = makeStars();
const sun = makeSun();

const asteroids = makeAsteroids();
asteroids.geometry.rotateZ(Math.PI/2);

const mercury = makePlanet("./assets/2k_mercury.jpg", 20);
const mercuryGroup = new THREE.Group(); // Group allows object to rotate around the scene
mercuryGroup.add(mercury);
scene.add(mercuryGroup);
mercury.translateX(600);
const ring1 = makeRing(600);

const venus = makePlanet("./assets/2k_venus.jpg", 65);
const venusGroup = new THREE.Group(); // Group allows object to rotate around the scene
venusGroup.add(venus);
scene.add(venusGroup);
venus.translateX(750);
const ring2 = makeRing(750);

const earth = makePlanet("./assets/2k_earth.jpg", 70);
const earthGroup = new THREE.Group(); // Group allows object to rotate around the scene
earthGroup.add(earth);
scene.add(earthGroup);
earth.translateX(950);
const ring3 = makeRing(950);

const mars = makePlanet("./assets/2k_mars.jpg", 40);
const marsGroup = new THREE.Group(); // Group allows object to rotate around the scene
marsGroup.add(mars);
scene.add(marsGroup);
mars.translateX(1150);
const ring4 = makeRing(1150);

const jupiter = makePlanet("./assets/2k_jupiter.jpg", 150);
const jupiterGroup = new THREE.Group(); // Group allows object to rotate around the scene
jupiterGroup.add(jupiter);
scene.add(jupiterGroup);
jupiter.translateX(1500);
const ring5 = makeRing(1500);

const saturn = makePlanet("./assets/2k_saturn.jpg", 120);
const saturnGroup = new THREE.Group(); // Group allows object to rotate around the scene
saturnGroup.add(saturn);
scene.add(saturnGroup);
saturn.translateX(1900);
const ring6 = makeRing(1900);

const uranus = makePlanet("./assets/2k_uranus.jpg", 30);
const uranusGroup = new THREE.Group(); // Group allows object to rotate around the scene
uranusGroup.add(uranus);
scene.add(uranusGroup);
uranus.translateX(2100);
const ring7 = makeRing(2100);

const neptune = makePlanet("./assets/2k_neptune.jpg", 28);
const neptuneGroup = new THREE.Group(); // Group allows object to rotate around the scene
neptuneGroup.add(neptune);
scene.add(neptuneGroup);
neptune.translateX(2300);
const ring8 = makeRing(2300);


// Hold camera positions
let currentX = 0;
let currentY = 0;
let aimX = 0;
let aimY = 0;

// Create animation loop
const animate = function(){

    // Tween camera movement to mouse position
    const diffX = aimX - currentX; // find the difference 
    const diffY = aimY - currentY;
    currentX = currentX + (diffX * 0.05); // add some fraction of the difference to the current value each frame
    currentY = currentX + (diffY * 0.05);
    camera.position.x = currentX; // update position
    camera.position.y = currentY;

    camera.lookAt(scene.position);
    sun.rotateY(0.005);

    mercury.rotateY(0.015);
    mercuryGroup.rotateY(0.004);

    venus.rotateY(0.015);
    venusGroup.rotateY(0.005);

    earth.rotateY(0.015);
    earthGroup.rotateY(0.003);

    mars.rotateY(0.015);
    marsGroup.rotateY(0.006);

    jupiter.rotateY(0.015);
    jupiterGroup.rotateY(0.002);

    saturn.rotateY(0.015);
    saturnGroup.rotateY(0.001);

    uranus.rotateY(0.015);
    uranusGroup.rotateY(0.003);

    neptune.rotateY(0.015);
    neptuneGroup.rotateY(0.004);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();



// Move camera on mouse move
document.addEventListener("mousemove", function(event){
    aimX = ((window.innerWidth/2) - event.pageX) * 4;
    aimY =  ((window.innerHeight/2) - event.pageY) * 4;
})

// Move camera on touch move
document.addEventListener("touchmove", function(event){
    aimX = ((window.innerWidth/2) - event.pageX) * 4;
    aimY =  ((window.innerHeight/2) - event.pageY) * 4;
})


// Update on browser resize
window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})
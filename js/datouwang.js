/* DaTouWang URL: www.datouwang.com */
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import { SVGLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/SVGLoader.js';
// import { FontLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/FontLoader.js';
var scene,
  camera,
  renderer,
  container,
  aspect,
  fov,
  plane,
  far,
  mouseX,
  mouseY,
  windowHalfX,
  windowHalfY,
  geometry,
  starStuff,
  materialOptions,
  stars,
  textureCube,
  controls,
  // 加载音乐字段
  listener,
  audio,
  audioLoader;

// 添加音频元素 
var audioPlay = document.querySelector("#audio");
var musicBtn = document.querySelector('.music-btn');
var screenBtn = document.querySelector('.screen-btn');
let musicFlag = false;
let screenFlag = false;
musicBtn.addEventListener('click', function () {
  if (musicFlag) {
    audioPlay.pause()
    musicBtn.className = 'music-btn'
  } else {
    audioPlay.play()
    musicBtn.className = 'music-btn music-btn-move'
  }
  musicFlag = !musicFlag;
  console.log(musicFlag)
})
screenBtn.addEventListener('click', function () {
  screenFlag = !screenFlag;
  screenFlag && rfs();
  !screenFlag && efs();
})
//进入全屏
function rfs() {
  var de = document.documentElement;

  if (de.requestFullscreen) {
    de.requestFullscreen();
  }

  if (de.mozRequestFullScreen) {
    de.mozRequestFullScreen();
  }

  if (de.webkitRequestFullScreen) {
    de.webkitRequestFullScreen();
  }
};
function efs() {
  var d = document;

  if (d.exitFullscreen) {
    d.exitFullscreen();
  }

  if (d.mozCancelFullScreen) {
    d.mozCancelFullScreen();
  }

  if (d.webkitCancelFullScreen) {
    d.webkitCancelFullScreen();
  }
};

init();
animate();

function init() {
  container = document.createElement(`div`);
  document.body.appendChild(container);

  mouseX = 0;
  mouseY = 0;

  // 添加相机视角参数
  aspect = window.innerWidth / window.innerHeight;
  fov = 75;
  plane = 1;
  far = 1000;

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  // 添加相机
  camera = new THREE.PerspectiveCamera(
    fov,
    aspect,
    plane,
    far
  );
  // 设置相机位置
  camera.position.z = far / 1.5;
  camera.position.x = -450

  // 添加场景
  scene = new THREE.Scene({ antialias: true });
  scene.fog = new THREE.FogExp2(0x1b1b1b, 0.0001);

  // 添加星星函数
  starForge();
  // 添加相册盒子
  // addBox();
  // 添加图片精灵图
  addSprite();
  addText();

  // 添加渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);
  container.appendChild(renderer.domElement);
  renderer.render(scene, camera);

  // 创建控件对象
  controls = new OrbitControls(camera, renderer.domElement);
  // 如果使用animate方法时，将此函数删除
  // this.controls.addEventListener( 'change', render );
  // 使动画循环使用时阻尼或自转 意思是否有惯性
  controls.enableDamping = true;
  //动态阻尼系数 就是鼠标拖拽旋转灵敏度
  controls.dampingFactor = 0.005;
  //是否可以缩放
  controls.enableZoom = true;
  //是否自动旋转
  controls.autoRotate = false;
  //设置相机距离原点的最远距离
  controls.minDistance = 0.1;
  //设置相机距离原点的最远距离
  controls.maxDistance = 10000;
  //是否开启右键拖拽
  controls.enablePan = true;

  document.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);
  stars.rotation.x += 0.001;
  stars.rotation.y += 0.001;
  render();
}

function render() {
  camera.position.x += (mouseX - camera.position.x) * 0.005;
  camera.position.y += (-mouseY - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
// 添加中间盒子
function addBox() {
  // 添加环境贴图加载器
  const loader = new THREE.CubeTextureLoader();
  loader.setPath('image/');
  textureCube = loader.load(['bb2.jpg', 'bb4.jpg', 'bb5.jpg', 'bb6.jpg', 'bb2.jpg', 'bb2.jpg']);
  textureCube.encoding = THREE.sRGBEncoding;

  // 加载单个纹理贴图
  // const textureLoader = new THREE.TextureLoader();
  // const textureCube = textureLoader.load('/image/bb1.jpg');

  let boxGeo = new THREE.BoxGeometry(100, 100, 100)
  let boxGeoMaterial = new THREE.MeshBasicMaterial({
    color: 'pink',
    envMap: textureCube
  });
  let cubeBox = new THREE.Mesh(boxGeo, boxGeoMaterial)
  cubeBox.name = 'box'
  cubeBox.position.set(100, 0, 0)
  //  进入相片盒子
  // cubeBox.geometry.scale(1, 1, -1);
  // camera.position.z = 1;
  scene.add(cubeBox)

}
// 添加精灵图
function addSprite() {
  const url1 = '/image/bb2.jpg'
  const url2 = '/image/bb6.jpg'
  const url3 = '/image/bb1.png';
  const url4 = '/image/bb2.png';

  const texture = new THREE.TextureLoader().load(url1)
  const material = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(material)

  const texture2 = new THREE.TextureLoader().load(url2)
  const material2 = new THREE.SpriteMaterial({ map: texture2 })
  const sprite2 = new THREE.Sprite(material2)

  const texture3 = new THREE.TextureLoader().load(url3)
  const material3 = new THREE.SpriteMaterial({ map: texture3 })
  const sprite3 = new THREE.Sprite(material3)

  const texture4 = new THREE.TextureLoader().load(url4)
  const material4 = new THREE.SpriteMaterial({ map: texture4 })
  const sprite4 = new THREE.Sprite(material4)

  // 设置大小、位置、内容
  sprite.scale.set(100, 100, 100)
  sprite.position.set(120, 0, -10)

  sprite2.scale.set(100, 100, 100)
  sprite2.position.set(-250, 150, -10)

  sprite3.scale.set(100, 150, 100)
  sprite3.position.set(120, 150, 10)

  sprite4.scale.set(150, 250, 150)
  sprite4.position.set(-350, 0, 100)

  // 加入场景中
  scene.add(sprite, sprite2, sprite3, sprite4)
}

// 添加3d字体
function addText() {
  const loader = new THREE.FontLoader();
  loader.load('fonts/font.json', function (font) {

    const color = new THREE.Color('#FF6EC7');

    const matDark = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    });

    const matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });

    const message = '   ZYR\nHappy\nValentine.';

    const shapes = font.generateShapes(message, 100);

    const geometry = new THREE.ShapeGeometry(shapes);

    geometry.computeBoundingBox();

    const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    geometry.translate(xMid, 0, 0);

    // make shape ( N.B. edge view not visible )

    const text = new THREE.Mesh(geometry, matLite);
    text.position.z = - 100;
    text.position.y = 100;
    scene.add(text);

    // make line shape ( N.B. edge view remains visible )

    const holeShapes = [];

    for (let i = 0; i < shapes.length; i++) {

      const shape = shapes[i];

      if (shape.holes && shape.holes.length > 0) {

        for (let j = 0; j < shape.holes.length; j++) {

          const hole = shape.holes[j];
          holeShapes.push(hole);

        }

      }

    }

    shapes.push.apply(shapes, holeShapes);

    const style = SVGLoader.getStrokeStyle(5, color.getStyle());

    const strokeText = new THREE.Group();

    for (let i = 0; i < shapes.length; i++) {

      const shape = shapes[i];

      const points = shape.getPoints();

      const geometry = SVGLoader.pointsToStroke(points, style);

      geometry.translate(xMid, 0, 0);

      const strokeMesh = new THREE.Mesh(geometry, matDark);
      strokeText.add(strokeMesh);

    }
    strokeText.position.y = 150;
    scene.add(strokeText);

    render();
  }); //end load function

}

function starForge() {
  var amount = 45000;
  geometry = new THREE.SphereGeometry(1000, 100, 50);

  materialOptions = {
    color: new THREE.Color(0xffffff),
    size: 1.1,
    transparency: true,
    opacity: 0.8
  };

  starStuff = new THREE.PointsMaterial(materialOptions);


  for (var i = 0; i < amount; i++) {
    var item = new THREE.Vector3();
    item.x = Math.random() * 2000 - 1000;
    item.y = Math.random() * 2000 - 1000;
    item.z = Math.random() * 2000 - 1000;

    geometry.vertices.push(item);
  }

  stars = new THREE.PointCloud(geometry, starStuff);
  scene.add(stars);
}

function onMouseMove(e) {
  mouseX = e.clientX - windowHalfX;
  mouseY = e.clientY - windowHalfY;
}

function addMusic() {
  listener = new THREE.AudioListener();
  audio = new THREE.Audio(listener);
  audioLoader = new THREE.AudioLoader();
  audioLoader.load('/assest/bg-music.mp3', function (AudioBuffer) {
    audio.setBuffer(AudioBuffer); // 音频缓冲区对象关联到音频对象audio
    audio.setLoop(true); // 音乐循环
    audio.setVolume(0.5); //音量
    audio.play(); //play播放、stop停止、pause暂停
  });
}

function onWindowResize() {
  // 窗口缩放的时候,保证场景也跟着一起缩放
  camera.aspect = window.innerWidth / window.innerHeight;
  // updateProjectionMatrix()：用来手动更新相机的投影矩阵的
  camera.updateProjectionMatrix();
  // 重置画布宽高
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.onbeforeunload = function (e) {
  window.removeEventListener("resize", onWindowResize);
  window.removeEventListener("mousemove", onMouseMove);
}
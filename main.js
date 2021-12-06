let canvas = document.getElementById('canvas');

let context = canvas.getContext('2d');

let loadCounter = 0;

let background = new Image();
let palmTrees = new Image();
let flag = new Image();
let store = new Image();
let carShadow = new Image();
let car = new Image();

let layerList = [
    {
        'image': background,
        'src': './images/layer_1_1.png',
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1,
        'zIndex': -2
    },
    {
        'image': palmTrees,
        'src': './images/layer_1_2.png',
        'position': {x: 0, y: 0},
        'blend': 'overlay',
        'opacity': 1,
        'zIndex': -1.5
    },
    {
        'image': flag,
        'src': './images/layer_1_3.png',
        'position': {x: 0, y: 0},
        'blend': 'overlay',
        'opacity': 1,
        'zIndex': -0.5
    },
    {
        'image': store,
        'src': './images/layer_1_4.png',
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1,
        'zIndex': 0
    },
    {
        'image': carShadow,
        'src': './images/layer_1_5.png',
        'position': {x: 0, y: 0},
        'blend': 'multiply',
        'opacity': 0.7,
        'zIndex': 0.5
    },
    {
        'image': car,
        'src': './images/layer_1_6.png',
        'position': {x: 0, y: 0},
        'blend': 'overlay',
        'opacity': 1,
        'zIndex': 1
    }
];

layerList.forEach((layer, index) => {
    layer.image.onload = function () {
        loadCounter++;
        if(loadCounter >= layerList.length) {
            requestAnimationFrame(drawCanvas);
        }
    }
    layer.image.src = layer.src;
})

function drawCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    layerList.forEach((layer, index) => {

        layer.position = getOffset(layer);
        context.globalAlpha = layer.opacity;
        context.drawImage(layer.image, layer.position.x, layer.position.y);
    });
    requestAnimationFrame(drawCanvas);
}
let moving = false;

let pointerInitial = {
    x: 0,
    y: 0
};

let pointer = {
    x: 0,
    y: 0
};

let touchEvent = 'touchstart';
let mouseEvent = 'mousedown';
let touchListener = 'touchmove';
let mouseListener = 'mousemove';

canvas.addEventListener(touchEvent, pointerStart);
canvas.addEventListener(mouseEvent, pointerStart);

function getOffset(layer) {
    let touchOffsetX = pointer.x * layer.zIndex * 0.3;
    let touchOffsetY = pointer.y * layer.zIndex * 0.3;
    return {
        x: touchOffsetX,
        y: touchOffsetY
    };
}

function pointerStart(event){
    moving = true;
    console.log(event)
    switch (event.type) {
        case touchEvent:
            pointerInitial.x = event.touches[0].clientX;
            pointerInitial.y = event.touches[0].clientY;
            break;

        case mouseEvent:
            console.log("mouse 1");
            pointerInitial.x = event.clientX;
            pointerInitial.y = event.clientY;
            break
    }
}

window.addEventListener(touchListener, pointerMove);
window.addEventListener(mouseListener, pointerMove);

function pointerMove(event) {
    // event.preventDefault();
    if(moving === 'true') {
        let currentX = 0;
        let currentY = 0;

        switch (event.type) {
            case touchListener:
                currentX = event.touches[0].clientX;
                currentY = event.touches[0].clientY;
                break;

            case mouseListener:
                console.log("Hello")
                currentX = event.clientX;
                currentY = event.clientY;
                break
        }
        pointer.x = currentX - pointerInitial.x;
        pointer.y = currentY - pointerInitial.y;

    }
}

canvas.addEventListener(touchListener, function (event) {
    event.preventDefault()
});

canvas.addEventListener(mouseListener, function (event) {
    event.preventDefault()
});

window.addEventListener('touchend', function (event) {
    endGesture();
});

window.addEventListener('mouseup', function (event) {
    endGesture();
});

function endGesture() {
    moving = false;

    pointer.x = 0;
    pointer.y = 0;
}



//// MOTION CONTROLS ////

// Initialize variables for motion-based parallax
var motion_initial = {
    x: null,
    y: null
};
var motion = {
    x: 0,
    y: 0
};

// This is where we listen to the gyroscope position
window.addEventListener('deviceorientation', function(event) {
    // If this is the first run through here, set the initial position of the gyroscope
    if (!motion_initial.x && !motion_initial.y) {
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }

    // Depending on what orientation the device is in, you need to adjust what each gyroscope axis means
    // This can be a bit tricky
    if (window.orientation === 0) {
        // The device is right-side up in portrait orientation
        motion.x = event.gamma - motion_initial.y;
        motion.y = event.beta - motion_initial.x;
    } else if (window.orientation === 90) {
        // The device is in landscape laying on its left side
        motion.x = event.beta - motion_initial.x;
        motion.y = -event.gamma + motion_initial.y;
    } else if (window.orientation === -90) {
        // The device is in landscape laying on its right side
        motion.x = -event.beta + motion_initial.x;
        motion.y = event.gamma - motion_initial.y;
    } else {
        // The device is upside-down in portrait orientation
        motion.x = -event.gamma + motion_initial.y;
        motion.y = -event.beta + motion_initial.x;
    }
});

// Reset the position of motion controls when device changes between portrait and landscape, etc.
window.addEventListener('orientationchange', function(event) {
    motion_initial.x = 0;
    motion_initial.y = 0;
});

window.addEventListener('touchend', function (){
    enableMotion();
});

function enableMotion() {
    if(window.DeviceOrientationEvent) {
        DeviceOrientationEvent.requestPermission;
    }
}

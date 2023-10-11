var program;
var programStill;
var vertexPosition;
var canvas;

var isFirstShaderActive;

document.addEventListener('keypress', (Event) => {
    if (Event.key == "1") {
        localStorage.setItem("isFirstShaderActive", true);
        location.reload();
    }
    if (Event.key == "2") {
        localStorage.setItem("isFirstShaderActive", false);
        location.reload();
    }
})

function SetupFirstShader() {
    program = initShaders(gl, "vertex-shader", "fragment-shader-first");
    gl.useProgram(program);
}

function SetupSecondShader() {
    program = initShaders(gl, "vertex-shader", "fragment-shader-second");
    gl.useProgram(program);
}

var COLUMNS = 150;
window.onload = function Init() {

    CanvasSetup();

    // Load shaders and initialize attribute buffers based on player input
    var isFirstShaderActive = localStorage.getItem("isFirstShaderActive");

    // --- VERTICE DEFINITION ---

    // Define the vertices of the circles
    var circleVertices1 = [];
    var circleVertices2 = [];
    var numSegments = 100;
    var centerX1 = -0.25;
    var centerY1 = 0.0;
    var radius1 = 0.25;
    var centerX2 = -0.25 + (1 / 16);
    var centerY2 = 0.0;
    var radius2 = 0.2;
    // ------------------------------------

    // Define the vertices for the pentagon:
    var pentagonVertices = [];
    var numSegmentsPentagon = 5;
    var pengatonCenterX = 0.086;
    var pengatonCenterY = 0.0;
    var pentagonRadius = 0.04588;
    // ------------------------------------

    // Value multiplier
    var multiplier = 0.57;
    // ------------------------------------

    // Red Rectangle Vertices
    var newRedRectangleVertices = [];
    function CreateRedRectangleVertices() {

        var xValueOfRedRectangleVertices;
        for (var index = 0; index <= 150; index++) {

            xValueOfRedRectangleVertices = (-0.75) + (index / 100);

            newRedRectangleVertices.push(xValueOfRedRectangleVertices, -0.5, xValueOfRedRectangleVertices, 0.5);
        }
    }
    // ------------------------------------

    CreateRedRectangleVertices();

    // Star Triangles' Vertices
    var starTriangleVertices1 = [
        0.085 * multiplier, 0.047 * multiplier,
        0.085 * multiplier, -0.047 * multiplier,
        (-0.75 + 0.6925) * multiplier, 0.0 * multiplier
    ]

    var starTriangleVertices2 = [
        0.085 * multiplier, 0.047 * multiplier,
        0.175 * multiplier, 0.076 * multiplier,
        0.085 * multiplier, 0.2 * multiplier
    ]

    var starTriangleVertices3 = [
        0.085 * multiplier, 0.047 * multiplier,
        0.175 * multiplier, -0.076 * multiplier,
        0.085 * multiplier, -0.2 * multiplier
    ]

    var starTriangleVertices4 = [
        0.175 * multiplier, 0.076 * multiplier,
        0.23 * multiplier, 0.0 * multiplier,
        0.32 * multiplier, 0.125 * multiplier

    ]

    var starTriangleVertices5 = [
        0.175 * multiplier, -0.076 * multiplier,
        0.23 * multiplier, 0.0 * multiplier,
        0.32 * multiplier, -0.125 * multiplier,
    ]
    // ------------------------------------

    // Circle Vertices
    for (var i = 0; i < numSegments; i++) {
        var angle = (i / numSegments) * 2 * Math.PI;
        var x1 = centerX1 + radius1 * Math.cos(angle);
        var y1 = centerY1 + radius1 * Math.sin(angle);
        var x2 = centerX2 + radius2 * Math.cos(angle);
        var y2 = centerY2 + radius2 * Math.sin(angle);
        circleVertices1.push(x1, y1);
        circleVertices2.push(x2, y2);
    }
    // Pentagon vertices
    for (var i = 0; i < numSegmentsPentagon; i++) {
        var pentagonAngle = (i / numSegmentsPentagon) * 2 * Math.PI;
        var pentagonX = pengatonCenterX + pentagonRadius * Math.cos(pentagonAngle);
        var pentagonY = pengatonCenterY + pentagonRadius * Math.sin(pentagonAngle);
        pentagonVertices.push(pentagonX, pentagonY);
    }

    // Set some color values
    var rgbRed = [255, 0, 0];
    var rgbWhite = [255, 255, 255];
    // ------------------------------------

    // Set the amplitude, wavelength, frequency values for the wave
    const amplitude = 0.05;
    const wavelength = 5.5;
    const frequency = 40.0;
    // ------------------------------------

    gl.clearColor(0.0, 0.0, 1.0, 1.0); // Set clear color to blue
    gl.clear(gl.COLOR_BUFFER_BIT);

    let startTime = Date.now();

    function render() {

        DrawBlueRectangle();

        if (isFirstShaderActive === "true") {
            SetupFirstShader();
        }
        else {
            SetupSecondShader();
        }

        DrawFlag();

        // ---------------------------------------------------------------

        // Ensure the drawing is complete
        gl.flush();

        requestAnimationFrame(render);

    }
    requestAnimationFrame(render);

    function DrawFlag() {

        var redRectangleBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, redRectangleBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newRedRectangleVertices), gl.STATIC_DRAW);
        // ------------------------------------
        // Star triangles' buffers
        var starTriangleBuffer1 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer1);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starTriangleVertices1), gl.STATIC_DRAW);

        var starTriangleBuffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer2);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starTriangleVertices2), gl.STATIC_DRAW);

        var starTriangleBuffer3 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer3);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starTriangleVertices3), gl.STATIC_DRAW);

        var starTriangleBuffer4 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer4);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starTriangleVertices4), gl.STATIC_DRAW);

        var starTriangleBuffer5 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer5);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(starTriangleVertices5), gl.STATIC_DRAW);
        // ------------------------------------

        // Circles' buffers
        var circleBuffer1 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer1);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices1), gl.STATIC_DRAW);

        var circleBuffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer2);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleVertices2), gl.STATIC_DRAW);
        // ------------------------------------

        // Pentagon buffer
        var pentagonBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pentagonBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pentagonVertices), gl.STATIC_DRAW);
        // ------------------------------------

        // --- Associate shader variables with vertex data buffers ---
        vertexPosition = gl.getAttribLocation(program, "vPosition");
        gl.enableVertexAttribArray(vertexPosition);

        // ------------------------------------

        // Get the location of the amplitude, wavelength, frequency, and time uniforms for wave  +++ brightness
        const amplitudeUniformLocation = gl.getUniformLocation(program, 'uAmplitude');
        const wavelengthUniformLocation = gl.getUniformLocation(program, 'uWavelength');
        const frequencyUniformLocation = gl.getUniformLocation(program, 'uFrequency');

        // Render the circles

        // Get color
        var color = gl.getUniformLocation(program, "uColor");


        let currentTime = Date.now();
        let deltaTime = (currentTime - startTime) / 1000.0;
        gl.uniform1f(gl.getUniformLocation(program, 'uTime'), deltaTime);
        gl.uniform1f(gl.getUniformLocation(program, 'uTimeAnother'), deltaTime);

        gl.uniform1f(amplitudeUniformLocation, amplitude);
        gl.uniform1f(wavelengthUniformLocation, wavelength);
        gl.uniform1f(frequencyUniformLocation, frequency);

        // --- Drawing the shapes ---


        // Red Rectangle

        gl.bindBuffer(gl.ARRAY_BUFFER, redRectangleBuffer);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(color, rgbRed);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 2 + 2 * COLUMNS);

        // First circle

        gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer1);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(color, rgbWhite);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments);

        // Second circle

        gl.bindBuffer(gl.ARRAY_BUFFER, circleBuffer2);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(color, rgbRed);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments);

        // Pentagon:

        gl.bindBuffer(gl.ARRAY_BUFFER, pentagonBuffer);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(color, rgbWhite);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegmentsPentagon);

        // Star triangle 1
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer1);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(color, rgbWhite);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

        // Star triangle 2
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer2);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(color, rgbWhite);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

        // Star triangle 3
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer3);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(color, rgbWhite);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

        // Star triangle 4
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer4);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(color, rgbWhite);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);

        // Star triangle 5
        gl.bindBuffer(gl.ARRAY_BUFFER, starTriangleBuffer5);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(color, rgbWhite);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
    }

    function DrawBlueRectangle() {
        gl.useProgram(programStill);

        vertexPositionStill = gl.getAttribLocation(programStill, "vPosition");
        gl.enableVertexAttribArray(vertexPositionStill);

        gl.bindBuffer(gl.ARRAY_BUFFER, blueRectangleBuffer);
        gl.vertexAttribPointer(vertexPositionStill, 2, gl.FLOAT, false, 0, 0);
        var colorBlue = gl.getUniformLocation(programStill, "uColor");
        gl.uniform3fv(colorBlue, [0.7, 0.9, 0.995]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    // --- SECOND PROGRAM ---

    SetupShadersStill();

    // Blue rectangle vertice definition

    var blueRectangleVertices = [
        -1.0, -1.0,
        -1.0, 1.0,
        1.0, 1.0,
        1.0, -1.0,
    ]

    // Assign blue rectangle buffer data
    var blueRectangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, blueRectangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(blueRectangleVertices), gl.STATIC_DRAW);

};

function SetupShadersStill() {
    programStill = initShaders(gl, "vertex-shader-background-rectangle", "fragment-shader-background-rectangle");
    gl.useProgram(programStill);
}

function CanvasSetup() {
    // --- Standart Project Setup ---

    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // -------------------------------------------------------------

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Blue color bg
    gl.clearColor(0, 255, 255, 255);
}



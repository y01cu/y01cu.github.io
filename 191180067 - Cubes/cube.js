"use strict";

// Set up canvas and context
var canvas;
var gl;

// Set number of vertices
var NumVertices = 36;

// Create arrays to store pointsFirstCube and colorsFirstCube
var pointsFirstCube = [];
var colorsFirstCube = [];
var pointsSecondCube = [];
var colorsSecondCube = [];

// Define axes
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

// Default rotation axis is x for first cube, y for second cube
var axis = 0;

// z axis in this case
var axisSecondCube = 2;

// Two different thetas required
var thetaFirstCube = [100, 200, 130];
var thetaSecondCube = [200, 300, 70];

// Location of theta in GPU
var thetaLoc;

// Enabling rotation based on boolean value
var isRotationEnabledFirstCube = true;
var isRotationEnabledSecondCube = true;

var program;

// rotation speed
var speed = 100;
var speedSecond = 100;

// Loggin speed value purposes
var speedValueParagraph;
var speedValueSecondParagraph;

// Enabling cube based on boolean value
var isFirstCubeEnabled = true;
var isSecondCubeEnabled = true;

var slider;

// Slider value variables for cubes
var sliderValueFirstCube;
var sliderValueSecondCube;

var scale = 1.0;       // initial scale
var isScalingEnabled = true;    // true if we're currently scaling
var scaleSpeed = 0.01; // how quickly the scale changes

// Scale Location about shaders I suppose
var scaleLoc;

// Vertex arrays

var verticesFirstCube;
var newScaledVerticesFirstCube;

var verticesSecondCube;
var newScaledVerticesSecondCube;

var vertexColors;

var vPosition;

// Enabling orbital rotation based on boolean value
var isOrbitalRotationEnabled = true;

var firstCubeRotationSpeed = 1.0;
var secondCubeRotationSpeed = 1.0;




// Initialization function to run on window load
window.onload = function init() {

    ApplyStandardSetup();

    AssignEventListenersForButtons();

    GetLocationOfSomeUniformsInGPU();

    EnableDepthTest();

    DefineVertexColors();


    DefineInitialVerticesFirstCube();
    DefineInitialVerticesSecondCubeAndTranslateThem();

    verticesFirstCube = ScaleVertices(verticesFirstCube, 0.2);

    RenderCubes();
}

function DefineInitialVerticesFirstCube() {
    verticesFirstCube = [
        vec4(-0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, 0.5, 0.5, 1.0),
        vec4(0.5, 0.5, 0.5, 1.0),
        vec4(0.5, -0.5, 0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5, 0.5, -0.5, 1.0),
        vec4(0.5, 0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];
}

function DefineInitialVerticesSecondCubeAndTranslateThem() {
    var size = 0.5;
    verticesSecondCube = [
        [-size, -size, size, 1.0],
        [-size, size, size, 1.0],
        [size, size, size, 1.0],
        [size, -size, size, 1.0],
        [-size, -size, -size, 1.0],
        [-size, size, -size, 1.0],
        [size, size, -size, 1.0],
        [size, -size, -size, 1.0]
    ];

    TranslateSecondCubeVertices(5, 5, 0);
}

function TranslateSecondCubeVertices(x, y, z,) {
    for (var i = 0; i < 8; i++) {
        verticesSecondCube[i][0] += x;
        verticesSecondCube[i][1] += y;
        verticesSecondCube[i][2] += z;
    };
}

function ScaleVertices(vertices, scale) {
    var scaledVertices = [];
    for (var i = 0; i < vertices.length; i++) {
        scaledVertices[i] = vec4(
            vertices[i][0] * scale,
            vertices[i][1] * scale,
            vertices[i][2] * scale,
            vertices[i][3] // Assuming w-coordinate should not change
        );
    }
    return scaledVertices;
}


function ApplyStandardSetup() {
    GetCanvasElement();
    SetUpWebGLContext();
    LoadShaders();
    ClearCanvas();
}

function SetUpWebGLContext() {
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
}

function GetCanvasElement() {
    canvas = document.getElementById("gl-canvas");
}

function EnableDepthTest() {
    gl.enable(gl.DEPTH_TEST);
}

function DefineVertexColors() {
    // Define vertex colorsFirstCube
    vertexColors = [
        [0.0, 0.0, 0.0, 1.0],  // black
        [1.0, 0.0, 0.0, 1.0],  // red
        [1.0, 1.0, 0.0, 1.0],  // yellow
        [0.0, 1.0, 0.0, 1.0],  // green
        [0.0, 0.0, 1.0, 1.0],  // blue
        [1.0, 0.0, 1.0, 1.0],  // magenta
        [0.0, 1.0, 1.0, 1.0],  // cyan
        [1.0, 1.0, 1.0, 1.0]   // white
    ];
}

function LoadShaders() {
    // We have nothing to do with more than one shader couple in this project
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
}

function GetLocationOfSomeUniformsInGPU() {
    thetaLoc = gl.getUniformLocation(program, "theta");
    scaleLoc = gl.getUniformLocation(program, "uScale");
}


function DefineViewport() {
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function ClearColor() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
}

function AssignVertexShaderScaleValue() {
    gl.uniform1f(scaleLoc, scale);
}

function EmptyVerticesArrays() {
    pointsFirstCube = [];
    pointsSecondCube = [];
}

function ClearCanvas() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function DrawTheTriangles() {
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);
}


function QuadAndFillArrays(a, b, c, d, pointsArray, colorsArray, verticeArray) {
    // Function to generate one face of the cube
    // We need to parition the QuadAndFillArrays into two triangles in order for
    // WebGL to be able to RenderCubes it.  In this case, we create two
    // triangles from the QuadAndFillArrays indices

    //vertex color assigned by the index of the vertex

    // I understood that these are two triangles from a given square
    var indices = [a, b, c, a, c, d];

    for (var i = 0; i < indices.length; ++i) {
        pointsArray.push(verticeArray[indices[i]]);
        // colorsFirstCube.push(vertexColors[indices[i]]);

        // for solid colored faces use
        colorsArray.push(vertexColors[a]);
    }
}

function AssignEventListenersForButtons() {

    // -- FIRST CUBE --

    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };

    document.getElementById("tButton").onclick = function () {
        isRotationEnabledFirstCube = !isRotationEnabledFirstCube;
    };

    document.getElementById("scalingButton").onclick = function () {
        isScalingEnabled = !isScalingEnabled;
    };

    speedValueParagraph = document.getElementById("speedValue");

    document.getElementById("slider").onchange = function (event) {

        sliderValueFirstCube = event.target.value;

        var absoluteSliderValueFirstCube = Math.abs(sliderValueFirstCube);

        firstCubeRotationSpeed = absoluteSliderValueFirstCube;

        speedValueParagraph.textContent = "Speed Value First: " + sliderValueFirstCube;
    };

    // --- SECOND CUBE --

    document.getElementById("xButtonSecond").onclick = function () {
        axisSecondCube = xAxis;
    };
    document.getElementById("yButtonSecond").onclick = function () {
        axisSecondCube = yAxis;
    };
    document.getElementById("zButtonSecond").onclick = function () {
        axisSecondCube = zAxis;
    };

    document.getElementById("tButtonSecond").onclick = function () {
        isRotationEnabledSecondCube = !isRotationEnabledSecondCube;
    };

    document.getElementById("orbitalRotationButton").onclick = function () {
        ChangeRotationPoint();

    };
    speedValueSecondParagraph = document.getElementById("speedValueSecond");

    document.getElementById("sliderSecond").onchange = function (event) {

        sliderValueSecondCube = event.target.value;

        var absoluteSliderValueSecondCube = Math.abs(sliderValueSecondCube);

        secondCubeRotationSpeed = absoluteSliderValueSecondCube;

        console.log("Second slider value: " + sliderValueSecondCube);

        speedValueSecondParagraph.textContent = "Speed Value Second: " + sliderValueSecondCube;
    };
}

function ChangeRotationPoint() {
    verticesSecondCube = ScaleVertices(verticesSecondCube, 10);
    TranslateSecondCubeVertices(-5, -5, 0);
    // axisSecondCube = (axisSecondCube + 1) % 3;

    // After translating it to origin and changing its rotation axis turn it back to the same point.

    verticesSecondCube = ScaleVertices(verticesSecondCube, 0.1);
    TranslateSecondCubeVertices(5, 5, 0);
    console.log("done!");
}


// Function to generate cube using quads
function ColorFirstCube() {
    // Generate six faces of the cube
    QuadAndFillArrays(1, 0, 3, 2, pointsFirstCube, colorsFirstCube, newScaledVerticesFirstCube);
    QuadAndFillArrays(2, 3, 7, 6, pointsFirstCube, colorsFirstCube, newScaledVerticesFirstCube);
    QuadAndFillArrays(3, 0, 4, 7, pointsFirstCube, colorsFirstCube, newScaledVerticesFirstCube);
    QuadAndFillArrays(6, 5, 1, 2, pointsFirstCube, colorsFirstCube, newScaledVerticesFirstCube);
    QuadAndFillArrays(4, 5, 6, 7, pointsFirstCube, colorsFirstCube, newScaledVerticesFirstCube);
    QuadAndFillArrays(5, 4, 0, 1, pointsFirstCube, colorsFirstCube, newScaledVerticesFirstCube);
}

function ColorSecondCube() {
    // Generate six faces of the cube
    QuadAndFillArrays(1, 0, 3, 2, pointsSecondCube, colorsFirstCube, verticesSecondCube);
    QuadAndFillArrays(2, 3, 7, 6, pointsSecondCube, colorsFirstCube, verticesSecondCube);
    QuadAndFillArrays(3, 0, 4, 7, pointsSecondCube, colorsFirstCube, verticesSecondCube);
    QuadAndFillArrays(6, 5, 1, 2, pointsSecondCube, colorsFirstCube, verticesSecondCube);
    QuadAndFillArrays(4, 5, 6, 7, pointsSecondCube, colorsFirstCube, verticesSecondCube);
    QuadAndFillArrays(5, 4, 0, 1, pointsSecondCube, colorsFirstCube, verticesSecondCube);
}

// Function to render the cube
function RenderCubes() {

    EmptyVerticesArrays();

    SetScaleValueIfEnabled();


    if (isOrbitalRotationEnabled) {
        // StartSecondCube();
        DefineInitialVerticesSecondCubeAndTranslateThem();
        UpdateRotationAngleAndSetUniformValueSecondCube();

    }

    newScaledVerticesFirstCube = ScaleVertices(verticesFirstCube, scale);
    verticesSecondCube = ScaleVertices(verticesSecondCube, 0.1);

    AssignVertexShaderScaleValue();
    UpdateRotationAngleAndSetUniformValueFirstCube();

    LinkPositionVariableAndDraw();

    ColorFirstCube();
    ColorSecondCube();

    CreateBindAndAssignBufferValuesForColors();
    LinkColorVariables();
    if (isFirstCubeEnabled) {
        DrawFirstCube();
    }
    if (isSecondCubeEnabled) {
        DrawSecondCube();
    }

    requestAnimFrame(RenderCubes);
}


function SetScaleValueIfEnabled() {
    if (isScalingEnabled) {
        scale = 1.0 + 0.5 * Math.sin(scaleSpeed * Date.now());
    }
}

function UpdateRotationAngleAndSetUniformValueFirstCube() {

    if (isRotationEnabledFirstCube) {
        if (sliderValueFirstCube > 0) {
            thetaFirstCube[axis] += firstCubeRotationSpeed;
        }
        if (sliderValueFirstCube < 0) {
            thetaFirstCube[axis] -= firstCubeRotationSpeed;
        }
    }
}

function UpdateRotationAngleAndSetUniformValueSecondCube() {
    if (isRotationEnabledSecondCube) {
        if (sliderValueSecondCube > 0) {
            thetaSecondCube[axisSecondCube] += secondCubeRotationSpeed;
        }
        if (sliderValueSecondCube < 0) {
            thetaSecondCube[axisSecondCube] -= secondCubeRotationSpeed;
        }
    }
}

function CreateBindAndAssignBufferValuesForColors() {
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsFirstCube), gl.STATIC_DRAW);
}

function LinkColorVariables() {
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
}

function DrawFirstCube() {

    var vertexBufferFirstCube = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferFirstCube);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsFirstCube), gl.STATIC_DRAW);
    gl.uniform3fv(thetaLoc, thetaFirstCube);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    DrawTheTriangles();

}

function DrawSecondCube() {
    var vertexBufferSecondCube = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferSecondCube);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsSecondCube), gl.STATIC_DRAW);
    gl.uniform3fv(thetaLoc, thetaSecondCube);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    DrawTheTriangles();
}

function LinkPositionVariableAndDraw() {
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vPosition);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
}




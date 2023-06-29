var program;
var vertexPosition;
var canvas;


window.onload = function () {

    const vsSource = `
    attribute vec4 a_position;
    void main(){
        gl_Position = a_position;
    }
    `;

    const fsSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main(){
        gl_FragColor = u_color;
    }
    `;

    canvas = document.getElementById('canvas');
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.2, 0.5, 1.0);

    var backgroundVertices = [];

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    program = initShaders(gl, 'vertexShader', 'fragmentShader');

    var backgroundVertices = [
        -1.0, -1.0,
        -1.0, 1.0,
        1.0, 1.0,
        1.0, -1.0,
    ];

    var backgroundBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, backgroundBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, backgroundVertices, gl.STATIC_DRAW);

    function render() {
        DrawBackground();
        gl.flush();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function DrawBackground() {
        gl.useProgram(program);
        vertexPosition = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(vertexPosition);
        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        var color = gl.getUniformLocation(program, "u_color");
        gl.uniform4fv(color, [0.6, 0.3, 0.5, 1.0]);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 3);
    }
}


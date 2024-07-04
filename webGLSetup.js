function showErrors(errorText) {
  const errorBoxDiv = document.getElementById("error-box");
  const errorTextElement = document.createElement("p");
  errorTextElement.innerHTML = errorText;
  errorBoxDiv.appendChild(errorTextElement);
  console.error(errorText);
}

showErrors("This is an error message");

function animatedShapes() {
  const canvas = document.getElementById("animated-shapes-canvas");
  if (!canvas) {
    showErrors("Canvas element not found");
    return;
  }
  // webGL2 rendering context
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    showErrors("WebGL2 not supported in this browser");
    return;
  }

  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  // clear both buffers
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/*
 * Define our triangle vertices GPU-friendly data types
 * Create a GPU memory buffer, and fill it up with our triangle data
 * Define vertex shader code, compile it, and send it to the GPU
 * Define fragment shader code, compile it, and send it to the GPU
 */
function firstTriangle() {
  const canvas = document.getElementById("triangle-canvas");
  const gl = getContextAndClearBuffers(canvas);

  const triangleVertices = [
    0.0,
    0.5, // top middle
    -0.5,
    -0.5, // bottom left
    0.5,
    -0.5, // bottom right
  ];

  // put it in a format that webGl preferes
  const triangleVerticesCpuBuffer = new Float32Array(triangleVertices);

  const triangleBuffer = gl.createBuffer();

  // specify the type of attachment of our buffer (here vertex data)
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
  // STATIC_DRAW: the data will be uploaded once (the gpu need this information to store it in the right place in memory)
  gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesCpuBuffer, gl.STATIC_DRAW);

  // Creating a Vertex Shader
  // A Vertex Shader's job is to generate clip space coordinates. It always takes the form
  //Shader code is written in GLSL, the OpenGLShading Language.
  const vertexShaderSourceCode = `#version 300 es
  precision mediump float;
     in vec2 vertexPosition;



    void main() {
        gl_Position = vec4(vertexPosition, 0.0, 1.0);
    }`;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSourceCode);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const errorMessage = gl.getShaderInfoLog(vertexShader);
    showErrors(`Failed to compile vertex shader: ${errorMessage}`);
    return;
  }

  //Creating a Fragment Shader
  //A Fragment Shader's job is to provide a color for the current pixel being rasterized.

  const fragmentShaderSourceCode = `#version 300 es
  precision mediump float;
  
  out vec4 outputColor;

  void main() {
    outputColor = vec4(0.294, 0.0, 0.51, 1.0);
  }`;

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const errorMessage = gl.getShaderInfoLog(fragmentShader);
    showErrors(`Failed to compile fragment shader: ${errorMessage}`);
    return;
  }

  // combine shaders into a program
  const triangleProgram = gl.createProgram();
  gl.attachShader(triangleProgram, vertexShader);
  gl.attachShader(triangleProgram, fragmentShader);
  gl.linkProgram(triangleProgram);
  if (!gl.getProgramParameter(triangleProgram, gl.LINK_STATUS)) {
    const errorMessage = gl.getProgramInfoLog(triangleProgram);
    showErrors(`Failed to link GPU program: ${errorMessage}`);
    return;
  }

  const vertexPositionAttributeLocation = gl.getAttribLocation(
    triangleProgram,
    "vertexPosition"
  );
  if (vertexPositionAttributeLocation < 0) {
    showErrors(`Failed to get attribute location for vertexPosition`);
    return;
  }

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Rasterizer (which output pixels are covered by a triangle?)
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Set up GPU program
  // Vertex shader (where to put vertex on the screen, in clip space?)
  // Fragment shader (what color should a pixel be?)
  gl.useProgram(triangleProgram);
  gl.enableVertexAttribArray(vertexPositionAttributeLocation);

  // Input assembler (how to read vertex information from buffers?)
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
  gl.vertexAttribPointer(
    /* index: vertex attrib location */
    vertexPositionAttributeLocation,
    /* size: number of components in the attribute */
    2,
    /* type: type of data in the GPU buffer for this attribute */
    gl.FLOAT,
    /* normalized: if type=float and is writing to a vec(n) float input, should WebGL normalize the ints first? */
    false,
    /* stride: bytes between starting byte of attribute for a vertex and the same attrib for the next vertex */
    2 * Float32Array.BYTES_PER_ELEMENT,
    /* offset: bytes between the start of the buffer and the first byte of the attribute */
    0
  );

  // Draw call (Primitive assembly (which vertices form triangles together?))
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function getContextAndClearBuffers(canvas) {
  if (!canvas) {
    showErrors("Canvas element not found");
    return;
  }
  // webGL2 rendering context
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    showErrors("WebGL2 not supported in this browser");
    return;
  }

  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  // clear both buffers
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  return gl;
}

try {
  firstTriangle();
} catch (error) {
  showErrors(`javascript exception  : ${error}`);
}

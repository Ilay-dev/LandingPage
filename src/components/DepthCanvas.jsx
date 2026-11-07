import React, { useEffect, useRef, useState } from 'react';

function loadTexture(gl, url) {
  return new Promise((resolve) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    );

    const img = new Image();
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        img
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      resolve({ tex, w: img.width, h: img.height });
    };
    img.onerror = () => {
      console.warn('Could not load texture:', url);
      resolve({ tex, w: 1, h: 1 });
    };
    img.src = url;
  });
}

function createProgram(gl, vsSrc, fsSrc) {
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsSrc);
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsSrc);
  gl.compileShader(fs);

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  return prog;
}

export default function DepthCanvas({ src, depthSrc, alt, pointerRef }) {
  const canvasRef = useRef(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      setWebglFailed(true);
      return;
    }

    let isCancelled = false;
    let rafId = null;

    const vsSource = `
      attribute vec2 a_pos;
      attribute vec2 a_uv;
      varying vec2 v_uv;
      void main() {
        gl_Position = vec4(a_pos, 0.0, 1.0);
        v_uv = vec2(a_uv.x, 1.0 - a_uv.y);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform sampler2D u_img;
      uniform sampler2D u_depth;
      uniform vec2 u_offset;
      varying vec2 v_uv;
      void main() {
        vec2 uv = (v_uv - 0.5) * 0.95 + 0.5;
        float depth = texture2D(u_depth, uv).r;
        uv += u_offset * (depth - 0.5) * 0.04;
        gl_FragColor = texture2D(u_img, uv);
      }
    `;

    const prog = createProgram(gl, vsSource, fsSource);
    gl.useProgram(prog);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      ]),
      gl.STATIC_DRAW
    );

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
      ]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(prog, 'a_pos');
    const uvLoc = gl.getAttribLocation(prog, 'a_uv');
    const offsetLoc = gl.getUniformLocation(prog, 'u_offset');

    gl.uniform1i(gl.getUniformLocation(prog, 'u_img'), 0);
    gl.uniform1i(gl.getUniformLocation(prog, 'u_depth'), 1);

    const lastDot = src.lastIndexOf('.');
    const resolvedDepthSrc =
      depthSrc || `${src.substring(0, lastDot)}_deph.png`;

    Promise.all([
      loadTexture(gl, src),
      loadTexture(gl, resolvedDepthSrc),
    ]).then(([imgData, depthData]) => {
      if (isCancelled) return;

      canvas.width = imgData.w;
      canvas.height = imgData.h;
      gl.viewport(0, 0, imgData.w, imgData.h);

      const renderLoop = () => {
        if (isCancelled) return;

        gl.useProgram(prog);

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.enableVertexAttribArray(uvLoc);
        gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

        const { currentX, currentY } = pointerRef.current;
        gl.uniform2f(offsetLoc, currentX, currentY);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, imgData.tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, depthData.tex);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        rafId = requestAnimationFrame(renderLoop);
      };

      renderLoop();
    });

    return () => {
      isCancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [src, depthSrc, pointerRef]);

  if (webglFailed) {
    return <img className="gallery-item" src={src} alt={alt} />;
  }

  return <canvas ref={canvasRef} className="gallery-item" aria-label={alt} />;
}


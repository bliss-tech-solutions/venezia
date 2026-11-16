/**
 * Minimal, dependency-free equirectangular (2:1) panorama renderer.
 * A single full-screen triangle; the fragment shader casts a ray per pixel
 * and samples the panorama — perfectly straight lines, no sphere mesh seams.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uYaw;
uniform float uPitch;
uniform float uFov;
uniform float uAspect;
const float PI = 3.141592653589793;
void main() {
  float t = tan(uFov * 0.5);
  vec3 d = normalize(vec3(vUv.x * t * uAspect, vUv.y * t, -1.0));
  float cp = cos(uPitch), sp = sin(uPitch);
  d = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);
  float cy = cos(uYaw), sy = sin(uYaw);
  d = vec3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy);
  float lon = atan(d.x, -d.z);
  float lat = asin(clamp(d.y, -1.0, 1.0));
  vec2 uv = vec2(fract(lon / (2.0 * PI) + 0.5), 0.5 - lat / PI);
  gl_FragColor = texture2D(uTex, uv);
}`;

export type View = { yaw: number; pitch: number; fov: number };

export class PanoRenderer {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private tex: WebGLTexture | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private canvas: HTMLCanvasElement;
  hasImage = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) throw new Error("WebGL is not available on this device");
    this.gl = gl;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link error");
    this.prog = prog;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const n of ["uTex", "uYaw", "uPitch", "uFov", "uAspect"]) this.u[n] = gl.getUniformLocation(prog, n);
  }

  setImage(img: HTMLImageElement) {
    const gl = this.gl;
    const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    let source: TexImageSource = img;
    if (img.naturalWidth > max) {
      // downscale very large panoramas for older GPUs
      const c = document.createElement("canvas");
      c.width = max;
      c.height = max / 2;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      source = c;
    }
    if (!this.tex) this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    // No mipmaps: avoids the seam at the 0/360° wrap and works for non-power-of-two images
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.hasImage = true;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(this.canvas.clientWidth * dpr);
    const h = Math.round(this.canvas.clientHeight * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }

  render(v: View) {
    if (!this.hasImage || !this.tex) return;
    const gl = this.gl;
    this.resize();
    if (this.canvas.width === 0 || this.canvas.height === 0) return;
    gl.useProgram(this.prog);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.uniform1i(this.u.uTex, 0);
    gl.uniform1f(this.u.uYaw, v.yaw);
    gl.uniform1f(this.u.uPitch, v.pitch);
    gl.uniform1f(this.u.uFov, v.fov);
    const aspect = this.canvas.height > 0 ? this.canvas.width / this.canvas.height : 1;
    gl.uniform1f(this.u.uAspect, aspect);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose() {
    const gl = this.gl;
    if (this.tex) {
      gl.deleteTexture(this.tex);
      this.tex = null;
    }
    if (this.prog) {
      gl.deleteProgram(this.prog);
    }
    this.hasImage = false;
  }
}

/** Load an image for WebGL, trying each URL in turn (local file first, then CDN). */
export function loadImage(urls: (string | undefined)[]): Promise<HTMLImageElement> {
  const validUrls = urls.filter((u): u is string => Boolean(u && u.trim()));
  return new Promise((resolve, reject) => {
    const tryAt = (i: number) => {
      if (i >= validUrls.length) return reject(new Error("Panorama could not be loaded"));
      const url = validUrls[i];
      const img = new Image();
      const isRemote = url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
      if (isRemote) {
        img.crossOrigin = "anonymous";
      }
      img.decoding = "async";
      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve(img);
        } else {
          tryAt(i + 1);
        }
      };
      img.onerror = () => tryAt(i + 1);
      img.src = url;
      if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        resolve(img);
      }
    };
    tryAt(0);
  });
}

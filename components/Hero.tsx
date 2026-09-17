'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let animId: number

    const init = async () => {
      const THREE = await import('three')
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
      renderer.setClearColor(0x000000, 0)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(65, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000)
      camera.position.z = 75

      const COUNT = 2200
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(COUNT * 3)
      const col = new Float32Array(COUNT * 3)
      const sz = new Float32Array(COUNT)
      const goldC = new THREE.Color(0xC9A84C)
      const dimC = new THREE.Color(0x1a1510)

      for (let i = 0; i < COUNT; i++) {
        const r = 50 + Math.random() * 90
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        pos[i * 3 + 2] = (Math.random() - 0.5) * 80
        const isGold = Math.random() > 0.82
        const c = isGold ? goldC : dimC
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
        sz[i] = isGold ? Math.random() * 2.2 + 0.8 : Math.random() * 0.8 + 0.2
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
      geo.setAttribute('size', new THREE.BufferAttribute(sz, 1))

      const mat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          void main() {
            vColor = color;
            vec3 p = position;
            p.x += sin(time * 0.25 + p.y * 0.04) * 1.2;
            p.y += cos(time * 0.18 + p.x * 0.04) * 0.9;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = size * (260.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float a = 1.0 - smoothstep(0.2, 0.5, d);
            float glow = exp(-d * 5.0) * 0.35;
            gl_FragColor = vec4(vColor + glow * vColor, a * 0.9);
          }
        `,
        transparent: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })

      const points = new THREE.Points(geo, mat)
      scene.add(points)

      const gGeo = new THREE.PlaneGeometry(220, 120, 28, 14)
      const gMat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          uniform float time;
          varying float vFade;
          void main() {
            vec3 p = position;
            p.z += sin(p.x * 0.06 + time * 0.5) * 2.0 + cos(p.y * 0.08 + time * 0.4) * 1.5;
            vFade = 1.0 - length(p.xy) / 110.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          varying float vFade;
          void main() {
            float a = clamp(vFade, 0.0, 1.0) * 0.1;
            gl_FragColor = vec4(0.788, 0.659, 0.298, a);
          }
        `,
        transparent: true,
        wireframe: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const grid = new THREE.Mesh(gGeo, gMat)
      grid.rotation.x = -Math.PI / 2.4
      grid.position.y = -38
      grid.position.z = -10
      scene.add(grid)

      let mx = 0, my = 0, tmx = 0, tmy = 0
      const onMouse = (e: MouseEvent) => {
        tmx = (e.clientX / window.innerWidth - 0.5) * 2
        tmy = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMouse)

      const onResize = () => {
        if (!canvas) return
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      const clock = new THREE.Clock()
      const animate = () => {
        animId = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()
        mx += (tmx - mx) * 0.04
        my += (tmy - my) * 0.04
        points.rotation.y = t * 0.035 + mx * 0.12
        points.rotation.x = my * 0.07
        mat.uniforms.time.value = t
        gMat.uniforms.time.value = t
        camera.position.x += (mx * 5 - camera.position.x) * 0.03
        camera.position.y += (my * 3 - camera.position.y) * 0.03
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        window.removeEventListener('mousemove', onMouse)
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animId)
        renderer.dispose()
      }
    }

    const cleanup = init()
    return () => { cleanup.then(fn => fn?.()) }
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,rgba(201,168,76,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 lg:px-14 pt-28 pb-20">
        <div className="max-w-3xl">
          <div className="section-kicker mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Human Intelligence Inside Web3
          </div>
          <div className="mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}>
            <Image src="/images/logo.jpg" alt="Uncensored Grills logo" width={120} height={120} className="object-contain" />
          </div>
          <h1 className="opacity-0 animate-fade-up" style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}>
            <span className="display-heading block text-[clamp(4.5rem,13vw,11rem)]">Unchained</span>
            <span className="display-heading block text-[clamp(4.5rem,13vw,11rem)]" style={{ color: 'transparent', WebkitTextStroke: '2px #C9A84C' }}>
              Grills.
            </span>
          </h1>
          <p className="mt-8 text-[1.05rem] leading-relaxed text-cream-dim max-w-xl font-light opacity-0 animate-fade-up" style={{ animationDelay: '0.75s', animationFillMode: 'forwards' }}>
            The place where the people shaping Web3 and internet culture come to talk, discover, debate, and connect.
          </p>
          <div className="flex flex-wrap gap-4 mt-10 opacity-0 animate-fade-up" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
            {/* Scrolls down to the Episodes section */}
            <a href="#episodes" className="btn-gold">▶ &nbsp;Watch Episodes</a>
            <a href="#guest-form" className="btn-outline">Apply as Guest →</a>
          </div>
        </div>

        <div className="absolute bottom-10 left-6 lg:left-14 flex items-center gap-3 opacity-0 animate-fade-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <div className="w-px h-14 bg-gradient-to-b from-gold to-transparent" />
          <span className="font-mono text-[0.52rem] tracking-[0.24em] uppercase text-cream-ghost">Scroll</span>
        </div>

        <div className="hidden lg:flex absolute right-14 bottom-14 flex-col gap-6 text-right opacity-0 animate-fade-up" style={{ animationDelay: '1.1s', animationFillMode: 'forwards' }}>
          {[{ n: '4', l: 'Episodes' }, { n: '4', l: 'Guests Grilled' }, { n: '1', l: 'Show. Real Talk.' }].map((s) => (
            <div key={s.l}>
              <span className="font-display text-[2.6rem] text-gold leading-none block">{s.n}</span>
              <span className="font-mono text-[0.52rem] tracking-[0.2em] uppercase text-cream-ghost">{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

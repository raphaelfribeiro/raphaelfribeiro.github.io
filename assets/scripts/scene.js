/**
 * scene.js
 *
 * Responsibility: Procedurally populate the dev SVG with stars and dust.
 *
 * The static parts of the scene (frame, earth, laptop, character) live
 * in markup. This module fills the empty <g> placeholders with hundreds
 * of tiny <rect> elements distributed via the golden-ratio sequence
 * (avoids visual clumping without needing rejection sampling).
 *
 * No imports from other app modules — purely a DOM-level visual helper.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const PHI = 0.6180339887;

/**
 * Append `count` 1- or 2-px star rects inside the element with id `parentId`.
 * @param {string} parentId        - <g> placeholder id inside the SVG.
 * @param {number} count           - how many stars to add.
 * @param {object} opts
 * @param {number} opts.w          - usable width (svg units).
 * @param {number} opts.h          - usable height.
 * @param {number} opts.ox         - x offset from svg origin.
 * @param {number} opts.oy         - y offset from svg origin.
 * @param {number} opts.seed       - 0–1, picks the deterministic sequence.
 * @param {number} [opts.size]     - star side length in svg units. Default 1.
 * @param {boolean} [opts.twinkle] - apply the `tw` keyframe animation.
 */
export function fillStars(parentId, count, opts) {
  const parent = document.getElementById(parentId);
  if (!parent) return;

  let xs = opts.seed;
  let ys = (opts.seed * 1.7) % 1;
  const size = opts.size || 1;

  for (let i = 0; i < count; i++) {
    xs = (xs + PHI) % 1;
    ys = (ys + PHI * 1.13) % 1;

    const x = opts.ox + Math.floor(xs * opts.w);
    const y = opts.oy + Math.floor(ys * opts.h);

    const r = document.createElementNS(SVG_NS, 'rect');
    r.setAttribute('x', x);
    r.setAttribute('y', y);
    r.setAttribute('width', size);
    r.setAttribute('height', size);
    r.setAttribute('fill', '#fff');
    r.setAttribute('opacity', 0.5 + (i % 4) * 0.12);

    if (opts.twinkle) {
      const dur = 2 + (i % 5) * 0.7;
      const delay = (i % 7) * 0.4;
      r.setAttribute(
        'style',
        `animation: tw ${dur}s ease-in-out infinite; animation-delay: ${delay}s`
      );
    }

    parent.appendChild(r);
  }
}

/**
 * Append cosmic-dust pixels (single-px greyish dots) inside `parentId`.
 * The parent group is expected to carry the `dustDrift` keyframe.
 */
export function fillDust(parentId, count, opts) {
  const parent = document.getElementById(parentId);
  if (!parent) return;

  let xs = 0.17;
  let ys = 0.43;

  for (let i = 0; i < count; i++) {
    xs = (xs + PHI * 1.27) % 1;
    ys = (ys + PHI * 0.91) % 1;

    // +100 so dust extends beyond the right edge — covers the drift animation.
    const x = opts.ox + Math.floor(xs * (opts.w + 100));
    const y = opts.oy + Math.floor(ys * opts.h);

    const r = document.createElementNS(SVG_NS, 'rect');
    r.setAttribute('x', x);
    r.setAttribute('y', y);
    r.setAttribute('width', 1);
    r.setAttribute('height', 1);
    r.setAttribute('fill', '#aab4c8');
    r.setAttribute('opacity', 0.18 + (i % 3) * 0.08);
    parent.appendChild(r);
  }
}

/** Inject multiple shooting stars into the clipped viewport group at different positions and speeds. */
function spawnShootingStars(clipGroup) {
  const stars = [
    { x: 50,  y: 100,dur: 10,  delay: 2   },
    { x: 90,  y: 52, dur: 8,  delay: 0   },
    { x: 175, y: 38, dur: 11, delay: 1.5 },
    { x: 250, y: 62, dur: 7,  delay: 4   },
    { x: 130, y: 78, dur: 13, delay: 7   },
    { x: 310, y: 44, dur: 9,  delay: 2.5 },
    { x: 100, y: 50, dur: 10, delay: 3   },
    { x: 50,  y: 10, dur: 13, delay: 5  },
    { x: 80,  y: 20, dur: 9,  delay: 6  },
    { x: 100, y: 40, dur: 10, delay: 7  },
    { x: 70,  y: 40, dur: 8,  delay: 6  },
  ];

  for (const s of stars) {
    const g = document.createElementNS(SVG_NS, 'g');
    g.style.cssText = `animation: shootStar ${s.dur}s ease-out infinite; animation-delay: ${s.delay}s`;

    const head = document.createElementNS(SVG_NS, 'rect');
    head.setAttribute('x', s.x);
    head.setAttribute('y', s.y);
    head.setAttribute('width', '5');
    head.setAttribute('height', '1');
    head.setAttribute('fill', '#fff');

    const tail = document.createElementNS(SVG_NS, 'rect');
    tail.setAttribute('x', s.x - 5);
    tail.setAttribute('y', s.y);
    tail.setAttribute('width', '3');
    tail.setAttribute('height', '1');
    tail.setAttribute('fill', '#fff');
    tail.setAttribute('opacity', '0.5');

    g.appendChild(head);
    g.appendChild(tail);
    clipGroup.appendChild(g);
  }
}

/** Populate the dev scene with its background layers. */
export function initScene() {
  const viewport = { w: 500, h: 220, ox: 80, oy: 30 };

  fillStars('scene-stars-bg', 120, { ...viewport, seed: 0.29, size: 1 });
  fillStars('scene-stars-fg', 22, { ...viewport, seed: 0.67, size: 2, twinkle: true });
  fillDust('scene-dust', 36, viewport);

  const clipGroup = document.querySelector('[clip-path="url(#windowScene)"]');
  if (clipGroup) spawnShootingStars(clipGroup);
}

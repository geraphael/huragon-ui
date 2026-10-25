// Mathematical utilities for High-Craft SVG Charts & Graphs

/**
 * Format number as currency string.
 * @param {number} value
 * @param {string} symbol - default '$'
 * @returns {string} e.g. "$45,231.89"
 */
export function formatCurrency(value, symbol = '$') {
  if (value === undefined || value === null || isNaN(value)) return `${symbol}0.00`;
  const parts = Number(value).toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${symbol}${parts.join('.')}`;
}

/**
 * Scale data values into SVG viewport coordinates.
 * @param {number[]} values - raw numerical values
 * @param {{width: number, height: number, padLeft?: number, padRight?: number, padTop?: number, padBottom?: number, minVal?: number, maxVal?: number}} viewport
 * @returns {Array<{x: number, y: number, value: number, index: number}>}
 */
export function scaleToViewport(values, viewport) {
  if (!values || values.length === 0) return [];
  const {
    width,
    height,
    padLeft = 30,
    padRight = 20,
    padTop = 20,
    padBottom = 30
  } = viewport;

  const min = viewport.minVal !== undefined ? viewport.minVal : Math.min(...values) * 0.85;
  const max = viewport.maxVal !== undefined ? viewport.maxVal : Math.max(...values) * 1.15;
  const range = max - min || 1;

  const usableWidth = width - padLeft - padRight;
  const usableHeight = height - padTop - padBottom;
  const stepX = values.length > 1 ? usableWidth / (values.length - 1) : 0;

  return values.map((val, idx) => {
    const x = padLeft + idx * stepX;
    const norm = (val - min) / range;
    const y = padTop + (1 - norm) * usableHeight;
    return { x, y, value: val, index: idx };
  });
}

/**
 * Generate smooth Catmull-Rom spline SVG path d attribute from array of points.
 * @param {Array<{x: number, y: number}>} points
 * @param {number} tension - 0 to 1, default 0.35
 * @returns {string} SVG path d attribute (e.g. "M x0,y0 C cp1x,cp1y cp2x,cp2y x1,y1 ...")
 */
export function catmullRomPath(points, tension = 0.35) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)},${points[1].y.toFixed(1)}`;
  }

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + ((p2.x - p0.x) / 6) * (1 - tension + 0.35);
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * (1 - tension + 0.35);

    const cp2x = p2.x - ((p3.x - p1.x) / 6) * (1 - tension + 0.35);
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * (1 - tension + 0.35);

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  return d;
}

/**
 * Generate closed area SVG path below the Catmull-Rom spline down to baseline.
 * @param {Array<{x: number, y: number}>} points
 * @param {number} baselineY - bottom y coordinate (e.g. height - padBottom)
 * @param {number} tension - default 0.35
 * @returns {string} SVG path d attribute
 */
export function catmullRomAreaPath(points, baselineY, tension = 0.35) {
  if (!points || points.length === 0) return '';
  const curve = catmullRomPath(points, tension);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  return `${curve} L ${lastPoint.x.toFixed(1)},${baselineY.toFixed(1)} L ${firstPoint.x.toFixed(1)},${baselineY.toFixed(1)} Z`;
}

/**
 * Calculate SVG annular sector arc path for donut and pie charts.
 * @param {number} cx - center x
 * @param {number} cy - center y
 * @param {number} rInner - inner radius (0 for pie, >0 for donut)
 * @param {number} rOuter - outer radius
 * @param {number} startAngle - start angle in radians (0 at 12 o'clock)
 * @param {number} endAngle - end angle in radians
 * @returns {string} SVG path d attribute
 */
export function arcPath(cx, cy, rInner, rOuter, startAngle, endAngle) {
  // Rotate so 0 rad is at 12 o'clock (-PI/2)
  const a0 = startAngle - Math.PI / 2;
  const a1 = endAngle - Math.PI / 2;

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  const x0Outer = cx + rOuter * Math.cos(a0);
  const y0Outer = cy + rOuter * Math.sin(a0);
  const x1Outer = cx + rOuter * Math.cos(a1);
  const y1Outer = cy + rOuter * Math.sin(a1);

  if (rInner <= 0) {
    // Pie slice
    return `M ${cx},${cy} L ${x0Outer.toFixed(2)},${y0Outer.toFixed(2)} A ${rOuter},${rOuter} 0 ${largeArcFlag} 1 ${x1Outer.toFixed(2)},${y1Outer.toFixed(2)} Z`;
  }

  // Donut arc segment
  const x0Inner = cx + rInner * Math.cos(a1);
  const y0Inner = cy + rInner * Math.sin(a1);
  const x1Inner = cx + rInner * Math.cos(a0);
  const y1Inner = cy + rInner * Math.sin(a0);

  return [
    `M ${x0Outer.toFixed(2)},${y0Outer.toFixed(2)}`,
    `A ${rOuter},${rOuter} 0 ${largeArcFlag} 1 ${x1Outer.toFixed(2)},${y1Outer.toFixed(2)}`,
    `L ${x0Inner.toFixed(2)},${y0Inner.toFixed(2)}`,
    `A ${rInner},${rInner} 0 ${largeArcFlag} 0 ${x1Inner.toFixed(2)},${y1Inner.toFixed(2)}`,
    'Z'
  ].join(' ');
}

/**
 * Find index of nearest data point along the X axis.
 * @param {number} mouseX - coordinate in SVG viewBox space
 * @param {Array<{x: number}>} points
 * @returns {number} index of closest point
 */
export function findNearestPoint(mouseX, points) {
  if (!points || points.length === 0) return -1;
  let closestIdx = 0;
  let minDiff = Math.abs(points[0].x - mouseX);
  for (let i = 1; i < points.length; i++) {
    const diff = Math.abs(points[i].x - mouseX);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }
  return closestIdx;
}

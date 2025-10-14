const mapImg = document.getElementById('mainMap');
const canvas = document.getElementById('highlightCanvas');
const ctx = canvas.getContext('2d');
const areas = Array.from(document.querySelectorAll('#imageMap area'));
const list = document.getElementById('locationList');

function resizeCanvas() {
  const rect = mapImg.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
window.addEventListener('resize', resizeCanvas);
mapImg.addEventListener('load', resizeCanvas);

function drawArea(area) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const coords = area.coords.split(',').map(Number);
  ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';

  const scaleX = canvas.width / mapImg.naturalWidth;
  const scaleY = canvas.height / mapImg.naturalHeight;

  ctx.beginPath();
  if (area.shape === 'rect') {
    const [x1, y1, x2, y2] = coords;
    ctx.rect(x1 * scaleX, y1 * scaleY, (x2 - x1) * scaleX, (y2 - y1) * scaleY);
  } else if (area.shape === 'poly') {
    ctx.moveTo(coords[0] * scaleX, coords[1] * scaleY);
    for (let i = 2; i < coords.length; i += 2)
      ctx.lineTo(coords[i] * scaleX, coords[i + 1] * scaleY);
    ctx.closePath();
  }
  ctx.fill();
}

areas.forEach((area, i) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.textContent = area.alt;
  a.href = '#';
  a.addEventListener('click', (e) => {
    e.preventDefault();
    selectArea(i);
  });
  li.appendChild(a);
  list.appendChild(li);

  area.addEventListener('mouseenter', () => selectArea(i));
});

let current = null;
function selectArea(index) {
  if (current === index) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    current = null;
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    return;
  }
  current = index;
  drawArea(areas[index]);
  document.querySelectorAll('.sidebar li').forEach((li, i) => {
    li.classList.toggle('active', i === index);
  });
}

function calculate_window_offset_y(o) {
  let x = 0;
  let y = 0;
  while (o) {
    y += o.offsetTop;
    o = o.offsetParent;
  }
  return y
}

function move(block, to) {

  let timerMove = null;

  to = to || to === 0 ? to : (block.scrollHeight ? block.scrollHeight : Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  )) - (block.offsetHeight ? block.offsetHeight : window.innerHeight);
  clearInterval(timerMove);
  let distance = to - (block.scrollTop ? block.scrollTop : window.pageYOffset);
  if (distance === 0) return;
  let iter = 0;
  let steps = Math.round(500 / 13);
  let pos = [(block.scrollTop ? block.scrollTop : window.pageYOffset)];
  let stepPix = (distance * 2) / steps;
  let coof = stepPix / (steps / 2);
  for (let i = 0; i < steps; i++) {
    if (i < (steps / 2)) {
      pos.push(Math.round(pos[pos.length - 1] + coof * i));
    } else {
      pos.push(Math.round(pos[pos.length - 1] + coof * ((steps / 2) - i + (steps / 2))));
    }
  }


  let setScrollPos = block.scrollTop !== undefined
    ? to => block.scrollTop = to
    : to => window.scrollTo(0, to);

  timerMove = setInterval(() => {
    if (iter >= steps) {
      clearInterval(timerMove);
      setScrollPos(to)
    } else {
      setScrollPos(pos[++iter])
    }
  }, 13);
}

function setScrollListeners() {
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    let href = link.getAttribute('href') || '';
    if (link.target !== '_blank' && (new RegExp(location.pathname + '\#.').test(href) || href.indexOf('#') === 0)) {
      const id = href.split('#')[1];
      if (location.search) {
        href = location.pathname + location.search + '#' + id;
        link.setAttribute('href', href);
      }
      link.addEventListener('click', e => {
        e.preventDefault();
        const node = document.getElementById(id);
        if (node) {
          move(window, calculate_window_offset_y(node));
          setTimeout(() => {
            location.replace(href);
          }, 310);
        }
      })
    }
  }
}

module.exports = setScrollListeners;
module.exports.default = setScrollListeners;
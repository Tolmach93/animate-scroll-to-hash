class AnimateScrollToHash {
  constructor ({
    block = document,
    margin = 0,// px
    transition = 500,// ms
  } = {}) {
    this.margin = margin;
    this.transition = transition;
    this.listeners = [];
    this.intervalId = 0;
    this.setListener = this.setListener.bind(this);
    this.resetListeners = this.resetListeners.bind(this);
    this.moveToId = this.moveToId.bind(this);
    this.moveToY = this.moveToY.bind(this);
    const links = block.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
      this.setListener(links[i]);
    }
  }
  set margin (margin) {
    this._margin = margin;
  }

  get margin () {
    if (typeof this._margin === 'number') return this._margin;
    if (typeof this._margin !== 'object') return 0;
    const size = Object.keys(this._margin)
      .map(size => +size)
      .sort()
      .reverse()
      .find(size => size <= document.documentElement.clientWidth);

    return size || size === 0 ? this._margin[size] : 0;
  }

  setListener (link) {
    let href = link.getAttribute('href');
    if (!href || link.target === '_blank') return;
    if (!(new RegExp(location.pathname + '\#.').test(href) || href.indexOf('#') === 0)) return;
    const id = href.split('#')[1];
    if (location.search) {
      href = location.pathname + location.search + '#' + id;
      link.setAttribute('href', href);
    }
    const listener = (e) => {
      e.preventDefault();
      this.moveToId(id);
      return false;
    };
    link.addEventListener('click', listener, false);
    this.listeners.push({
      link,
      listener
    })
  }

  resetListeners () {
    this.listeners.forEach(item => {
      item.link.removeEventListener('click', item.listener, false);
    })
  }

  moveToId (id) {
    const node = document.getElementById(id);
    let promise = Promise.resolve();
    if (node) {
      const y = AnimateScrollToHash.calculateWindowOffsetY(node);
      promise = this.moveToY(y - this.margin)
    }
    promise
      .then(() => {
        const lastY = window.pageYOffset;
        location.hash = '#' + id;
        AnimateScrollToHash.setScrollPos(lastY);
      });
  }

  moveToY (to) {
    clearInterval(this.intervalId);
    return new Promise((resolve, reject) => {
      let distance = to - window.pageYOffset;
      if (distance === 0) return resolve();
      let iter = 0;
      let steps = Math.round(this.transition / 13);
      let pos = [window.pageYOffset];
      let stepPix = (distance * 2) / steps;
      let coof = stepPix / (steps / 2);
      for (let i = 0; i < steps; i++) {
        if (i < (steps / 2)) {
          pos.push(Math.round(pos[pos.length - 1] + coof * i));
        } else {
          pos.push(Math.round(pos[pos.length - 1] + coof * ((steps / 2) - i + (steps / 2))));
        }
      }

      this.intervalId = setInterval(() => {
        if (iter === steps) {
          clearInterval(this.intervalId);
          AnimateScrollToHash.setScrollPos(to);
          resolve();
        } else {
          AnimateScrollToHash.setScrollPos(pos[++iter])
        }
      }, 13);
    })
  }

  static calculateWindowOffsetY (node) {
    let y = 0;
    while (node) {
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return y
  }

  static setScrollPos (to) {
    window.scrollTo(0, to)
  }
}

module.exports = AnimateScrollToHash;
module.exports.default = AnimateScrollToHash;
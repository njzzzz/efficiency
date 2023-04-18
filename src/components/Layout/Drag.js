class Drag {
  constructor(el, parentEl, options = {}) {
    this.$el = el || "";
    this.$parentEl = parentEl || "";
    this.MAX_LEFT = "";
    this.MAX_TOP = "";
    this.elRect = {};
    this.$options = options;
    this._getElement();
  }
  _getElement() {
    if (this._isObj(this.$el) && this._isObj(this.$parentEl)) {
      this._initParam();
      this._addEvent();
    } else {
      this._throwError("elNotExist");
    }
  }
  _initParam() {
    this._getMax();
    this.elRect = this.$el.getBoundingClientRect();
    const top = this.$options.top || this.elRect.top;
    const left = this.$options.left || this.elRect.left;
    this.$el.style.position = "fixed";
    this.$el.style.cursor = "move";
    this._setPosition(left, top);
  }
  _addEvent() {
    const _this = this;
    this.$el.onmousedown = (mouse_down_e) => {
      mouse_down_e.preventDefault();
      const offsetTop = mouse_down_e.offsetY;
      const offsetLeft = mouse_down_e.offsetX;
      const offsetRight = this.$el.offsetWidth - offsetLeft;
      const offsetBottom = this.$el.offsetHeight - offsetTop;
      window.onmousemove = (mouse_move_e) => {
        let moveLeft = mouse_move_e.clientX - offsetLeft;
        let moveTop = mouse_move_e.clientY - offsetTop;
        const isOverRight = offsetRight + mouse_move_e.clientX > this.MAX_LEFT;
        const isOverBottom = offsetBottom + mouse_move_e.clientY > this.MAX_TOP;
        if (moveLeft < 0) {
          moveLeft = 0;
        } else if (isOverRight) {
          moveLeft = this.MAX_LEFT - this.elRect.width;
        }
        if (moveTop < 0) {
          moveTop = 0;
        } else if (isOverBottom) {
          moveTop = this.MAX_TOP - this.elRect.height;
        }
        _this._setPosition(moveLeft, moveTop);
      };
    };
    this.$el.onmouseup = () => {
      window.onmousemove = null;
    };
    window.onmouseup = () => {
      window.onmousemove = null;
    };
  }
  _throwError(type) {
    const errMap = {
      elNotExist: "not an element, please check your param!",
    };
    console.error(errMap[type]);
  }
  _isObj(obj) {
    return Object.prototype.toString.call(obj).includes("[object HTML");
  }
  _getStyle(el, style) {
    return window.getComputedStyle(el, null)[style];
  }
  _getMax() {
    this.MAX_LEFT = this.$parentEl.getBoundingClientRect().right;
    this.MAX_TOP = this.$parentEl.getBoundingClientRect().bottom;
  }
  _setPosition(x, y) {
    this.$el.style.left = isNaN(x) ? x : x + "px";
    this.$el.style.top = isNaN(y) ? y : y + "px";
  }
}
export default Drag;

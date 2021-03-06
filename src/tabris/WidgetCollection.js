export default function WidgetCollection(arr, selector, deep) {
  this._array = select(arr, selector || '*', deep);
  for (let i = 0; i < this._array.length; i++) {
    this[i] = this._array[i];
  }
  this.length = this._array.length;
}

let proto = WidgetCollection.prototype = {

  first() {
    return this._array[0];
  },

  last() {
    return this._array[this._array.length - 1];
  },

  toArray() {
    return this._array.concat();
  },

  forEach(callback) {
    let that = this;
    this._array.forEach((value, index) => {
      callback(value, index, that);
    });
  },

  indexOf(needle) {
    return this._array.indexOf(needle);
  },

  filter(selector) {
    return new WidgetCollection(this._array, selector);
  },

  get(prop) {
    if (this._array[0]) {
      return this._array[0].get(prop);
    }
  },

  parent() {
    let result = [];
    for (let i = 0; i < this._array.length; i++) {
      let parent = this._array[i].parent();
      if (parent && result.indexOf(parent) === -1) {
        result.push(parent);
      }
    }
    if (result.length) {
      return new WidgetCollection(result);
    }
  },

  children(selector) {
    let result = [];
    for (let i = 0; i < this._array.length; i++) {
      result.push.apply(result, this._array[i]._getSelectableChildren() || []);
    }
    return new WidgetCollection(result, selector);
  },

  find(selector) {
    return new WidgetCollection(this.children()._array, selector, true);
  },

  appendTo(parent) {
    parent.append(this);
  },

  dispose() {
    for (let i = 0; i < this._array.length; i++) {
      this._array[i].dispose();
    }
  }

};

['set', 'animate', 'on', 'off', 'once'].forEach((key) => {
  proto[key] = function() {
    for (let i = 0; i < this._array.length; i++) {
      this._array[i][key].apply(this._array[i], arguments);
    }
    if (key !== 'animate') {
      return this;
    }
  };
});

function select(array, selector, deep) {
  if (!array || array.length === 0) {
    return [];
  }
  if (selector === '*' && !deep) {
    return array.concat();
  }
  let filter = getFilter(selector);
  if (deep) {
    return deepSelect([], array, filter);
  }
  return array.filter(filter);
}

function deepSelect(result, array, filter) {
  for (let i = 0; i < array.length; i++) {
    if (filter(array[i])) {
      result.push(array[i]);
    }
    if (array[i]._children) {
      deepSelect(result, array[i]._getSelectableChildren(), filter);
    }
  }
  return result;
}

function getFilter(selector) {
  let matches = {};
  let filter = selector instanceof Function ? selector : createMatcher(selector);
  return function(widget) {
    if (matches[widget.cid]) {
      return false;
    }
    if (filter(widget)) {
      matches[widget.cid] = true;
      return true;
    }
    return false;
  };
}

function createMatcher(selector) {
  if (selector.charAt(0) === '#') {
    let expectedId = selector.slice(1);
    return function(proxy) {
      return expectedId === proxy.id;
    };
  }
  if (selector.charAt(0) === '.') {
    let expectedClass = selector.slice(1);
    return function(proxy) {
      return proxy.classList.indexOf(expectedClass) !== -1;
    };
  }
  if (selector === '*') {
    return function() {return true;};
  }
  return function(proxy) {
    return selector === proxy.type;
  };
}

/*
Default comparison function to be used
*/
function defaultCmp(x: number, y: number) {
  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
}

/*
Insert item x in list a, and keep it sorted assuMath.ming a is sorted.

If x is already in a, insert it to the right of the rightmost x.

Optional args lo (default 0) and hi (default a.length) bound the slice
of a to be searched.
*/
function insort(
  a: any[],
  x: any,
  lo: any = 0,
  hi: number | null,
  cmp: any = defaultCmp
) {
  var mid;
  if (lo < 0) {
    throw new Error("lo must be non-negative");
  }
  if (hi == null) {
    hi = a.length;
  }
  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2);
    if (cmp(x, a[mid]) < 0) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return a.splice(lo, lo - lo, x);
}

/*
Push item onto heap, maintaining the heap invariant.
*/
function heappush(array: any[], item: any, cmp: any = defaultCmp) {
  array.push(item);
  return _siftdown(array, 0, array.length - 1, cmp);
}

/*
Pop the smallest item off the heap, maintaining the heap invariant.
*/
function heappop(array: any[], cmp: any = defaultCmp) {
  var lastelt, returnitem;
  lastelt = array.pop();
  if (array.length) {
    returnitem = array[0];
    array[0] = lastelt;
    _siftup(array, 0, cmp);
  } else {
    returnitem = lastelt;
  }
  return returnitem;
}

/*
Pop and return the current smallest value, and add the new item.

This is more efficient than heappop() followed by heappush(), and can be
more appropriate when using a fixed size heap. Note that the value
returned may be larger than item! That constrains reasonable use of
this routine unless written as part of a conditional replacement:
    if item > array[0]
      item = heapreplace(array, item)
*/
function heapreplace(array: any[], item: any, cmp: any = defaultCmp) {
  var returnitem;
  returnitem = array[0];
  array[0] = item;
  _siftup(array, 0, cmp);
  return returnitem;
}

/*
Fast version of a heappush followed by a heappop.
*/
function heappushpop(array: any[], item: any, cmp: any = defaultCmp) {
  var _ref;
  if (array.length && cmp(array[0], item) < 0) {
    (_ref = [array[0], item]), (item = _ref[0]), (array[0] = _ref[1]);
    _siftup(array, 0, cmp);
  }
  return item;
}

/*
Transform list into a heap, in-place, in O(array.length) time.
*/
function heapify(array: any[], cmp: any = defaultCmp) {
  const size = Math.floor(array.length / 2);
  let i = size;
  const result = [];
  while (i--) {
    result[i] = _siftup(array, size - 1 - i, cmp);
  }
  return result;
}

/*
Update the position of the given item in the heap.
This function should be called every time the item is being modified.
*/
function updateItem(array: any[], item: any, cmp: any = defaultCmp) {
  var pos;
  pos = array.indexOf(item);
  if (pos === -1) {
    return;
  }
  _siftdown(array, 0, pos, cmp);
  return _siftup(array, pos, cmp);
}

/*
Find the n largest elements in a dataset.
*/
function nlargest(array: any[], n: any, cmp: any = defaultCmp) {
  var result: any[];
  result = array.slice(0, n);
  if (!result.length) {
    return result;
  }
  heapify(result, cmp);
  array.slice(n).forEach((elem: any) => heappushpop(result, elem, cmp));
  return result.sort(cmp).reverse();
}

/*
Find the n smallest elements in a dataset.
*/
function nsmallest(array: any[], n: number, cmp: any = defaultCmp) {
  var los: any, result: any[];
  if (n * 10 <= array.length) {
    result = array.slice(0, n).sort(cmp);
    if (!result.length) {
      return result;
    }
    los = result[result.length - 1];
    array.slice(n).forEach((elem: any) => {
      if (cmp(elem, los) < 0) {
        insort(result, elem, 0, null, cmp);
        result.pop();
        return (los = result[result.length - 1]);
      }
    });
    return result;
  }

  heapify(array, cmp);
  let i = Math.min(n, array.length);
  const r = [];
  while (i--) {
    r[i] = heappop(array, cmp);
  }
  return r;
}

function _siftdown(
  array: any[],
  startpos: number,
  pos: number,
  cmp: any = defaultCmp
) {
  var newitem, parent, parentpos;
  newitem = array[pos];
  while (pos > startpos) {
    parentpos = (pos - 1) >> 1;
    parent = array[parentpos];
    if (cmp(newitem, parent) < 0) {
      array[pos] = parent;
      pos = parentpos;
      continue;
    }
    break;
  }
  return (array[pos] = newitem);
}

function _siftup(array: any[], pos: number, cmp: any = defaultCmp) {
  var childpos, endpos, newitem, rightpos, startpos;
  endpos = array.length;
  startpos = pos;
  newitem = array[pos];
  childpos = 2 * pos + 1;
  while (childpos < endpos) {
    rightpos = childpos + 1;
    if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
      childpos = rightpos;
    }
    array[pos] = array[childpos];
    pos = childpos;
    childpos = 2 * pos + 1;
  }
  array[pos] = newitem;
  return _siftdown(array, startpos, pos, cmp);
}

class Heap {
  private nodes: any[] = [];
  public static push = heappush;

  public static pop = heappop;

  public static replace = heapreplace;

  public static pushpop = heappushpop;

  public static heapify = heapify;

  public static updateItem = updateItem;

  public static nlargest = nlargest;

  public static nsmallest = nsmallest;

  constructor(public cmp: any = defaultCmp) {
    this.nodes = [];
  }

  public push(x: any) {
    return heappush(this.nodes, x, this.cmp);
  }

  public pop() {
    return heappop(this.nodes, this.cmp);
  }

  public peek() {
    return this.nodes[0];
  }

  public contains(x: any) {
    return this.nodes.indexOf(x) !== -1;
  }

  public replace(x: any) {
    return heapreplace(this.nodes, x, this.cmp);
  }

  public pushpop(x: any) {
    return heappushpop(this.nodes, x, this.cmp);
  }

  public heapify() {
    return heapify(this.nodes, this.cmp);
  }

  public updateItem(x: any) {
    return updateItem(this.nodes, x, this.cmp);
  }

  public clear() {
    return (this.nodes = []);
  }

  public empty() {
    return this.nodes.length === 0;
  }

  public size() {
    return this.nodes.length;
  }

  public clone() {
    var heap;
    heap = new Heap();
    heap.nodes = this.nodes.slice(0);
    return heap;
  }

  public toArray() {
    return this.nodes.slice(0);
  }
}

//aliases
interface Heap {
  insert: typeof Heap.prototype.push;
  top: typeof Heap.prototype.peek;
  front: typeof Heap.prototype.peek;
  has: typeof Heap.prototype.contains;
  copy: typeof Heap.prototype.clone;
}
Heap.prototype.insert = Heap.prototype.push;
Heap.prototype.top = Heap.prototype.peek;
Heap.prototype.front = Heap.prototype.peek;
Heap.prototype.has = Heap.prototype.contains;
Heap.prototype.copy = Heap.prototype.clone;

export default Heap;

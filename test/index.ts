import assert from "assert";
import Heap from "../src/index";

const range = (start: number, end: number) => {
  let size = end - start;
  const result = [];
  while (size--) result[size] = start + size;
  return result;
};

describe("Heap#push, Heap#pop", () => {
  //push, Heap#pop', ->
  it("should sort an array using push and pop", () => {
    var heap, sorted: any[];
    heap = new Heap();
    range(1, 10 + 1).forEach((i) => heap.push(Math.random()));
    sorted = (() => {
      var _results: any[];
      _results = [];
      while (!heap.empty()) {
        _results.push(heap.pop());
      }
      return _results;
    })();
    return assert.deepEqual(sorted.slice().sort(), sorted);
  });

  it("should work with custom comparison function", () => {
    var sorted: any[];
    function cmp(a: number, b: number) {
      if (a > b) {
        return -1;
      }
      if (a < b) {
        return 1;
      }
      return 0;
    }
    var heap = new Heap(cmp);
    range(1, 10 + 1).forEach((i) => heap.push(Math.random()));
    sorted = (() => {
      var _results: any[];
      _results = [];
      while (!heap.empty()) {
        _results.push(heap.pop());
      }
      return _results;
    })();
    return assert.deepEqual(sorted.slice().sort().reverse(), sorted);
  });
});

describe("Heap#replace", () =>
  it("should behave like pop() followed by push()", () => {
    //replace', ->
    var heap;
    heap = new Heap();
    range(1, 5 + 1).forEach((v) => heap.push(v));
    assert.deepEqual(heap.replace(3), 1);
    assert.deepEqual(heap.toArray().sort(), [2, 3, 3, 4, 5]);
  }));

describe("Heap#pushpop", () =>
  it("should behave like push() followed by pop()", () => {
    //pushpop', ->
    var heap = new Heap();
    range(1, 5 + 1).forEach((v) => heap.push(v));
    console.log(heap);
    assert.equal(heap.pushpop(6), 1);
    console.log(heap);

    assert.equal(heap.toArray().sort(), range(2, 6 + 1));
  }));

describe("Heap#contains", () =>
  it("should return whether it contains the value", () => {
    //contains', ->
    var heap = new Heap();
    range(1, 5 + 1).forEach((v) => heap.push(v));
    range(1, 5 + 1).forEach((v) => assert.equal(heap.contains(v), true));
    assert.equal(heap.contains(0), false);
    assert.equal(heap.contains(6), false);
  }));

describe("Heap#peek", () =>
  it("should return the top value", () => {
    //peek', ->
    var heap;
    heap = new Heap();
    heap.push(1);
    assert.equal(heap.peek(), 1);
    heap.push(2);
    assert.equal(heap.peek(), 1);
    heap.pop();
    assert.equal(heap.peek(), 2);
  }));

describe("Heap#clone", () =>
  it("should return a cloned heap", () => {
    //clone', ->
    var a, b: { toArray: () => any };
    a = new Heap();
    range(1, 5 + 1).forEach((v) => a.push(v));
    b = a.clone();
    assert.deepEqual(a.toArray(), b.toArray());
  }));

describe("Heap.nsmallest", () => {
  it("should return exactly n elements when size() >= n", () => {
    var array: number[];
    assert.deepEqual(Heap.nsmallest(range(1, 10 + 1), 3), range(1, 3 + 1));

    array = [
      1,
      3,
      2,
      1,
      3,
      4,
      4,
      2,
      3,
      4,
      5,
      1,
      2,
      3,
      4,
      5,
      2,
      1,
      3,
      4,
      5,
      6,
      7,
      2,
    ];
    assert.deepEqual(Heap.nsmallest(array, 2), [1, 1]);
  });

  it("should return size() elements when size() <= n", () =>
    assert.deepEqual(Heap.nsmallest(range(3, 1 + 1), 10), range(1, 3 + 1)));
});

describe("Heap.nlargest", () => {
  it("should return exactly n elements when size() >= n", () =>
    assert.deepEqual(Heap.nlargest(range(1, 10 + 1), 3), range(10, 8 + 1)));

  it("should return size() elements when size() <= n", () =>
    assert.deepEqual(Heap.nlargest(range(3, 1 + 1), 10), range(3, 1 + 1)));
});

describe("Heap#updateItem", () => {
  //updateItem', ->
  it("should return correct order", () => {
    var a: { x: number }, b: { x: number }, c: { x: any }, h;
    a = {
      x: 1,
    };
    b = {
      x: 2,
    };
    c = {
      x: 3,
    };
    h = new Heap((m: { x: number }, n: { x: number }) => m.x - n.x);
    h.push(a);
    h.push(b);
    h.push(c);
    c.x = 0;
    h.updateItem(c);
    assert.deepEqual(h.pop(), c);
  });
  it("should return correct order when used statically", () => {
    var a: { x: number }, b: { x: number }, c: { x: any }, h: any[];
    a = {
      x: 1,
    };
    b = {
      x: 2,
    };
    c = {
      x: 3,
    };
    h = [];
    function cmp(m: { x: number }, n: { x: number }) {
      return m.x - n.x;
    }
    Heap.push(h, a, cmp);
    Heap.push(h, b, cmp);
    Heap.push(h, c, cmp);
    c.x = 0;
    Heap.updateItem(h, c, cmp);
    assert.deepEqual(Heap.pop(h, cmp), c);
  });
});

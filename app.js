;(function(PACKAGE) {
var oldRequire = window.Require;
(function() {
  var cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(parentModule, pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(parentModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, module, program, values;
    if (!(program = pkg.distribution[path])) {
      throw "Could not find program at " + path + " in " + pkg.name;
    }
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    program.apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        return loadPackage(rootModule, otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

}).call(this);

//# sourceURL=require.coffee
var require = Require.generateFor(PACKAGE);
window.Require = oldRequire;
require('./main')
})({"dependencies":{"dust":{"dependencies":{"appcache":{"dependencies":{},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var applicationCache;

  applicationCache = window.applicationCache;

  applicationCache.addEventListener('updateready', function(e) {
    if (applicationCache.status === applicationCache.UPDATEREADY) {
      if (confirm('A new version of this site is available. Load it?')) {
        return window.location.reload();
      }
    }
  }, false);

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"main"};;

  return module.exports;
}}},"cornerstone":{"dependencies":{"math":{"dependencies":{"point":{"dependencies":{},"distribution":{"interactive_runtime":function(require, global, module, exports, PACKAGE) {
  (function() {
  window.Point = require("./point");

  Interactive.register("example", function(_arg) {
    var outputElement, program, result, runtimeElement, source;
    source = _arg.source, runtimeElement = _arg.runtimeElement;
    program = CoffeeScript.compile(source, {
      bare: true
    });
    outputElement = document.createElement("pre");
    runtimeElement.empty().append(outputElement);
    result = eval(program);
    if (typeof result === "number") {
      if (result !== (0 | result)) {
        result = result.toFixed(4);
      }
    }
    return outputElement.textContent = result;
  });

}).call(this);

//# sourceURL=interactive_runtime.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"point"};;

  return module.exports;
},"point":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Point, isObject,
    __slice = [].slice;

  Point = function(x, y) {
    var _ref;
    if (isObject(x)) {
      _ref = x, x = _ref.x, y = _ref.y;
    }
    return {
      __proto__: Point.prototype,
      x: x != null ? x : 0,
      y: y != null ? y : 0
    };
  };

  Point.prototype = {
    clamp: function(n) {
      if (this.magnitude() > n) {
        return this.norm(n);
      } else {
        return this.copy();
      }
    },
    copy: function() {
      return Point(this.x, this.y);
    },
    add: function(first, second) {
      if (second != null) {
        return Point(this.x + first, this.y + second);
      } else {
        return Point(this.x + first.x, this.y + first.y);
      }
    },
    subtract: function(first, second) {
      if (second != null) {
        return Point(this.x - first, this.y - second);
      } else {
        return this.add(first.scale(-1));
      }
    },
    scale: function(scalar) {
      return Point(this.x * scalar, this.y * scalar);
    },
    norm: function(length) {
      var m;
      if (length == null) {
        length = 1.0;
      }
      if (m = this.length()) {
        return this.scale(length / m);
      } else {
        return this.copy();
      }
    },
    equal: function(other) {
      return this.x === other.x && this.y === other.y;
    },
    length: function() {
      return Math.sqrt(this.dot(this));
    },
    magnitude: function() {
      return this.length();
    },
    direction: function() {
      return Math.atan2(this.y, this.x);
    },
    dot: function(other) {
      return this.x * other.x + this.y * other.y;
    },
    cross: function(other) {
      return this.x * other.y - other.x * this.y;
    },
    distance: function(other) {
      return Point.distance(this, other);
    },
    toFixed: function(n) {
      return "Point(" + (this.x.toFixed(n)) + ", " + (this.y.toFixed(n)) + ")";
    },
    toString: function() {
      return "Point(" + this.x + ", " + this.y + ")";
    }
  };

  Point.distance = function(p1, p2) {
    return Math.sqrt(Point.distanceSquared(p1, p2));
  };

  Point.distanceSquared = function(p1, p2) {
    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
  };

  Point.interpolate = function(p1, p2, t) {
    return p2.subtract(p1).scale(t).add(p1);
  };

  Point.fromAngle = function(angle) {
    return Point(Math.cos(angle), Math.sin(angle));
  };

  Point.direction = function(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  };

  Point.centroid = function() {
    var points;
    points = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return points.reduce(function(sumPoint, point) {
      return sumPoint.add(point);
    }, Point(0, 0)).scale(1 / points.length);
  };

  Point.random = function() {
    return Point.fromAngle(Math.random() * 2 * Math.PI);
  };

  module.exports = Point;

  isObject = function(object) {
    return Object.prototype.toString.call(object) === "[object Object]";
  };

}).call(this);

//# sourceURL=point.coffee;

  return module.exports;
},"test/test":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Point, TAU, equals, ok;

  Point = require("../point");

  ok = assert;

  equals = assert.equal;

  TAU = 2 * Math.PI;

  describe("Point", function() {
    var TOLERANCE, equalEnough;
    TOLERANCE = 0.00001;
    equalEnough = function(expected, actual, tolerance, message) {
      message || (message = "" + expected + " within " + tolerance + " of " + actual);
      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);
    };
    it("copy constructor", function() {
      var p, p2;
      p = Point(3, 7);
      p2 = Point(p);
      equals(p2.x, p.x);
      return equals(p2.y, p.y);
    });
    it("#add", function() {
      var p1, p2, result;
      p1 = Point(5, 6);
      p2 = Point(7, 5);
      result = p1.add(p2);
      equals(result.x, p1.x + p2.x);
      equals(result.y, p1.y + p2.y);
      equals(p1.x, 5);
      equals(p1.y, 6);
      equals(p2.x, 7);
      return equals(p2.y, 5);
    });
    it("#add with two arguments", function() {
      var point, result, x, y;
      point = Point(3, 7);
      x = 2;
      y = 1;
      result = point.add(x, y);
      equals(result.x, point.x + x);
      equals(result.y, point.y + y);
      x = 2;
      y = 0;
      result = point.add(x, y);
      equals(result.x, point.x + x);
      return equals(result.y, point.y + y);
    });
    it("#add existing", function() {
      var p;
      p = Point(0, 0);
      p.add(Point(3, 5));
      equals(p.x, 0);
      return equals(p.y, 0);
    });
    it("#subtract", function() {
      var p1, p2, result;
      p1 = Point(5, 6);
      p2 = Point(7, 5);
      result = p1.subtract(p2);
      equals(result.x, p1.x - p2.x);
      return equals(result.y, p1.y - p2.y);
    });
    it("#subtract existing", function() {
      var p;
      p = Point(8, 6);
      p.subtract(3, 4);
      equals(p.x, 8);
      return equals(p.y, 6);
    });
    it("#norm", function() {
      var normal, p;
      p = Point(2, 0);
      normal = p.norm();
      equals(normal.x, 1);
      normal = p.norm(5);
      equals(normal.x, 5);
      p = Point(0, 0);
      normal = p.norm();
      equals(normal.x, 0, "x value of norm of point(0,0) is 0");
      return equals(normal.y, 0, "y value of norm of point(0,0) is 0");
    });
    it("#norm existing", function() {
      var p;
      p = Point(6, 8);
      p.norm(5);
      equals(p.x, 6);
      return equals(p.y, 8);
    });
    it("#scale", function() {
      var p, result, scalar;
      p = Point(5, 6);
      scalar = 2;
      result = p.scale(scalar);
      equals(result.x, p.x * scalar);
      equals(result.y, p.y * scalar);
      equals(p.x, 5);
      return equals(p.y, 6);
    });
    it("#scale existing", function() {
      var p, scalar;
      p = Point(0, 1);
      scalar = 3;
      p.scale(scalar);
      equals(p.x, 0);
      return equals(p.y, 1);
    });
    it("#equal", function() {
      return ok(Point(7, 8).equal(Point(7, 8)));
    });
    it("#magnitude", function() {
      return equals(Point(3, 4).magnitude(), 5);
    });
    it("#length", function() {
      equals(Point(0, 0).length(), 0);
      return equals(Point(-1, 0).length(), 1);
    });
    it("#toString", function() {
      var p;
      p = Point(7, 5);
      return ok(eval(p.toString()).equal(p));
    });
    it("#clamp", function() {
      var p, p2;
      p = Point(10, 10);
      p2 = p.clamp(5);
      return equals(p2.length(), 5);
    });
    it(".centroid", function() {
      var centroid;
      centroid = Point.centroid(Point(0, 0), Point(10, 10), Point(10, 0), Point(0, 10));
      equals(centroid.x, 5);
      return equals(centroid.y, 5);
    });
    it(".fromAngle", function() {
      var p;
      p = Point.fromAngle(TAU / 4);
      equalEnough(p.x, 0, TOLERANCE);
      return equals(p.y, 1);
    });
    it(".random", function() {
      var p;
      p = Point.random();
      return ok(p);
    });
    return it(".interpolate", function() {
      var p1, p2;
      p1 = Point(10, 7);
      p2 = Point(-6, 29);
      ok(p1.equal(Point.interpolate(p1, p2, 0)));
      return ok(p2.equal(Point.interpolate(p1, p2, 1)));
    });
  });

}).call(this);

//# sourceURL=test/test.coffee;

  return module.exports;
}}},"matrix":{"dependencies":{},"distribution":{"matrix":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Matrix, frozen, isObject;

  Matrix = function(a, b, c, d, tx, ty) {
    var _ref;
    if (isObject(a)) {
      _ref = a, a = _ref.a, b = _ref.b, c = _ref.c, d = _ref.d, tx = _ref.tx, ty = _ref.ty;
    }
    return {
      __proto__: Matrix.prototype,
      a: a != null ? a : 1,
      b: b != null ? b : 0,
      c: c != null ? c : 0,
      d: d != null ? d : 1,
      tx: tx != null ? tx : 0,
      ty: ty != null ? ty : 0
    };
  };

  Matrix.Point = require("./point");

  Matrix.prototype = {
    concat: function(matrix) {
      return Matrix(this.a * matrix.a + this.c * matrix.b, this.b * matrix.a + this.d * matrix.b, this.a * matrix.c + this.c * matrix.d, this.b * matrix.c + this.d * matrix.d, this.a * matrix.tx + this.c * matrix.ty + this.tx, this.b * matrix.tx + this.d * matrix.ty + this.ty);
    },
    copy: function() {
      return Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    },
    deltaTransformPoint: function(point) {
      return Matrix.Point(this.a * point.x + this.c * point.y, this.b * point.x + this.d * point.y);
    },
    inverse: function() {
      var determinant;
      determinant = this.a * this.d - this.b * this.c;
      return Matrix(this.d / determinant, -this.b / determinant, -this.c / determinant, this.a / determinant, (this.c * this.ty - this.d * this.tx) / determinant, (this.b * this.tx - this.a * this.ty) / determinant);
    },
    rotate: function(theta, aboutPoint) {
      return this.concat(Matrix.rotation(theta, aboutPoint));
    },
    scale: function(sx, sy, aboutPoint) {
      return this.concat(Matrix.scale(sx, sy, aboutPoint));
    },
    skew: function(skewX, skewY) {
      return this.concat(Matrix.skew(skewX, skewY));
    },
    toString: function() {
      return "Matrix(" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.tx + ", " + this.ty + ")";
    },
    transformPoint: function(point) {
      return Matrix.Point(this.a * point.x + this.c * point.y + this.tx, this.b * point.x + this.d * point.y + this.ty);
    },
    translate: function(tx, ty) {
      return this.concat(Matrix.translation(tx, ty));
    }
  };

  Matrix.rotate = Matrix.rotation = function(theta, aboutPoint) {
    var rotationMatrix;
    rotationMatrix = Matrix(Math.cos(theta), Math.sin(theta), -Math.sin(theta), Math.cos(theta));
    if (aboutPoint != null) {
      rotationMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(rotationMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));
    }
    return rotationMatrix;
  };

  Matrix.scale = function(sx, sy, aboutPoint) {
    var scaleMatrix;
    sy = sy || sx;
    scaleMatrix = Matrix(sx, 0, 0, sy);
    if (aboutPoint) {
      scaleMatrix = Matrix.translation(aboutPoint.x, aboutPoint.y).concat(scaleMatrix).concat(Matrix.translation(-aboutPoint.x, -aboutPoint.y));
    }
    return scaleMatrix;
  };

  Matrix.skew = function(skewX, skewY) {
    return Matrix(0, Math.tan(skewY), Math.tan(skewX), 0);
  };

  Matrix.translate = Matrix.translation = function(tx, ty) {
    return Matrix(1, 0, 0, 1, tx, ty);
  };

  isObject = function(object) {
    return Object.prototype.toString.call(object) === "[object Object]";
  };

  frozen = function(object) {
    if (typeof Object.freeze === "function") {
      Object.freeze(object);
    }
    return object;
  };

  Matrix.IDENTITY = frozen(Matrix());

  Matrix.HORIZONTAL_FLIP = frozen(Matrix(-1, 0, 0, 1));

  Matrix.VERTICAL_FLIP = frozen(Matrix(1, 0, 0, -1));

  module.exports = Matrix;

}).call(this);

//# sourceURL=matrix.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.3.1","entryPoint":"matrix"};;

  return module.exports;
},"test/matrix":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Matrix, Point, equals, ok, test;

  Matrix = require("../matrix");

  Point = require("../point");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Matrix", function() {
    var TOLERANCE, equalEnough, matrixEqual;
    TOLERANCE = 0.00001;
    equalEnough = function(expected, actual, tolerance, message) {
      message || (message = "" + expected + " within " + tolerance + " of " + actual);
      return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);
    };
    matrixEqual = function(m1, m2) {
      equalEnough(m1.a, m2.a, TOLERANCE);
      equalEnough(m1.b, m2.b, TOLERANCE);
      equalEnough(m1.c, m2.c, TOLERANCE);
      equalEnough(m1.d, m2.d, TOLERANCE);
      equalEnough(m1.tx, m2.tx, TOLERANCE);
      return equalEnough(m1.ty, m2.ty, TOLERANCE);
    };
    test("copy constructor", function() {
      var matrix, matrix2;
      matrix = Matrix(1, 0, 0, 1, 10, 12);
      matrix2 = Matrix(matrix);
      ok(matrix !== matrix2);
      return matrixEqual(matrix2, matrix);
    });
    test("Matrix() (Identity)", function() {
      var matrix;
      matrix = Matrix();
      equals(matrix.a, 1, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      equals(matrix.d, 1, "d");
      equals(matrix.tx, 0, "tx");
      equals(matrix.ty, 0, "ty");
      return matrixEqual(matrix, Matrix.IDENTITY);
    });
    test("Empty", function() {
      var matrix;
      matrix = Matrix(0, 0, 0, 0, 0, 0);
      equals(matrix.a, 0, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      equals(matrix.d, 0, "d");
      equals(matrix.tx, 0, "tx");
      return equals(matrix.ty, 0, "ty");
    });
    test("#copy", function() {
      var copyMatrix, matrix;
      matrix = Matrix(2, 0, 0, 2);
      copyMatrix = matrix.copy();
      matrixEqual(copyMatrix, matrix);
      copyMatrix.a = 4;
      equals(copyMatrix.a, 4);
      return equals(matrix.a, 2, "Old 'a' value is unchanged");
    });
    test(".scale", function() {
      var matrix;
      matrix = Matrix.scale(2, 2);
      equals(matrix.a, 2, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      equals(matrix.d, 2, "d");
      matrix = Matrix.scale(3);
      equals(matrix.a, 3, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      return equals(matrix.d, 3, "d");
    });
    test(".scale (about a point)", function() {
      var p, transformedPoint;
      p = Point(5, 17);
      transformedPoint = Matrix.scale(3, 7, p).transformPoint(p);
      equals(transformedPoint.x, p.x, "Point should remain the same");
      return equals(transformedPoint.y, p.y, "Point should remain the same");
    });
    test("#scale (about a point)", function() {
      var p, transformedPoint;
      p = Point(3, 11);
      transformedPoint = Matrix.IDENTITY.scale(3, 7, p).transformPoint(p);
      equals(transformedPoint.x, p.x, "Point should remain the same");
      return equals(transformedPoint.y, p.y, "Point should remain the same");
    });
    test("#skew", function() {
      var angle, matrix;
      matrix = Matrix();
      angle = 0.25 * Math.PI;
      matrix = matrix.skew(angle, 0);
      return equals(matrix.c, Math.tan(angle));
    });
    test(".rotation", function() {
      var matrix;
      matrix = Matrix.rotation(Math.PI / 2);
      equalEnough(matrix.a, 0, TOLERANCE);
      equalEnough(matrix.b, 1, TOLERANCE);
      equalEnough(matrix.c, -1, TOLERANCE);
      return equalEnough(matrix.d, 0, TOLERANCE);
    });
    test(".rotation (about a point)", function() {
      var p, transformedPoint;
      p = Point(11, 7);
      transformedPoint = Matrix.rotation(Math.PI / 2, p).transformPoint(p);
      equals(transformedPoint.x, p.x, "Point should remain the same");
      return equals(transformedPoint.y, p.y, "Point should remain the same");
    });
    test("#rotate (about a point)", function() {
      var p, transformedPoint;
      p = Point(8, 5);
      transformedPoint = Matrix.IDENTITY.rotate(Math.PI / 2, p).transformPoint(p);
      equals(transformedPoint.x, p.x, "Point should remain the same");
      return equals(transformedPoint.y, p.y, "Point should remain the same");
    });
    test("#inverse (Identity)", function() {
      var matrix;
      matrix = Matrix().inverse();
      equals(matrix.a, 1, "a");
      equals(matrix.b, 0, "b");
      equals(matrix.c, 0, "c");
      equals(matrix.d, 1, "d");
      equals(matrix.tx, 0, "tx");
      return equals(matrix.ty, 0, "ty");
    });
    test("#concat", function() {
      var matrix;
      matrix = Matrix.rotation(Math.PI / 2).concat(Matrix.rotation(-Math.PI / 2));
      return matrixEqual(matrix, Matrix.IDENTITY);
    });
    test("#toString", function() {
      var matrix;
      matrix = Matrix(0.5, 2, 0.5, -2, 3, 4.5);
      return matrixEqual(eval(matrix.toString()), matrix);
    });
    test("Maths", function() {
      var a, b, c;
      a = Matrix(12, 3, 3, 1, 7, 9);
      b = Matrix(3, 8, 3, 2, 1, 5);
      c = a.concat(b);
      equals(c.a, 60);
      equals(c.b, 17);
      equals(c.c, 42);
      equals(c.d, 11);
      equals(c.tx, 34);
      return equals(c.ty, 17);
    });
    test("Order of transformations should match manual concat", function() {
      var m1, m2, s, theta, tx, ty;
      tx = 10;
      ty = 5;
      theta = Math.PI / 3;
      s = 2;
      m1 = Matrix().translate(tx, ty).scale(s).rotate(theta);
      m2 = Matrix().concat(Matrix.translation(tx, ty)).concat(Matrix.scale(s)).concat(Matrix.rotation(theta));
      return matrixEqual(m1, m2);
    });
    return test("IDENTITY is immutable", function() {
      var identity;
      identity = Matrix.IDENTITY;
      identity.a = 5;
      return equals(identity.a, 1);
    });
  });

}).call(this);

//# sourceURL=test/matrix.coffee;

  return module.exports;
},"point":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = function(x, y) {
    return {
      x: x,
      y: y
    };
  };

}).call(this);

//# sourceURL=point.coffee;

  return module.exports;
}}},"random":{"dependencies":{},"distribution":{"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"random"};;

  return module.exports;
},"random":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Random, U, rand, standardUniformDistribution, τ;

  τ = 2 * Math.PI;

  U = function(min, max) {
    return function() {
      return Math.random() * (max - min) + min;
    };
  };

  standardUniformDistribution = U(0, 1);

  rand = function(n) {
    if (n) {
      return Math.floor(n * standardUniformDistribution());
    } else {
      return standardUniformDistribution();
    }
  };

  module.exports = Random = {
    angle: function() {
      return rand() * τ;
    },
    binomial: function(n, p) {
      var _i, _results;
      if (n == null) {
        n = 1;
      }
      if (p == null) {
        p = 0.5;
      }
      return (function() {
        _results = [];
        for (var _i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function() {
        if (rand() < p) {
          return 1;
        } else {
          return 0;
        }
      }).reduce(function(a, b) {
        return a + b;
      }, 0);
    },
    between: function(min, max) {
      return rand() * (max - min) + min;
    },
    rand: rand,
    signed: function(n) {
      if (n == null) {
        n = 1;
      }
      return (n * rand()) - (n / 2);
    }
  };

}).call(this);

//# sourceURL=random.coffee;

  return module.exports;
},"test/random":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Random, equals, ok, test;

  Random = require("../random");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Random", function() {
    test("methods", function() {
      return ["angle", "binomial", "between", "rand", "signed"].forEach(function(name) {
        return ok(Random[name], name);
      });
    });
    return it("should have binomial", function() {
      var result;
      result = Random.binomial();
      return assert(result === 1 || result === 0);
    });
  });

}).call(this);

//# sourceURL=test/random.coffee;

  return module.exports;
}}}},"distribution":{"math":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Matrix, Point, Random, self;

  Point = require("point");

  Matrix = require("matrix");

  Matrix.Point = Point;

  Random = require("random");

  module.exports = self = {
    Point: Point,
    Matrix: Matrix,
    Random: Random,
    rand: Random.rand,
    pollute: function() {
      Object.keys(self).forEach(function(key) {
        if (key === "version") {
          return;
        }
        if (key === "pollute") {
          return;
        }
        return global[key] = self[key];
      });
      return self;
    }
  };

}).call(this);

//# sourceURL=math.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"entryPoint":"math","version":"0.2.0","dependencies":{"point":"distri/point:v0.2.0","matrix":"distri/matrix:v0.3.1","random":"distri/random:v0.2.0"}};;

  return module.exports;
},"test/math":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../math").pollute();

  console.log(global);

  describe("Point", function() {
    it("should exist", function() {
      return assert(Point);
    });
    return it("should construct points", function() {
      return assert(Point());
    });
  });

  describe("Matrix", function() {
    it("should exist and return matrices when invoked", function() {
      assert(Matrix);
      return assert(Matrix());
    });
    return it("should use the same `Point` class", function() {
      assert(Matrix.Point === Point);
      return assert(Matrix().transformPoint(Point()) instanceof Point);
    });
  });

  describe("Random", function() {
    return it("should exist", function() {
      return assert(Random);
    });
  });

  describe("rand", function() {
    return it("should exist", function() {
      assert(rand);
      return assert(rand() != null);
    });
  });

}).call(this);

//# sourceURL=test/math.coffee;

  return module.exports;
}}},"extensions":{"dependencies":{},"distribution":{"array":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend, identity, mod, rand,
    __slice = [].slice;

  extend = require("./util").extend;

  extend(Array.prototype, {
    average: function() {
      return this.sum() / this.length;
    },
    compact: function() {
      return this.select(function(element) {
        return element != null;
      });
    },
    copy: function() {
      return this.concat();
    },
    clear: function() {
      this.length = 0;
      return this;
    },
    flatten: function() {
      return this.inject([], function(a, b) {
        return a.concat(b);
      });
    },
    invoke: function() {
      var args, method;
      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.map(function(element) {
        return element[method].apply(element, args);
      });
    },
    rand: function() {
      return this[rand(this.length)];
    },
    remove: function(object) {
      var index;
      index = this.indexOf(object);
      if (index >= 0) {
        return this.splice(index, 1)[0];
      } else {
        return void 0;
      }
    },
    include: function(element) {
      return this.indexOf(element) !== -1;
    },
    each: function(iterator, context) {
      var element, i, _i, _len;
      if (this.forEach) {
        this.forEach(iterator, context);
      } else {
        for (i = _i = 0, _len = this.length; _i < _len; i = ++_i) {
          element = this[i];
          iterator.call(context, element, i, this);
        }
      }
      return this;
    },
    eachPair: function(iterator, context) {
      var a, b, i, j, length, _results;
      length = this.length;
      i = 0;
      _results = [];
      while (i < length) {
        a = this[i];
        j = i + 1;
        i += 1;
        _results.push((function() {
          var _results1;
          _results1 = [];
          while (j < length) {
            b = this[j];
            j += 1;
            _results1.push(iterator.call(context, a, b));
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    eachWithObject: function(object, iterator, context) {
      this.each(function(element, i, self) {
        return iterator.call(context, element, object, i, self);
      });
      return object;
    },
    eachSlice: function(n, iterator, context) {
      var i, len;
      len = this.length / n;
      i = -1;
      while (++i < len) {
        iterator.call(context, this.slice(i * n, (i + 1) * n), i * n, this);
      }
      return this;
    },
    pipeline: function(input) {
      return this.inject(input, function(input, fn) {
        return fn(input);
      });
    },
    shuffle: function() {
      var shuffledArray;
      shuffledArray = [];
      this.each(function(element) {
        return shuffledArray.splice(rand(shuffledArray.length + 1), 0, element);
      });
      return shuffledArray;
    },
    first: function() {
      return this[0];
    },
    last: function() {
      return this[this.length - 1];
    },
    extremes: function(fn) {
      var max, maxResult, min, minResult;
      if (fn == null) {
        fn = identity;
      }
      min = max = void 0;
      minResult = maxResult = void 0;
      this.each(function(object) {
        var result;
        result = fn(object);
        if (min != null) {
          if (result < minResult) {
            min = object;
            minResult = result;
          }
        } else {
          min = object;
          minResult = result;
        }
        if (max != null) {
          if (result > maxResult) {
            max = object;
            return maxResult = result;
          }
        } else {
          max = object;
          return maxResult = result;
        }
      });
      return {
        min: min,
        max: max
      };
    },
    maxima: function(valueFunction) {
      if (valueFunction == null) {
        valueFunction = identity;
      }
      return this.inject([-Infinity, []], function(memo, item) {
        var maxItems, maxValue, value;
        value = valueFunction(item);
        maxValue = memo[0], maxItems = memo[1];
        if (value > maxValue) {
          return [value, [item]];
        } else if (value === maxValue) {
          return [value, maxItems.concat(item)];
        } else {
          return memo;
        }
      }).last();
    },
    maximum: function(valueFunction) {
      return this.maxima(valueFunction).first();
    },
    minima: function(valueFunction) {
      var inverseFn;
      if (valueFunction == null) {
        valueFunction = identity;
      }
      inverseFn = function(x) {
        return -valueFunction(x);
      };
      return this.maxima(inverseFn);
    },
    minimum: function(valueFunction) {
      return this.minima(valueFunction).first();
    },
    wrap: function(start, length) {
      var end, i, result;
      if (length != null) {
        end = start + length;
        i = start;
        result = [];
        while (i < end) {
          result.push(this[mod(i, this.length)]);
          i += 1;
        }
        return result;
      } else {
        return this[mod(start, this.length)];
      }
    },
    partition: function(iterator, context) {
      var falseCollection, trueCollection;
      trueCollection = [];
      falseCollection = [];
      this.each(function(element) {
        if (iterator.call(context, element)) {
          return trueCollection.push(element);
        } else {
          return falseCollection.push(element);
        }
      });
      return [trueCollection, falseCollection];
    },
    select: function(iterator, context) {
      return this.partition(iterator, context)[0];
    },
    without: function(values) {
      return this.reject(function(element) {
        return values.include(element);
      });
    },
    reject: function(iterator, context) {
      return this.partition(iterator, context)[1];
    },
    inject: function(initial, iterator) {
      this.each(function(element) {
        return initial = iterator(initial, element);
      });
      return initial;
    },
    sum: function() {
      return this.inject(0, function(sum, n) {
        return sum + n;
      });
    },
    product: function() {
      return this.inject(1, function(product, n) {
        return product * n;
      });
    },
    unique: function() {
      return this.inject([], function(results, element) {
        if (results.indexOf(element) === -1) {
          results.push(element);
        }
        return results;
      });
    },
    zip: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.map(function(element, index) {
        var output;
        output = args.map(function(arr) {
          return arr[index];
        });
        output.unshift(element);
        return output;
      });
    }
  });

  identity = function(x) {
    return x;
  };

  rand = function(n) {
    return Math.floor(n * Math.random());
  };

  mod = function(n, base) {
    var result;
    result = n % base;
    if (result < 0 && base > 0) {
      result += base;
    }
    return result;
  };

}).call(this);

//# sourceURL=array.coffee;

  return module.exports;
},"extensions":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("./array");

  require("./function");

  require("./number");

  require("./string");

}).call(this);

//# sourceURL=extensions.coffee;

  return module.exports;
},"function":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend,
    __slice = [].slice;

  extend = require("./util").extend;

  extend(Function.prototype, {
    once: function() {
      var func, memo, ran;
      func = this;
      ran = false;
      memo = void 0;
      return function() {
        if (ran) {
          return memo;
        }
        ran = true;
        return memo = func.apply(this, arguments);
      };
    },
    debounce: function(wait) {
      var func, timeout;
      timeout = null;
      func = this;
      return function() {
        var args, context, later;
        context = this;
        args = arguments;
        later = function() {
          timeout = null;
          return func.apply(context, args);
        };
        clearTimeout(timeout);
        return timeout = setTimeout(later, wait);
      };
    },
    delay: function() {
      var args, func, wait;
      wait = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      func = this;
      return setTimeout(function() {
        return func.apply(null, args);
      }, wait);
    },
    defer: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.delay.apply(this, [1].concat(args));
    }
  });

  extend(Function, {
    identity: function(x) {
      return x;
    },
    noop: function() {}
  });

}).call(this);

//# sourceURL=function.coffee;

  return module.exports;
},"number":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend;

  ["abs", "ceil", "floor", "round"].forEach(function(method) {
    return Number.prototype[method] = function() {
      return Math[method](this);
    };
  });

  extend = require("./util").extend;

  extend(Number.prototype, {
    circularPoints: function() {
      var n, _i, _results;
      n = this;
      return (function() {
        _results = [];
        for (var _i = 0; 0 <= n ? _i <= n : _i >= n; 0 <= n ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function(i) {
        return Point.fromAngle((i / n).turns);
      });
    },
    clamp: function(min, max) {
      if ((min != null) && (max != null)) {
        return Math.min(Math.max(this, min), max);
      } else if (min != null) {
        return Math.max(this, min);
      } else if (max != null) {
        return Math.min(this, max);
      } else {
        return this;
      }
    },
    mod: function(base) {
      var result;
      result = this % base;
      if (result < 0 && base > 0) {
        result += base;
      }
      return result;
    },
    sign: function() {
      if (this > 0) {
        return 1;
      } else if (this < 0) {
        return -1;
      } else {
        return 0;
      }
    },
    even: function() {
      return this.mod(2) === 0;
    },
    odd: function() {
      return this.mod(2) === 1;
    },
    times: function(iterator, context) {
      var i;
      i = -1;
      while (++i < this) {
        iterator.call(context, i);
      }
      return i;
    },
    snap: function(resolution) {
      return (n / resolution).floor() * resolution;
    },
    truncate: function() {
      if (this > 0) {
        return this.floor();
      } else if (this < 0) {
        return this.ceil();
      } else {
        return this;
      }
    }
  });

  if (!5..rotations) {
    Object.defineProperty(Number.prototype, 'rotations', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!1..rotation) {
    Object.defineProperty(Number.prototype, 'rotation', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!5..turns) {
    Object.defineProperty(Number.prototype, 'turns', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!1..turn) {
    Object.defineProperty(Number.prototype, 'turn', {
      get: function() {
        return this * Math.TAU;
      }
    });
  }

  if (!2..degrees) {
    Object.defineProperty(Number.prototype, 'degrees', {
      get: function() {
        return this * Math.TAU / 360;
      }
    });
  }

  if (!1..degree) {
    Object.defineProperty(Number.prototype, 'degree', {
      get: function() {
        return this * Math.TAU / 360;
      }
    });
  }

  Math.TAU = 2 * Math.PI;

}).call(this);

//# sourceURL=number.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"extensions"};;

  return module.exports;
},"string":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend;

  extend = require("./util").extend;

  extend(String.prototype, {
    blank: function() {
      return /^\s*$/.test(this);
    },
    parse: function() {
      var e;
      try {
        return JSON.parse(this.toString());
      } catch (_error) {
        e = _error;
        return this.toString();
      }
    },
    startsWith: function(str) {
      return this.lastIndexOf(str, 0) === 0;
    },
    endsWith: function(str) {
      return this.indexOf(str, this.length - str.length) !== -1;
    },
    extension: function() {
      var extension, _ref;
      if (extension = (_ref = this.match(/\.([^\.]*)$/, '')) != null ? _ref.last() : void 0) {
        return extension;
      } else {
        return '';
      }
    },
    withoutExtension: function() {
      return this.replace(/\.[^\.]*$/, '');
    },
    toInt: function(base) {
      if (base == null) {
        base = 10;
      }
      return parseInt(this, base);
    }
  });

}).call(this);

//# sourceURL=string.coffee;

  return module.exports;
},"test/array":function(require, global, module, exports, PACKAGE) {
  (function() {
  var equals, ok, test;

  require("../array");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Array", function() {
    test("#average", function() {
      return equals([1, 3, 5, 7].average(), 4);
    });
    test("#compact", function() {
      var a, compacted;
      a = [0, 1, void 0, 2, null, 3, '', 4];
      compacted = a.compact();
      equals(compacted[0], 0);
      equals(compacted[1], 1);
      equals(compacted[2], 2);
      equals(compacted[3], 3);
      equals(compacted[4], '');
      return equals(compacted[5], 4);
    });
    test("#copy", function() {
      var a, b;
      a = [1, 2, 3];
      b = a.copy();
      ok(a !== b, "Original array is not the same array as the copied one");
      ok(a.length === b.length, "Both arrays are the same size");
      return ok(a[0] === b[0] && a[1] === b[1] && a[2] === b[2], "The elements of the two arrays are equal");
    });
    test("#flatten", function() {
      var array, flattenedArray;
      array = [[0, 1], [2, 3], [4, 5]];
      flattenedArray = array.flatten();
      equals(flattenedArray.length, 6, "Flattened array length should equal number of elements in sub-arrays");
      equals(flattenedArray.first(), 0, "First element should be first element in first sub-array");
      return equals(flattenedArray.last(), 5, "Last element should be last element in last sub-array");
    });
    test("#rand", function() {
      var array;
      array = [1, 2, 3];
      ok(array.indexOf(array.rand()) !== -1, "Array includes randomly selected element");
      ok([5].rand() === 5, "[5].rand() === 5");
      return ok([].rand() === void 0, "[].rand() === undefined");
    });
    test("#remove", function() {
      var array;
      equals([1, 2, 3].remove(2), 2, "[1,2,3].remove(2) === 2");
      equals([1, 3].remove(2), void 0, "[1,3].remove(2) === undefined");
      equals([1, 3].remove(3), 3, "[1,3].remove(3) === 3");
      array = [1, 2, 3];
      array.remove(2);
      ok(array.length === 2, "array = [1,2,3]; array.remove(2); array.length === 2");
      array.remove(3);
      return ok(array.length === 1, "array = [1,3]; array.remove(3); array.length === 1");
    });
    test("#map", function() {
      return equals([1].map(function(x) {
        return x + 1;
      })[0], 2);
    });
    test("#invoke", function() {
      var results;
      results = ['hello', 'world', 'cool!'].invoke('substring', 0, 3);
      equals(results[0], "hel");
      equals(results[1], "wor");
      return equals(results[2], "coo");
    });
    test("#each", function() {
      var array, count;
      array = [1, 2, 3];
      count = 0;
      equals(array, array.each(function() {
        return count++;
      }));
      return equals(array.length, count);
    });
    test("#eachPair", function() {
      var array, sum;
      array = [1, 2, 3];
      sum = 0;
      array.eachPair(function(a, b) {
        return sum += a + b;
      });
      return equals(sum, 12);
    });
    test("#eachWithObject", function() {
      var array, result;
      array = [1, 2, 3];
      result = array.eachWithObject({}, function(element, hash) {
        return hash[element] = (element + 1).toString();
      });
      equals(result[1], "2");
      equals(result[2], "3");
      return equals(result[3], "4");
    });
    test("#shuffle", function() {
      var array, shuffledArray;
      array = [0, 1, 2, 3, 4, 5];
      shuffledArray = array.shuffle();
      shuffledArray.each(function(element) {
        return ok(array.indexOf(element) >= 0, "Every element in shuffled array is in orig array");
      });
      return array.each(function(element) {
        return ok(shuffledArray.indexOf(element) >= 0, "Every element in orig array is in shuffled array");
      });
    });
    test("#first", function() {
      equals([2].first(), 2);
      equals([1, 2, 3].first(), 1);
      return equals([].first(), void 0);
    });
    test("#last", function() {
      equals([2].last(), 2);
      equals([1, 2, 3].last(), 3);
      return equals([].first(), void 0);
    });
    test("#maxima", function() {
      var maxima;
      maxima = [-52, 0, 78].maxima();
      maxima.each(function(n) {
        return equals(n, 78);
      });
      maxima = [0, 0, 1, 0, 1, 0, 1, 0].maxima();
      equals(3, maxima.length);
      return maxima.each(function(n) {
        return equals(n, 1);
      });
    });
    test("#maximum", function() {
      return equals([-345, 38, 8347].maximum(), 8347);
    });
    test("#maximum with function", function() {
      return equals([3, 4, 5].maximum(function(n) {
        return n % 4;
      }), 3);
    });
    test("#minima", function() {
      var minima;
      minima = [-52, 0, 78].minima();
      minima.each(function(n) {
        return equals(n, -52);
      });
      minima = [0, 0, 1, 0, 1, 0, 1, 0].minima();
      equals(5, minima.length);
      return minima.each(function(n) {
        return equals(n, 0);
      });
    });
    test("#minimum", function() {
      return equals([-345, 38, 8347].minimum(), -345);
    });
    test("#pipeline", function() {
      var pipe;
      pipe = [
        function(x) {
          return x * x;
        }, function(x) {
          return x - 10;
        }
      ];
      return equals(pipe.pipeline(5), 15);
    });
    test("#extremes", function() {
      var array, extremes;
      array = [-7, 1, 11, 94];
      extremes = array.extremes();
      equals(extremes.min, -7, "Min is -7");
      return equals(extremes.max, 94, "Max is 94");
    });
    test("#extremes with fn", function() {
      var array, extremes;
      array = [1, 11, 94];
      extremes = array.extremes(function(value) {
        return value % 11;
      });
      equals(extremes.min, 11, extremes.min);
      return equals(extremes.max, 94, extremes.max);
    });
    test("#sum", function() {
      equals([].sum(), 0, "Empty array sums to zero");
      equals([2].sum(), 2, "[2] sums to 2");
      return equals([1, 2, 3, 4, 5].sum(), 15, "[1, 2, 3, 4, 5] sums to 15");
    });
    test("#eachSlice", function() {
      return [1, 2, 3, 4, 5, 6].eachSlice(2, function(array) {
        equals(array[0] % 2, 1);
        return equals(array[1] % 2, 0);
      });
    });
    test("#without", function() {
      var array, excluded;
      array = [1, 2, 3, 4];
      excluded = array.without([2, 4]);
      equals(excluded[0], 1);
      return equals(excluded[1], 3);
    });
    test("#clear", function() {
      var array;
      array = [1, 2, 3, 4];
      equals(array.length, 4);
      equals(array[0], 1);
      array.clear();
      equals(array.length, 0);
      return equals(array[0], void 0);
    });
    test("#unique", function() {
      var array;
      array = [0, 0, 0, 1, 1, 1, 2, 3];
      equals(array.unique().first(), 0);
      equals(array.unique().last(), 3);
      return equals(array.unique().length, 4);
    });
    test("#wrap", function() {
      var array;
      array = [0, 1, 2, 3, 4];
      equals(array.wrap(0), 0);
      equals(array.wrap(-1), 4);
      return equals(array.wrap(2), 2);
    });
    return test("#zip", function() {
      var a, b, c, output;
      a = [1, 2, 3];
      b = [4, 5, 6];
      c = [7, 8];
      output = a.zip(b, c);
      equals(output[0][0], 1);
      equals(output[0][1], 4);
      equals(output[0][2], 7);
      return equals(output[2][2], void 0);
    });
  });

}).call(this);

//# sourceURL=test/array.coffee;

  return module.exports;
},"test/function":function(require, global, module, exports, PACKAGE) {
  (function() {
  var equals, ok, test;

  require("../function");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Function", function() {
    test("#once", function() {
      var addScore, onceScore, score;
      score = 0;
      addScore = function() {
        return score += 100;
      };
      onceScore = addScore.once();
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function() {
        return onceScore();
      });
      return equals(score, 100);
    });
    test(".identity", function() {
      var I;
      I = Function.identity;
      return [0, 1, true, false, null, void 0].each(function(x) {
        return equals(I(x), x);
      });
    });
    test("#debounce", function(done) {
      var fn;
      fn = (function() {
        ok(true);
        return done();
      }).debounce(1);
      fn();
      fn();
      return fn();
    });
    test("#delay", function(done) {
      var fn;
      fn = function(x, y) {
        equals(x, 3);
        equals(y, "testy");
        return done();
      };
      return fn.delay(25, 3, "testy");
    });
    return test("#defer", function(done) {
      var fn;
      fn = function(x) {
        equals(x, 3);
        return done();
      };
      return fn.defer(3);
    });
  });

}).call(this);

//# sourceURL=test/function.coffee;

  return module.exports;
},"test/number":function(require, global, module, exports, PACKAGE) {
  (function() {
  var equalEnough, equals, ok, test;

  require("../number");

  ok = assert;

  equals = assert.equal;

  test = it;

  equalEnough = function(expected, actual, tolerance, message) {
    message || (message = "" + expected + " within " + tolerance + " of " + actual);
    return ok(expected + tolerance >= actual && expected - tolerance <= actual, message);
  };

  describe("Number", function() {
    test("#abs", function() {
      equals(5..abs(), 5, "(5).abs() equals 5");
      equals(4.2.abs(), 4.2, "(4.2).abs() equals 4.2");
      equals((-1.2).abs(), 1.2, "(-1.2).abs() equals 1.2");
      return equals(0..abs(), 0, "(0).abs() equals 0");
    });
    test("#ceil", function() {
      equals(4.9.ceil(), 5, "(4.9).floor() equals 5");
      equals(4.2.ceil(), 5, "(4.2).ceil() equals 5");
      equals((-1.2).ceil(), -1, "(-1.2).ceil() equals -1");
      return equals(3..ceil(), 3, "(3).ceil() equals 3");
    });
    test("#clamp", function() {
      equals(5..clamp(0, 3), 3);
      equals(5..clamp(-1, 0), 0);
      equals((-5).clamp(0, 1), 0);
      equals(1..clamp(0, null), 1);
      equals((-1).clamp(0, null), 0);
      equals((-10).clamp(-5, 0), -5);
      equals((-10).clamp(null, 0), -10);
      return equals(50..clamp(null, 10), 10);
    });
    test("#floor", function() {
      equals(4.9.floor(), 4, "(4.9).floor() equals 4");
      equals(4.2.floor(), 4, "(4.2).floor() equals 4");
      equals((-1.2).floor(), -2, "(-1.2).floor() equals -2");
      return equals(3..floor(), 3, "(3).floor() equals 3");
    });
    test("#round", function() {
      equals(4.5.round(), 5, "(4.5).round() equals 5");
      return equals(4.4.round(), 4, "(4.4).round() equals 4");
    });
    test("#sign", function() {
      equals(5..sign(), 1, "Positive number's sign is 1");
      equals((-3).sign(), -1, "Negative number's sign is -1");
      return equals(0..sign(), 0, "Zero's sign is 0");
    });
    test("#even", function() {
      [0, 2, -32].each(function(n) {
        return ok(n.even(), "" + n + " is even");
      });
      return [1, -1, 2.2, -3.784].each(function(n) {
        return equals(n.even(), false, "" + n + " is not even");
      });
    });
    test("#odd", function() {
      [1, 9, -37].each(function(n) {
        return ok(n.odd(), "" + n + " is odd");
      });
      return [0, 32, 2.2, -1.1].each(function(n) {
        return equals(n.odd(), false, "" + n + " is not odd");
      });
    });
    test("#times", function() {
      var n;
      n = 5;
      return equals(n.times(function() {}), n, "returns n");
    });
    test("#times called correct amount", function() {
      var count, n;
      n = 5;
      count = 0;
      n.times(function() {
        return count++;
      });
      return equals(n, count, "returns n");
    });
    test("#mod should have a positive result when used with a positive base and a negative number", function() {
      var n;
      n = -3;
      return equals(n.mod(8), 5, "Should 'wrap' and be positive.");
    });
    test("#degrees", function() {
      equals(180..degrees, Math.PI);
      return equals(1..degree, Math.TAU / 360);
    });
    test("#rotations", function() {
      equals(1..rotation, Math.TAU);
      return equals(0.5.rotations, Math.TAU / 2);
    });
    return test("#turns", function() {
      equals(1..turn, Math.TAU);
      return equals(0.5.turns, Math.TAU / 2);
    });
  });

}).call(this);

//# sourceURL=test/number.coffee;

  return module.exports;
},"test/string":function(require, global, module, exports, PACKAGE) {
  (function() {
  var equals, ok, test;

  require("../string");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("String", function() {
    test("#blank", function() {
      equals("  ".blank(), true, "A string containing only whitespace should be blank");
      equals("a".blank(), false, "A string that contains a letter should not be blank");
      equals("  a ".blank(), false);
      return equals("  \n\t ".blank(), true);
    });
    test("#extension", function() {
      equals("README".extension(), "");
      equals("README.md".extension(), "md");
      equals("jquery.min.js".extension(), "js");
      return equals("src/bouse.js.coffee".extension(), "coffee");
    });
    test("#parse", function() {
      equals("true".parse(), true, "parsing 'true' should equal boolean true");
      equals("false".parse(), false, "parsing 'true' should equal boolean true");
      equals("7.2".parse(), 7.2, "numbers should be cool too");
      equals('{"val": "a string"}'.parse().val, "a string", "even parsing objects works");
      return ok(''.parse() === '', "Empty string parses to exactly the empty string");
    });
    test("#startsWith", function() {
      ok("cool".startsWith("coo"));
      return equals("cool".startsWith("oo"), false);
    });
    test("#toInt", function() {
      equals("31.3".toInt(), 31);
      equals("31.".toInt(), 31);
      equals("-1.02".toInt(), -1);
      equals("009".toInt(), 9);
      equals("0109".toInt(), 109);
      return equals("F".toInt(16), 15);
    });
    return test("#withoutExtension", function() {
      equals("neat.png".withoutExtension(), "neat");
      return equals("not a file".withoutExtension(), "not a file");
    });
  });

}).call(this);

//# sourceURL=test/string.coffee;

  return module.exports;
},"util":function(require, global, module, exports, PACKAGE) {
  (function() {
  var __slice = [].slice;

  module.exports = {
    extend: function() {
      var name, source, sources, target, _i, _len;
      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        for (name in source) {
          target[name] = source[name];
        }
      }
      return target;
    }
  };

}).call(this);

//# sourceURL=util.coffee;

  return module.exports;
}}},"core":{"dependencies":{},"distribution":{"core":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Core, extend,
    __slice = [].slice;

  Core = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = {};
    }
    extend(self, {
      I: I,
      attrAccessor: function() {
        var attrNames;
        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        attrNames.forEach(function(attrName) {
          return self[attrName] = function(newValue) {
            if (arguments.length > 0) {
              I[attrName] = newValue;
              return self;
            } else {
              return I[attrName];
            }
          };
        });
        return self;
      },
      attrReader: function() {
        var attrNames;
        attrNames = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        attrNames.forEach(function(attrName) {
          return self[attrName] = function() {
            return I[attrName];
          };
        });
        return self;
      },
      extend: function() {
        var objects;
        objects = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return extend.apply(null, [self].concat(__slice.call(objects)));
      },
      include: function() {
        var Module, modules, _i, _len;
        modules = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (_i = 0, _len = modules.length; _i < _len; _i++) {
          Module = modules[_i];
          Module(I, self);
        }
        return self;
      }
    });
    return self;
  };

  extend = function() {
    var name, source, sources, target, _i, _len;
    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (name in source) {
        target[name] = source[name];
      }
    }
    return target;
  };

  module.exports = Core;

}).call(this);

//# sourceURL=core.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"entryPoint":"core","version":"0.6.0"};;

  return module.exports;
},"test/core":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Core, equals, ok, test;

  Core = require("../core");

  ok = assert;

  equals = assert.equal;

  test = it;

  describe("Core", function() {
    test("#extend", function() {
      var o;
      o = Core();
      o.extend({
        test: "jawsome"
      });
      return equals(o.test, "jawsome");
    });
    test("#attrAccessor", function() {
      var o;
      o = Core({
        test: "my_val"
      });
      o.attrAccessor("test");
      equals(o.test(), "my_val");
      equals(o.test("new_val"), o);
      return equals(o.test(), "new_val");
    });
    test("#attrReader", function() {
      var o;
      o = Core({
        test: "my_val"
      });
      o.attrReader("test");
      equals(o.test(), "my_val");
      equals(o.test("new_val"), "my_val");
      return equals(o.test(), "my_val");
    });
    test("#include", function() {
      var M, o, ret;
      o = Core({
        test: "my_val"
      });
      M = function(I, self) {
        self.attrReader("test");
        return self.extend({
          test2: "cool"
        });
      };
      ret = o.include(M);
      equals(ret, o, "Should return self");
      equals(o.test(), "my_val");
      return equals(o.test2, "cool");
    });
    return test("#include multiple", function() {
      var M, M2, o;
      o = Core({
        test: "my_val"
      });
      M = function(I, self) {
        self.attrReader("test");
        return self.extend({
          test2: "cool"
        });
      };
      M2 = function(I, self) {
        return self.extend({
          test2: "coolio"
        });
      };
      o.include(M, M2);
      return equals(o.test2, "coolio");
    });
  });

}).call(this);

//# sourceURL=test/core.coffee;

  return module.exports;
}}}},"distribution":{"cornerstone":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("extensions");

  global.Core = require("core");

  require("math").pollute();

}).call(this);

//# sourceURL=cornerstone.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","entryPoint":"cornerstone","dependencies":{"math":"distri/math:v0.2.0","extensions":"distri/extensions:v0.2.0","core":"distri/core:v0.6.0"}};;

  return module.exports;
},"test/cornerstone":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../cornerstone");

  describe("Cornerstone", function() {
    it("should provide Core", function() {
      return assert(Core);
    });
    it("should provide Matrix", function() {
      return assert(Matrix);
    });
    it("should provide Point", function() {
      return assert(Point);
    });
    it("should provide Random", function() {
      return assert(Random);
    });
    it("should provide rand", function() {
      return assert(rand);
    });
    return it("should provide Function#debounce", function() {
      return assert((function() {}).debounce);
    });
  });

}).call(this);

//# sourceURL=test/cornerstone.coffee;

  return module.exports;
}}},"finder":{"dependencies":{},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaultTypeMatcher, generate, get, parseResult, parseSelector, process;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    return self.extend({
      find: function(objects, selector, typeMatcher) {
        var matcher, results;
        results = [];
        matcher = generate(selector, typeMatcher);
        objects.forEach(function(object) {
          if (matcher(object)) {
            return results.push(object);
          }
        });
        return results;
      }
    });
  };

  parseSelector = function(selector) {
    return selector.split(",").invoke("trim");
  };

  parseResult = function(str) {
    try {
      return JSON.parse(str);
    } catch (_error) {
      return str;
    }
  };

  process = function(item) {
    var query, valueQuery;
    query = /^(\w+)?#?([\w\-]+)?\.?([\w\-]+)?=?([\w\-]+)?/.exec(item);
    if (query) {
      if (valueQuery = query[4]) {
        query[4] = parseResult(valueQuery);
      }
      return query.splice(1);
    } else {
      return [];
    }
  };

  get = function(object, property) {
    var value;
    value = object != null ? object[property] : void 0;
    if (typeof value === "function") {
      return value.call(object);
    } else {
      return value;
    }
  };

  defaultTypeMatcher = function(type, object) {
    return type === get(object, "class");
  };

  generate = function(selector, typeMatcher) {
    var components;
    if (selector == null) {
      selector = "";
    }
    if (typeMatcher == null) {
      typeMatcher = defaultTypeMatcher;
    }
    components = parseSelector(selector).map(function(piece) {
      return process(piece);
    });
    return function(object) {
      var attr, attrMatch, component, id, idMatch, type, typeMatch, value, _i, _len;
      for (_i = 0, _len = components.length; _i < _len; _i++) {
        component = components[_i];
        type = component[0], id = component[1], attr = component[2], value = component[3];
        idMatch = !id || (id === get(object, "id"));
        typeMatch = !type || typeMatcher(type, object);
        if (attr) {
          if (value != null) {
            attrMatch = get(object, attr) === value;
          } else {
            attrMatch = get(object, attr);
          }
        } else {
          attrMatch = true;
        }
        if (idMatch && typeMatch && attrMatch) {
          return true;
        }
      }
      return false;
    };
  };

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.1.3","remoteDependencies":["http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js"]};;

  return module.exports;
},"test/finder":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Finder;

  Finder = require("../main");

  describe("Finder", function() {
    var finder;
    finder = Finder();
    it("should find objects with normal properties", function() {
      var results;
      results = finder.find([
        {
          name: "duder"
        }
      ], ".name=duder");
      return assert.equal(results[0].name, "duder");
    });
    it("should find obects with method properties", function() {
      var results;
      results = finder.find([
        {
          name: function() {
            return "duder";
          }
        }
      ], ".name=duder");
      return assert.equal(results[0].name(), "duder");
    });
    it("should find objects by id attribute", function() {
      var results;
      results = finder.find([
        {
          id: "duder"
        }
      ], "#duder");
      return assert.equal(results[0].id, "duder");
    });
    it("should find objects by id method", function() {
      var results;
      results = finder.find([
        {
          id: function() {
            return "duder";
          }
        }
      ], "#duder");
      return assert.equal(results[0].id(), "duder");
    });
    return it("should allow specifying the type matcher", function() {
      var results;
      results = finder.find([
        {
          type: "duder"
        }
      ], "duder", function(type, object) {
        return object.type === type;
      });
      return assert.equal(results[0].type, "duder");
    });
  });

}).call(this);

//# sourceURL=test/finder.coffee;

  return module.exports;
}}},"hotkeys":{"dependencies":{},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    self.extend({
      addHotkey: function(key, method) {
        return $(document).bind("keydown", key, function(event) {
          if (typeof method === "function") {
            method({
              editor: self
            });
          } else {
            self[method]();
          }
          return event.preventDefault();
        });
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js","http://strd6.github.io/tempest/javascripts/envweb-v0.4.7.js"]};;

  return module.exports;
},"test/hotkeys":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Hotkeys;

  Hotkeys = require("../main");

  describe("hotkeys", function() {
    return it("should be hot", function(done) {
      var hotkeys;
      hotkeys = Hotkeys();
      hotkeys.addHotkey("a", function() {
        return done();
      });
      return $(document).trigger($.Event("keydown", {
        which: 65,
        keyCode: 65
      }));
    });
  });

}).call(this);

//# sourceURL=test/hotkeys.coffee;

  return module.exports;
}}},"jquery-utils":{"dependencies":{"hotkeys":{"dependencies":{},"distribution":{"hotkeys":function(require, global, module, exports, PACKAGE) {
  (function() {
  if (typeof jQuery !== "undefined" && jQuery !== null) {
    (function(jQuery) {
      var isFunctionKey, isTextAcceptingInput, keyHandler;
      isTextAcceptingInput = function(element) {
        return /textarea|select/i.test(element.nodeName) || element.type === "text" || element.type === "password";
      };
      isFunctionKey = function(event) {
        var _ref;
        return (event.type !== "keypress") && ((112 <= (_ref = event.which) && _ref <= 123));
      };
      jQuery.hotkeys = {
        version: "0.9.0",
        specialKeys: {
          8: "backspace",
          9: "tab",
          13: "return",
          16: "shift",
          17: "ctrl",
          18: "alt",
          19: "pause",
          20: "capslock",
          27: "esc",
          32: "space",
          33: "pageup",
          34: "pagedown",
          35: "end",
          36: "home",
          37: "left",
          38: "up",
          39: "right",
          40: "down",
          45: "insert",
          46: "del",
          96: "0",
          97: "1",
          98: "2",
          99: "3",
          100: "4",
          101: "5",
          102: "6",
          103: "7",
          104: "8",
          105: "9",
          106: "*",
          107: "+",
          109: "-",
          110: ".",
          111: "/",
          112: "f1",
          113: "f2",
          114: "f3",
          115: "f4",
          116: "f5",
          117: "f6",
          118: "f7",
          119: "f8",
          120: "f9",
          121: "f10",
          122: "f11",
          123: "f12",
          144: "numlock",
          145: "scroll",
          186: ";",
          187: "=",
          188: ",",
          189: "-",
          190: ".",
          191: "/",
          219: "[",
          220: "\\",
          221: "]",
          222: "'",
          224: "meta"
        },
        shiftNums: {
          "`": "~",
          "1": "!",
          "2": "@",
          "3": "#",
          "4": "$",
          "5": "%",
          "6": "^",
          "7": "&",
          "8": "*",
          "9": "(",
          "0": ")",
          "-": "_",
          "=": "+",
          ";": ":",
          "'": "\"",
          ",": "<",
          ".": ">",
          "/": "?",
          "\\": "|"
        }
      };
      keyHandler = function(handleObj) {
        var keys, origHandler;
        if (typeof handleObj.data !== "string") {
          return;
        }
        origHandler = handleObj.handler;
        keys = handleObj.data.toLowerCase().split(" ");
        return handleObj.handler = function(event) {
          var character, key, modif, possible, special, target, _i, _len;
          special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which];
          character = String.fromCharCode(event.which).toLowerCase();
          modif = "";
          possible = {};
          target = event.target;
          if (event.altKey && special !== "alt") {
            modif += "alt+";
          }
          if (event.ctrlKey && special !== "ctrl") {
            modif += "ctrl+";
          }
          if (event.metaKey && !event.ctrlKey && special !== "meta") {
            modif += "meta+";
          }
          if (this !== target) {
            if (isTextAcceptingInput(target) && !modif && !isFunctionKey(event)) {
              return;
            }
          }
          if (event.shiftKey && special !== "shift") {
            modif += "shift+";
          }
          if (special) {
            possible[modif + special] = true;
          } else {
            possible[modif + character] = true;
            possible[modif + jQuery.hotkeys.shiftNums[character]] = true;
            if (modif === "shift+") {
              possible[jQuery.hotkeys.shiftNums[character]] = true;
            }
          }
          for (_i = 0, _len = keys.length; _i < _len; _i++) {
            key = keys[_i];
            if (possible[key]) {
              return origHandler.apply(this, arguments);
            }
          }
        };
      };
      return jQuery.each(["keydown", "keyup", "keypress"], function() {
        return jQuery.event.special[this] = {
          add: keyHandler
        };
      });
    })(jQuery);
  } else {
    console.warn("jQuery not found, no hotkeys added :(");
  }

}).call(this);

//# sourceURL=hotkeys.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.9.2","entryPoint":"hotkeys","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js"]};;

  return module.exports;
},"test/hotkeys":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../hotkeys");

  describe("hotkeys binding", function() {
    return it("should bind a hotkey", function(done) {
      $(document).bind("keydown", "a", function() {
        return done();
      });
      return $(document).trigger($.Event("keydown", {
        which: 65,
        keyCode: 65
      }));
    });
  });

}).call(this);

//# sourceURL=test/hotkeys.coffee;

  return module.exports;
}}},"image-reader":{"dependencies":{},"distribution":{"drop":function(require, global, module, exports, PACKAGE) {
  (function() {
  (function($) {
    var defaults;
    $.event.fix = (function(originalFix) {
      return function(event) {
        event = originalFix.apply(this, arguments);
        if (event.type.indexOf('drag') === 0 || event.type.indexOf('drop') === 0) {
          event.dataTransfer = event.originalEvent.dataTransfer;
        }
        return event;
      };
    })($.event.fix);
    defaults = {
      callback: $.noop,
      matchType: /image.*/
    };
    return $.fn.dropImageReader = function(options) {
      var stopFn;
      if (typeof options === "function") {
        options = {
          callback: options
        };
      }
      options = $.extend({}, defaults, options);
      stopFn = function(event) {
        event.stopPropagation();
        return event.preventDefault();
      };
      return this.each(function() {
        var $this, element;
        element = this;
        $this = $(this);
        $this.bind('dragenter dragover dragleave', stopFn);
        return $this.bind('drop', function(event) {
          stopFn(event);
          return Array.prototype.forEach.call(event.dataTransfer.files, function(file) {
            var reader;
            if (!file.type.match(options.matchType)) {
              return;
            }
            reader = new FileReader();
            reader.onload = function(evt) {
              return options.callback.call(element, {
                dataURL: evt.target.result,
                event: evt,
                file: file,
                name: file.name
              });
            };
            return reader.readAsDataURL(file);
          });
        });
      });
    };
  })(jQuery);

}).call(this);

//# sourceURL=drop.coffee;

  return module.exports;
},"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("./paste");

  require("./drop");

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"paste":function(require, global, module, exports, PACKAGE) {
  (function() {
  (function($) {
    var defaults;
    $.event.fix = (function(originalFix) {
      return function(event) {
        event = originalFix.apply(this, arguments);
        if (event.type.indexOf('copy') === 0 || event.type.indexOf('paste') === 0) {
          event.clipboardData = event.originalEvent.clipboardData;
        }
        return event;
      };
    })($.event.fix);
    defaults = {
      callback: $.noop,
      matchType: /image.*/
    };
    return $.fn.pasteImageReader = function(options) {
      if (typeof options === "function") {
        options = {
          callback: options
        };
      }
      options = $.extend({}, defaults, options);
      return this.each(function() {
        var $this, element;
        element = this;
        $this = $(this);
        return $this.bind('paste', function(event) {
          var clipboardData, found;
          found = false;
          clipboardData = event.clipboardData;
          return Array.prototype.forEach.call(clipboardData.types, function(type, i) {
            var file, reader;
            if (found) {
              return;
            }
            if (type.match(options.matchType) || (clipboardData.items && clipboardData.items[i].type.match(options.matchType))) {
              file = clipboardData.items[i].getAsFile();
              reader = new FileReader();
              reader.onload = function(evt) {
                return options.callback.call(element, {
                  dataURL: evt.target.result,
                  event: evt,
                  file: file,
                  name: file.name
                });
              };
              reader.readAsDataURL(file);
              return found = true;
            }
          });
        });
      });
    };
  })(jQuery);

}).call(this);

//# sourceURL=paste.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js"]};;

  return module.exports;
},"test/image_reader":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../main");

  $("html").pasteImageReader(function(_arg) {
    var dataURL, event, file, name;
    name = _arg.name, dataURL = _arg.dataURL, file = _arg.file, event = _arg.event;
    return $("body").css({
      backgroundImage: "url(" + dataURL + ")"
    });
  });

  $("html").dropImageReader(function(_arg) {
    var dataURL, event, file, name;
    name = _arg.name, dataURL = _arg.dataURL, file = _arg.file, event = _arg.event;
    return $("body").css({
      backgroundImage: "url(" + dataURL + ")"
    });
  });

}).call(this);

//# sourceURL=test/image_reader.coffee;

  return module.exports;
}}}},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("hotkeys");

  require("image-reader");

  require("./take_class");

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.2.0","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js"],"dependencies":{"hotkeys":"distri/jquery-hotkeys:v0.9.2","image-reader":"distri/jquery-image_reader:v0.2.0"}};;

  return module.exports;
},"take_class":function(require, global, module, exports, PACKAGE) {
  (function() {
  (function($) {
    return $.fn.takeClass = function(name) {
      this.addClass(name).siblings().removeClass(name);
      return this;
    };
  })(jQuery);

}).call(this);

//# sourceURL=take_class.coffee;

  return module.exports;
},"test/image_reader":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../main");

  describe("jQuery#pasteImageReader", function() {
    return it("should exist", function() {
      return assert($.fn.pasteImageReader);
    });
  });

  describe("jQuery#dropImageReader", function() {
    return it("should exist", function() {
      return assert($.fn.dropImageReader);
    });
  });

}).call(this);

//# sourceURL=test/image_reader.coffee;

  return module.exports;
},"test/take_class":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../main");

  describe("jQuery#takeClass", function() {
    return it("should exist", function() {
      return assert($.fn.takeClass);
    });
  });

}).call(this);

//# sourceURL=test/take_class.coffee;

  return module.exports;
}}},"sprite":{"dependencies":{},"distribution":{"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var LoaderProxy, Sprite, defer, extend, spriteCache,
    __slice = [].slice;

  LoaderProxy = function() {
    return {
      draw: function() {},
      fill: function() {},
      width: null,
      height: null,
      image: null
    };
  };

  spriteCache = {};

  Sprite = function(image, sourceX, sourceY, width, height) {
    sourceX || (sourceX = 0);
    sourceY || (sourceY = 0);
    width || (width = image.width);
    height || (height = image.height);
    return {
      draw: function(canvas, x, y) {
        var _ref;
        if (x.x != null) {
          _ref = x, x = _ref.x, y = _ref.y;
        }
        return canvas.drawImage(image, sourceX, sourceY, width, height, x, y, width, height);
      },
      fill: function(canvas, x, y, width, height, repeat) {
        var pattern;
        if (repeat == null) {
          repeat = "repeat";
        }
        pattern = canvas.createPattern(image, repeat);
        return canvas.drawRect({
          x: x,
          y: y,
          width: width,
          height: height,
          color: pattern
        });
      },
      width: width,
      height: height,
      image: image
    };
  };

  Sprite.loadSheet = function(name, tileWidth, tileHeight) {
    var image, sprites, url;
    url = ResourceLoader.urlFor("images", name);
    sprites = [];
    image = new Image();
    image.onload = function() {
      var imgElement;
      imgElement = this;
      return (image.height / tileHeight).times(function(row) {
        return (image.width / tileWidth).times(function(col) {
          return sprites.push(Sprite(imgElement, col * tileWidth, row * tileHeight, tileWidth, tileHeight));
        });
      });
    };
    image.src = url;
    return sprites;
  };

  Sprite.fromURL = Sprite.load = function(url, loadedCallback) {
    var img, proxy, sprite;
    if (sprite = spriteCache[url]) {
      if (loadedCallback != null) {
        defer(loadedCallback, sprite);
      }
      return sprite;
    }
    spriteCache[url] = proxy = LoaderProxy();
    img = new Image();
    img.onload = function() {
      extend(proxy, Sprite(this));
      return typeof loadedCallback === "function" ? loadedCallback(proxy) : void 0;
    };
    img.src = url;
    return proxy;
  };

  Sprite.EMPTY = Sprite.NONE = LoaderProxy();

  module.exports = Sprite;

  extend = function() {
    var name, source, sources, target, _i, _len;
    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (name in source) {
        target[name] = source[name];
      }
    }
    return target;
  };

  defer = function() {
    var args, fn;
    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return setTimeout(function() {
      return fn.apply(null, args);
    }, 1);
  };

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.3.0"};;

  return module.exports;
},"test/sprite":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Sprite;

  Sprite = require("../main");

  describe("Sprite", function() {
    it("should construct sprites", function() {
      var img;
      img = new Image;
      return assert(Sprite(img));
    });
    return it("should construct from data urls", function(done) {
      return assert(Sprite.load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAACAAAAAgAIf6nJ0AAACGSURBVEjH7ZTRDYAgDEQP46wdgSEcgdncpX6IpsGUi4HGH+8POLhHSQGYFNpbXugBRImkU+cwwfcHJOpQ49LnrmGClaYS3gACL91RAMGL9CkEfV2d2OnIQII21aGY3wtScwoAMfN2XMJ6QcwtpTHuADYA+azHTRHzH4jz6rlSTK3Br18AcABNHBto+dslMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMS0wOC0yMFQxNDo1NjoxMi0wNzowMIGIK7sAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTEtMDgtMjBUMTQ6NTY6MTItMDc6MDDw1ZMHAAAAAElFTkSuQmCC", function() {
        return done();
      }));
    });
  });

}).call(this);

//# sourceURL=test/sprite.coffee;

  return module.exports;
}}},"touch-canvas":{"dependencies":{"pixie-canvas":{"dependencies":{},"distribution":{"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"entryPoint":"pixie_canvas","version":"0.9.1"};;

  return module.exports;
},"pixie_canvas":function(require, global, module, exports, PACKAGE) {
  (function() {
  var TAU, defaults,
    __slice = [].slice;

  TAU = 2 * Math.PI;

  module.exports = function(options) {
    var canvas, canvasAttrAccessor, context, contextAttrAccessor, self;
    if (options == null) {
      options = {};
    }
    defaults(options, {
      width: 400,
      height: 400,
      init: function() {}
    });
    canvas = document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    context = void 0;
    self = {
      clear: function(_arg) {
        var height, width, x, y, _ref;
        _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height;
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        if (width == null) {
          width = canvas.width;
        }
        if (height == null) {
          height = canvas.height;
        }
        context.clearRect(x, y, width, height);
        return this;
      },
      fill: function(color) {
        var bounds, height, width, x, y, _ref;
        if (color == null) {
          color = {};
        }
        if (!((typeof color === "string") || color.channels)) {
          _ref = color, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height, bounds = _ref.bounds, color = _ref.color;
        }
        if (bounds) {
          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        }
        x || (x = 0);
        y || (y = 0);
        if (width == null) {
          width = canvas.width;
        }
        if (height == null) {
          height = canvas.height;
        }
        this.fillColor(color);
        context.fillRect(x, y, width, height);
        return this;
      },
      drawImage: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        context.drawImage.apply(context, args);
        return this;
      },
      drawCircle: function(_arg) {
        var circle, color, position, radius, stroke, x, y;
        x = _arg.x, y = _arg.y, radius = _arg.radius, position = _arg.position, color = _arg.color, stroke = _arg.stroke, circle = _arg.circle;
        if (circle) {
          x = circle.x, y = circle.y, radius = circle.radius;
        }
        if (position) {
          x = position.x, y = position.y;
        }
        if (radius < 0) {
          radius = 0;
        }
        context.beginPath();
        context.arc(x, y, radius, 0, TAU, true);
        context.closePath();
        if (color) {
          this.fillColor(color);
          context.fill();
        }
        if (stroke) {
          this.strokeColor(stroke.color);
          this.lineWidth(stroke.width);
          context.stroke();
        }
        return this;
      },
      drawRect: function(_arg) {
        var bounds, color, height, position, stroke, width, x, y;
        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;
        if (bounds) {
          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        }
        if (position) {
          x = position.x, y = position.y;
        }
        if (color) {
          this.fillColor(color);
          context.fillRect(x, y, width, height);
        }
        if (stroke) {
          this.strokeColor(stroke.color);
          this.lineWidth(stroke.width);
          context.strokeRect(x, y, width, height);
        }
        return this;
      },
      drawLine: function(_arg) {
        var color, direction, end, length, start, width;
        start = _arg.start, end = _arg.end, width = _arg.width, color = _arg.color, direction = _arg.direction, length = _arg.length;
        width || (width = 3);
        if (direction) {
          end = direction.norm(length).add(start);
        }
        this.lineWidth(width);
        this.strokeColor(color);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.closePath();
        context.stroke();
        return this;
      },
      drawPoly: function(_arg) {
        var color, points, stroke;
        points = _arg.points, color = _arg.color, stroke = _arg.stroke;
        context.beginPath();
        points.forEach(function(point, i) {
          if (i === 0) {
            return context.moveTo(point.x, point.y);
          } else {
            return context.lineTo(point.x, point.y);
          }
        });
        context.lineTo(points[0].x, points[0].y);
        if (color) {
          this.fillColor(color);
          context.fill();
        }
        if (stroke) {
          this.strokeColor(stroke.color);
          this.lineWidth(stroke.width);
          context.stroke();
        }
        return this;
      },
      drawRoundRect: function(_arg) {
        var bounds, color, height, position, radius, stroke, width, x, y;
        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, radius = _arg.radius, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;
        if (radius == null) {
          radius = 5;
        }
        if (bounds) {
          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        }
        if (position) {
          x = position.x, y = position.y;
        }
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        if (color) {
          this.fillColor(color);
          context.fill();
        }
        if (stroke) {
          this.lineWidth(stroke.width);
          this.strokeColor(stroke.color);
          context.stroke();
        }
        return this;
      },
      drawText: function(_arg) {
        var color, font, position, text, x, y;
        x = _arg.x, y = _arg.y, text = _arg.text, position = _arg.position, color = _arg.color, font = _arg.font;
        if (position) {
          x = position.x, y = position.y;
        }
        this.fillColor(color);
        if (font) {
          this.font(font);
        }
        context.fillText(text, x, y);
        return this;
      },
      centerText: function(_arg) {
        var color, font, position, text, textWidth, x, y;
        text = _arg.text, x = _arg.x, y = _arg.y, position = _arg.position, color = _arg.color, font = _arg.font;
        if (position) {
          x = position.x, y = position.y;
        }
        if (x == null) {
          x = canvas.width / 2;
        }
        textWidth = this.measureText(text);
        return this.drawText({
          text: text,
          color: color,
          font: font,
          x: x - textWidth / 2,
          y: y
        });
      },
      fillColor: function(color) {
        if (color) {
          if (color.channels) {
            context.fillStyle = color.toString();
          } else {
            context.fillStyle = color;
          }
          return this;
        } else {
          return context.fillStyle;
        }
      },
      strokeColor: function(color) {
        if (color) {
          if (color.channels) {
            context.strokeStyle = color.toString();
          } else {
            context.strokeStyle = color;
          }
          return this;
        } else {
          return context.strokeStyle;
        }
      },
      measureText: function(text) {
        return context.measureText(text).width;
      },
      withTransform: function(matrix, block) {
        context.save();
        context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        try {
          block(this);
        } finally {
          context.restore();
        }
        return this;
      },
      putImageData: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        context.putImageData.apply(context, args);
        return this;
      },
      context: function() {
        return context;
      },
      element: function() {
        return canvas;
      },
      createPattern: function(image, repitition) {
        return context.createPattern(image, repitition);
      },
      clip: function(x, y, width, height) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.clip();
        return this;
      }
    };
    contextAttrAccessor = function() {
      var attrs;
      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return attrs.forEach(function(attr) {
        return self[attr] = function(newVal) {
          if (newVal != null) {
            context[attr] = newVal;
            return this;
          } else {
            return context[attr];
          }
        };
      });
    };
    contextAttrAccessor("font", "globalAlpha", "globalCompositeOperation", "lineWidth", "textAlign");
    canvasAttrAccessor = function() {
      var attrs;
      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return attrs.forEach(function(attr) {
        return self[attr] = function(newVal) {
          if (newVal != null) {
            canvas[attr] = newVal;
            return this;
          } else {
            return canvas[attr];
          }
        };
      });
    };
    canvasAttrAccessor("height", "width");
    context = canvas.getContext('2d');
    options.init(self);
    return self;
  };

  defaults = function() {
    var name, object, objects, target, _i, _len;
    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      object = objects[_i];
      for (name in object) {
        if (!target.hasOwnProperty(name)) {
          target[name] = object[name];
        }
      }
    }
    return target;
  };

}).call(this);

//# sourceURL=pixie_canvas.coffee;

  return module.exports;
},"test/test":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Canvas;

  Canvas = require("../pixie_canvas");

  describe("pixie canvas", function() {
    return it("Should create a canvas", function() {
      var canvas;
      canvas = Canvas({
        width: 400,
        height: 150
      });
      assert(canvas);
      return assert(canvas.width() === 400);
    });
  });

}).call(this);

//# sourceURL=test/test.coffee;

  return module.exports;
}}}},"distribution":{"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"entryPoint":"touch_canvas","version":"0.3.0","remoteDependencies":["//code.jquery.com/jquery-1.10.1.min.js","http://strd6.github.io/tempest/javascripts/envweb.js"],"dependencies":{"pixie-canvas":"distri/pixie-canvas:v0.9.1"}};;

  return module.exports;
},"touch_canvas":function(require, global, module, exports, PACKAGE) {
  (function() {
  var MAX, PixieCanvas, TouchCanvas;

  PixieCanvas = require("pixie-canvas");

  MAX = 0.999999999999;

  TouchCanvas = function(I) {
    var active, element, localPosition, processTouches, self;
    if (I == null) {
      I = {};
    }
    self = PixieCanvas(I);
    Core(I, self);
    self.include(Bindable);
    element = self.element();
    active = false;
    $(element).on("mousedown", function(e) {
      active = true;
      return self.trigger("touch", localPosition(e));
    });
    $(element).on("touchstart", function(e) {
      return processTouches(event, function(touch) {
        return self.trigger("touch", localPosition(touch));
      });
    });
    $(element).on("mousemove", function(e) {
      if (active) {
        return self.trigger("move", localPosition(e));
      }
    });
    $(document).on("mousemove", function(e) {
      if (active) {
        return self.trigger("move", localPosition(e));
      }
    });
    $(element).on("touchmove", function(e) {
      return processTouches(event, function(touch) {
        return self.trigger("move", localPosition(touch));
      });
    });
    $(element).on("mouseup", function(e) {
      self.trigger("release", localPosition(e));
      active = false;
    });
    $(element).on("touchend", function(e) {
      return processTouches(event, function(touch) {
        return self.trigger("release", localPosition(touch));
      });
    });
    $(document).on("mouseup", function(e) {
      if (active) {
        self.trigger("release", localPosition(e));
      }
      active = false;
    });
    processTouches = function(event, fn) {
      var touches;
      event.preventDefault();
      if (event.type === "touchend") {
        touches = event.changedTouches;
      } else {
        touches = event.touches;
      }
      if (typeof self.debug === "function") {
        self.debug(Array.prototype.map.call(touches, function(_arg) {
          var identifier, pageX, pageY;
          identifier = _arg.identifier, pageX = _arg.pageX, pageY = _arg.pageY;
          return "[" + identifier + ": " + pageX + ", " + pageY + " (" + event.type + ")]\n";
        }));
      }
      return Array.prototype.forEach.call(touches, fn);
    };
    localPosition = function(e) {
      var $currentTarget, height, offset, point, width;
      $currentTarget = $(element);
      offset = $currentTarget.offset();
      width = $currentTarget.width();
      height = $currentTarget.height();
      point = Point(((e.pageX - offset.left) / width).clamp(0, MAX), ((e.pageY - offset.top) / height).clamp(0, MAX));
      point.identifier = (e.identifier + 1) || 0;
      return point;
    };
    return self;
  };

  module.exports = TouchCanvas;

}).call(this);

//# sourceURL=touch_canvas.coffee;

  return module.exports;
}}}},"distribution":{"engine":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, Engine, defaults;

  defaults = require("./util").defaults;

  Bindable = require("./modules/bindable");

  Engine = function(I, self) {
    var animLoop, draw, frameAdvance, lastStepTime, running, startTime, step, update;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      FPS: 60,
      paused: false
    });
    frameAdvance = false;
    running = false;
    startTime = +new Date();
    lastStepTime = -Infinity;
    animLoop = function(timestamp) {
      var delta, msPerFrame, remainder;
      timestamp || (timestamp = +new Date());
      msPerFrame = 1000 / I.FPS;
      delta = timestamp - lastStepTime;
      remainder = delta - msPerFrame;
      if (remainder > 0) {
        lastStepTime = timestamp - Math.min(remainder, msPerFrame);
        step();
      }
      if (running) {
        return window.requestAnimationFrame(animLoop);
      }
    };
    update = function(elapsedTime) {
      self.trigger("beforeUpdate", elapsedTime);
      self.trigger("update", elapsedTime);
      return self.trigger("afterUpdate", elapsedTime);
    };
    draw = function() {
      var canvas;
      if (!(canvas = I.canvas)) {
        return;
      }
      self.trigger("beforeDraw", canvas);
      self.trigger("draw", canvas);
      return self.trigger("overlay", canvas);
    };
    step = function() {
      var elapsedTime;
      if (!I.paused || frameAdvance) {
        elapsedTime = 1 / I.FPS;
        update(elapsedTime);
      }
      return draw();
    };
    self.extend({
      /**
      Start the game simulation.
      
          engine.start()
      
      @methodOf Engine#
      @name start
      */

      start: function() {
        if (!running) {
          running = true;
          window.requestAnimationFrame(animLoop);
        }
        return self;
      },
      /**
      Stop the simulation.
      
          engine.stop()
      
      @methodOf Engine#
      @name stop
      */

      stop: function() {
        running = false;
        return self;
      },
      /**
      Pause the game and step through 1 update of the engine.
      
          engine.frameAdvance()
      
      @methodOf Engine#
      @name frameAdvance
      */

      frameAdvance: function() {
        I.paused = true;
        frameAdvance = true;
        step();
        return frameAdvance = false;
      },
      /**
      Resume the game.
      
          engine.play()
      
      @methodOf Engine#
      @name play
      */

      play: function() {
        return I.paused = false;
      },
      /**
      Toggle the paused state of the simulation.
      
          engine.pause()
      
      @methodOf Engine#
      @name pause
      @param {Boolean} [setTo] Force to pause by passing true or unpause by passing false.
      */

      pause: function(setTo) {
        if (setTo != null) {
          return I.paused = setTo;
        } else {
          return I.paused = !I.paused;
        }
      },
      /**
      Query the engine to see if it is paused.
      
          engine.pause()
      
          engine.paused()
          # true
      
          engine.play()
      
          engine.paused()
          # false
      
      @methodOf Engine#
      @name paused
      */

      paused: function() {
        return I.paused;
      },
      /**
      Change the framerate of the game. The default framerate is 60 fps.
      
          engine.setFramerate(60)
      
      @methodOf Engine#
      @name setFramerate
      */

      setFramerate: function(newFPS) {
        I.FPS = newFPS;
        self.stop();
        return self.start();
      },
      update: update,
      draw: draw
    });
    Engine.defaultModules.each(function(module) {
      return self.include(module);
    });
    self.trigger("init");
    return self;
  };

  Engine.defaultModules = ["age", "engine/background", "engine/collision", "engine/game_state", "engine/finder", "engine/keyboard", "engine/mouse", "timed_events"].map(function(name) {
    return require("./modules/" + name);
  });

  module.exports = Engine;

}).call(this);

//# sourceURL=engine.coffee;

  return module.exports;
},"game_object":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject, defaults;

  defaults = require("./util").defaults;

  module.exports = GameObject = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    defaults(I, {
      active: true,
      created: false,
      destroyed: false
    });
    self.attrReader("id");
    self.extend({
      "class": function() {
        return I["class"] || "GameObject";
      },
      update: function(elapsedTime) {
        if (I.active) {
          self.trigger('update', elapsedTime);
        }
        return I.active;
      },
      create: function() {
        if (!I.created) {
          self.trigger('create');
        }
        return I.created = true;
      },
      destroy: function() {
        if (!I.destroyed) {
          self.trigger('destroy');
        }
        I.destroyed = true;
        return I.active = false;
      }
    });
    GameObject.defaultModules.each(function(module) {
      return self.include(module);
    });
    return self;
  };

  GameObject.defaultModules = ["bindable", "age", "bounded", "clamp", "cooldown", "drawable", "effect", "expirable", "follow", "meter", "movable", "rotatable", "timed_events", "tween"].map(function(name) {
    return require("./modules/" + name);
  });

  GameObject.construct = function(entityData) {
    var className, constructor;
    if (className = entityData["class"]) {
      if (constructor = GameObject.registry[className]) {
        return constructor(entityData);
      } else {
        throw "Unregistered constructor: " + className;
      }
    } else {
      return GameObject(entityData);
    }
  };

  GameObject.registry = {
    GameObject: GameObject
  };

}).call(this);

//# sourceURL=game_object.coffee;

  return module.exports;
},"game_state":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, GameObject, defaults;

  defaults = require("./util").defaults;

  Bindable = require("./modules/bindable");

  GameObject = require("../../game_object");

  module.exports = function(I, self) {
    var queuedObjects;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      objects: []
    });
    queuedObjects = [];
    self.extend({
      add: function(entityData) {
        var object;
        self.trigger("beforeAdd", entityData);
        object = GameObject.construct(entityData);
        object.create();
        self.trigger("afterAdd", object);
        if (I.updating) {
          queuedObjects.push(object);
        } else {
          I.objects.push(object);
        }
        return object;
      },
      objects: function() {
        return I.objects.copy();
      }
    });
    self.on("update", function(elapsedTime) {
      var toKeep, toRemove, _ref;
      I.updating = true;
      I.objects.invoke("trigger", "beforeUpdate", elapsedTime);
      _ref = I.objects.partition(function(object) {
        return object.update(elapsedTime);
      }), toKeep = _ref[0], toRemove = _ref[1];
      I.objects.invoke("trigger", "afterUpdate", elapsedTime);
      toRemove.invoke("trigger", "remove");
      I.objects = toKeep.concat(queuedObjects);
      queuedObjects = [];
      return I.updating = false;
    });
    self.include(require("./modules/cameras"));
    self.include(require("./modules/save_state"));
    return self;
  };

}).call(this);

//# sourceURL=game_state.coffee;

  return module.exports;
},"lib/collision":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Collision, collides;

  collides = function(a, b) {
    return Collision.rectangular(a.bounds(), b.bounds());
  };

  Collision = {
    /**
    Collision holds many useful class methods for checking geometric overlap of various objects.
    
        player = engine.add
          class: "Player"
          x: 0
          y: 0
          width: 10
          height: 10
    
        enemy = engine.add
          class: "Enemy"
          x: 5
          y: 5
          width: 10
          height: 10
    
        enemy2 = engine.add
          class: "Enemy"
          x: -5
          y: -5
          width: 10
          height: 10
    
        Collision.collide(player, enemy, (p, e) -> ...)
        # => callback is called once
    
        Collision.collide(player, [enemy, enemy2], (p, e) -> ...)
        # => callback is called twice
    
        Collision.collide("Player", "Enemy", (p, e) -> ...)
        # => callback is also called twice
    
    @name collide
    @methodOf Collision
    @param {Object|Array|String} groupA An object or set of objects to check collisions with
    @param {Object|Array|String} groupB An object or set of objects to check collisions with
    @param {Function} callback The callback to call when an object of groupA collides
    with an object of groupB: (a, b) ->
    @param {Function} [detectionMethod] An optional detection method to determine when two
    objects are colliding.
    */

    collide: function(groupA, groupB, callback, detectionMethod) {
      if (detectionMethod == null) {
        detectionMethod = collides;
      }
      if (Object.isString(groupA)) {
        groupA = engine.find(groupA);
      } else {
        groupA = [].concat(groupA);
      }
      if (Object.isString(groupB)) {
        groupB = engine.find(groupB);
      } else {
        groupB = [].concat(groupB);
      }
      return groupA.each(function(a) {
        return groupB.each(function(b) {
          if (detectionMethod(a, b)) {
            return callback(a, b);
          }
        });
      });
    },
    /**
    Takes two bounds objects and returns true if they collide (overlap), false otherwise.
    Bounds objects have x, y, width and height properties.
    
        player = GameObject
          x: 0
          y: 0
          width: 10
          height: 10
    
        enemy = GameObject
          x: 5
          y: 5
          width: 10
          height: 10
    
        Collision.rectangular(player, enemy)
        # => true
    
        Collision.rectangular(player, {x: 50, y: 40, width: 30, height: 30})
        # => false
    
    @name rectangular
    @methodOf Collision
    @param {Object} a The first rectangle
    @param {Object} b The second rectangle
    @returns {Boolean} true if the rectangles overlap, false otherwise
    */

    rectangular: function(a, b) {
      return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    },
    /**
    Takes two circle objects and returns true if they collide (overlap), false otherwise.
    Circle objects have x, y, and radius.
    
        player = GameObject
          x: 5
          y: 5
          radius: 10
    
        enemy = GameObject
          x: 10
          y: 10
          radius: 10
    
        farEnemy = GameObject
          x: 500
          y: 500
          radius: 30
    
        Collision.circular(player, enemy)
        # => true
    
        Collision.circular(player, farEnemy)
        # => false
    
    @name circular
    @methodOf Collision
    @param {Object} a The first circle
    @param {Object} b The second circle
    @returns {Boolean} true is the circles overlap, false otherwise
    */

    circular: function(a, b) {
      var dx, dy, r;
      r = a.radius + b.radius;
      dx = b.x - a.x;
      dy = b.y - a.y;
      return r * r >= dx * dx + dy * dy;
    },
    /**
    Detects whether a line intersects a circle.
    
        circle = engine.add
          class: "circle"
          x: 50
          y: 50
          radius: 10
    
        Collision.rayCircle(Point(0, 0), Point(1, 0), circle)
        # => true
    
    @name rayCircle
    @methodOf Collision
    @param {Point} source The starting position
    @param {Point} direction A vector from the point
    @param {Object} target The circle
    @returns {Boolean} true if the line intersects the circle, false otherwise
    */

    rayCircle: function(source, direction, target) {
      var dt, hit, intersection, intersectionToTarget, intersectionToTargetLength, laserToTarget, projection, projectionLength, radius;
      radius = target.radius();
      target = target.position();
      laserToTarget = target.subtract(source);
      projectionLength = direction.dot(laserToTarget);
      if (projectionLength < 0) {
        return false;
      }
      projection = direction.scale(projectionLength);
      intersection = source.add(projection);
      intersectionToTarget = target.subtract(intersection);
      intersectionToTargetLength = intersectionToTarget.length();
      if (intersectionToTargetLength < radius) {
        hit = true;
      }
      if (hit) {
        dt = Math.sqrt(radius * radius - intersectionToTargetLength * intersectionToTargetLength);
        return hit = direction.scale(projectionLength - dt).add(source);
      }
    },
    /**
    Detects whether a line intersects a rectangle.
    
        rect = engine.add
          class: "circle"
          x: 50
          y: 50
          width: 20
          height: 20
    
        Collision.rayRectangle(Point(0, 0), Point(1, 0), rect)
        # => true
    
    @name rayRectangle
    @methodOf Collision
    @param {Point} source The starting position
    @param {Point} direction A vector from the point
    @param {Object} target The rectangle
    @returns {Boolean} true if the line intersects the rectangle, false otherwise
    */

    rayRectangle: function(source, direction, target) {
      var areaPQ0, areaPQ1, hit, p0, p1, t, tX, tY, xval, xw, yval, yw, _ref, _ref1;
      if (!((target.xw != null) && (target.yw != null))) {
        if ((target.width != null) && (target.height != null)) {
          xw = target.width / 2;
          yw = target.height / 2;
          return Collision.rayRectangle(source, direction, {
            x: target.x + xw,
            y: target.y + yw,
            xw: xw,
            yw: yw
          });
        } else {
          error("Bounds object isn't a rectangle");
          return;
        }
      }
      xw = target.xw;
      yw = target.yw;
      if (source.x < target.x) {
        xval = target.x - xw;
      } else {
        xval = target.x + xw;
      }
      if (source.y < target.y) {
        yval = target.y - yw;
      } else {
        yval = target.y + yw;
      }
      if (direction.x === 0) {
        p0 = Point(target.x - xw, yval);
        p1 = Point(target.x + xw, yval);
        t = (yval - source.y) / direction.y;
      } else if (direction.y === 0) {
        p0 = Point(xval, target.y - yw);
        p1 = Point(xval, target.y + yw);
        t = (xval - source.x) / direction.x;
      } else {
        tX = (xval - source.x) / direction.x;
        tY = (yval - source.y) / direction.y;
        if ((tX < tY || ((-xw < (_ref = source.x - target.x) && _ref < xw))) && !((-yw < (_ref1 = source.y - target.y) && _ref1 < yw))) {
          p0 = Point(target.x - xw, yval);
          p1 = Point(target.x + xw, yval);
          t = tY;
        } else {
          p0 = Point(xval, target.y - yw);
          p1 = Point(xval, target.y + yw);
          t = tX;
        }
      }
      if (t > 0) {
        areaPQ0 = direction.cross(p0.subtract(source));
        areaPQ1 = direction.cross(p1.subtract(source));
        if (areaPQ0 * areaPQ1 < 0) {
          return hit = direction.scale(t).add(source);
        }
      }
    }
  };

  module.exports = Collision;

}).call(this);

//# sourceURL=lib/collision.coffee;

  return module.exports;
},"lib/easing":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Easing, PI, cos, polynomialEasings, pow, sin, τ;

  PI = Math.PI, sin = Math.sin, cos = Math.cos, pow = Math.pow;

  τ = 2 * PI;

  Easing = {
    sinusoidal: function(t) {
      return 1 - cos(t * τ / 4);
    },
    sinusoidalOut: function(t) {
      return 0 + sin(t * τ / 4);
    }
  };

  polynomialEasings = ["linear", "quadratic", "cubic", "quartic", "quintic"];

  polynomialEasings.each(function(easing, i) {
    var exponent, sign;
    exponent = i + 1;
    sign = exponent % 2 ? 1 : -1;
    Easing[easing] = function(t) {
      return pow(t, exponent);
    };
    return Easing["" + easing + "Out"] = function(t) {
      return 1 + sign * pow(t - 1, exponent);
    };
  });

  ["sinusoidal"].concat(polynomialEasings).each(function(easing) {
    var easeIn, easeOut;
    easeIn = Easing[easing];
    easeOut = Easing["" + easing + "Out"];
    return Easing["" + easing + "InOut"] = function(t) {
      if (t < 0.5) {
        return easeIn(2 * t);
      } else {
        return easeOut(2 * t - 1);
      }
    };
  });

  module.exports = Easing;

}).call(this);

//# sourceURL=lib/easing.coffee;

  return module.exports;
},"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Engine, TouchCanvas, applyStyleSheet;

  require("./setup");

  Engine = require("./engine");

  TouchCanvas = require("touch-canvas");

  applyStyleSheet = function() {
    var previousStyleNode, styleNode;
    styleNode = document.createElement("style");
    styleNode.innerHTML = require("./style");
    styleNode.className = "dust";
    if (previousStyleNode = document.head.querySelector("style.dust")) {
      previousStyleNode.parentNode.removeChild(prevousStyleNode);
    }
    return document.head.appendChild(styleNode);
  };

  module.exports = {
    init: function(options) {
      var canvas, engine, height, width;
      if (options == null) {
        options = {};
      }
      applyStyleSheet();
      width = options.width, height = options.height;
      if (width == null) {
        width = 640;
      }
      if (height == null) {
        height = 480;
      }
      canvas = TouchCanvas({
        width: width,
        height: height
      });
      $("body").append($("<div>", {
        "class": "main center"
      }));
      $(".main").append(canvas.element()).css({
        width: width,
        height: height
      });
      engine = Engine({
        canvas: canvas
      });
      engine.start();
      return engine;
    },
    Collision: require("/lib/collision"),
    Engine: Engine,
    GameObject: require("./game_object"),
    GameState: require("./game_state"),
    Sprite: require("sprite"),
    Util: require("./util")
  };

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"modules/age":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      age: 0
    });
    self.bind('afterUpdate', function(dt) {
      return I.age += dt;
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/age.coffee;

  return module.exports;
},"modules/bindable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var __slice = [].slice;

  module.exports = function(I, self) {
    var eventCallbacks;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    eventCallbacks = {};
    self.extend({
      on: function(namespacedEvent, callback) {
        var event, namespace, _ref;
        _ref = namespacedEvent.split("."), event = _ref[0], namespace = _ref[1];
        if (namespace) {
          callback.__PIXIE || (callback.__PIXIE = {});
          callback.__PIXIE[namespace] = true;
        }
        eventCallbacks[event] || (eventCallbacks[event] = []);
        eventCallbacks[event].push(callback);
        return self;
      },
      off: function(namespacedEvent, callback) {
        var callbacks, event, key, namespace, _ref;
        _ref = namespacedEvent.split("."), event = _ref[0], namespace = _ref[1];
        if (event) {
          eventCallbacks[event] || (eventCallbacks[event] = []);
          if (namespace) {
            eventCallbacks[event] = eventCallbacks.select(function(callback) {
              var _ref1;
              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;
            });
          } else {
            if (callback) {
              eventCallbacks[event].remove(callback);
            } else {
              eventCallbacks[event] = [];
            }
          }
        } else if (namespace) {
          for (key in eventCallbacks) {
            callbacks = eventCallbacks[key];
            eventCallbacks[key] = callbacks.select(function(callback) {
              var _ref1;
              return ((_ref1 = callback.__PIXIE) != null ? _ref1[namespace] : void 0) == null;
            });
          }
        }
        return self;
      },
      trigger: function() {
        var callbacks, event, parameters;
        event = arguments[0], parameters = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        callbacks = eventCallbacks[event];
        if (callbacks) {
          callbacks.forEach(function(callback) {
            return callback.apply(self, parameters);
          });
        }
        return self;
      }
    });
    return self.extend({
      bind: self.on,
      unbind: self.off
    });
  };

}).call(this);

//# sourceURL=modules/bindable.coffee;

  return module.exports;
},"modules/bounded":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Collision, defaults;

  Collision = require("../lib/collision");

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    defaults(I, {
      x: 0,
      y: 0,
      width: 8,
      height: 8,
      collisionMargin: Point(0, 0)
    });
    return self.extend({
      closest: function(selector) {
        var position;
        if (typeof selector === "string") {
          selector = engine.find(selector);
        } else {
          selector = [].concat(selector);
        }
        position = self.position();
        return selector.sort(function(a, b) {
          return Point.distanceSquared(position, a.position()) - Point.distanceSquared(position, b.position());
        }).first();
      },
      distance: function(otherObj) {
        return Point.distance(self.position(), otherObj.position());
      },
      position: function(newPosition) {
        if (newPosition != null) {
          I.x = newPosition.x;
          return I.y = newPosition.y;
        } else {
          return Point(I.x, I.y);
        }
      },
      changePosition: function(delta) {
        I.x += delta.x;
        I.y += delta.y;
        return self;
      },
      collides: function(bounds) {
        return Collision.rectangular(self.bounds(), bounds);
      },
      collisionBounds: function(xOffset, yOffset) {
        var bounds;
        bounds = self.bounds(xOffset, yOffset);
        bounds.x += I.collisionMargin.x;
        bounds.y += I.collisionMargin.y;
        bounds.width -= 2 * I.collisionMargin.x;
        bounds.height -= 2 * I.collisionMargin.y;
        return bounds;
      },
      bounds: function(xOffset, yOffset) {
        var center;
        center = self.center();
        return {
          x: center.x - I.width / 2 + (xOffset || 0),
          y: center.y - I.height / 2 + (yOffset || 0),
          width: I.width,
          height: I.height
        };
      },
      centeredBounds: function() {
        var center;
        center = self.center();
        return {
          x: center.x,
          y: center.y,
          xw: I.width / 2,
          yw: I.height / 2
        };
      },
      center: function(newCenter) {
        return self.position(newCenter);
      },
      circle: function() {
        var circle;
        circle = self.center();
        circle.radius = I.radius || I.width / 2 || I.height / 2;
        return circle;
      }
    });
  };

}).call(this);

//# sourceURL=modules/bounded.coffee;

  return module.exports;
},"modules/camera":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, Camera, defaults;

  Bindable = require("./bindable");

  defaults = require("../util").defaults;

  Camera = function(I, self) {
    var currentObject, currentType, focusOn, followTypes, module, objectFilters, transformFilters, _i, _len, _ref;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      screen: {
        x: 0,
        y: 0,
        width: 1024,
        height: 576
      },
      deadzone: Point(0, 0),
      zoom: 1,
      transform: Matrix(),
      velocity: Point(0, 0),
      maxSpeed: 750,
      t90: 2
    });
    if (I.x == null) {
      I.x = I.screen.width / 2;
    }
    if (I.y == null) {
      I.y = I.screen.height / 2;
    }
    if (I.cameraBounds == null) {
      I.cameraBounds = I.screen;
    }
    currentType = "centered";
    currentObject = null;
    objectFilters = [];
    transformFilters = [];
    focusOn = function(object, elapsedTime) {
      var c, dampingFactor, delta, force, objectCenter, target;
      dampingFactor = 2;
      c = elapsedTime * 3.75 / I.t90;
      if (c >= 1) {
        self.position(target);
        return I.velocity = Point(0, 0);
      } else {
        objectCenter = object.center();
        target = objectCenter;
        delta = target.subtract(self.position());
        force = delta.subtract(I.velocity.scale(dampingFactor));
        self.changePosition(I.velocity.scale(c).clamp(I.maxSpeed));
        return I.velocity = I.velocity.add(force.scale(c));
      }
    };
    followTypes = {
      centered: function(object, elapsedTime) {
        I.deadzone = Point(0, 0);
        return focusOn(object, elapsedTime);
      },
      topdown: function(object, elapsedTime) {
        var helper;
        helper = Math.max(I.screen.width, I.screen.height) / 4;
        I.deadzone = Point(helper, helper);
        return focusOn(object, elapsedTime);
      },
      platformer: function(object, elapsedTime) {
        var height, width;
        width = I.screen.width / 8;
        height = I.screen.height / 3;
        I.deadzone = Point(width, height);
        return focusOn(object, elapsedTime);
      }
    };
    self.extend({
      follow: function(object, type) {
        if (type == null) {
          type = "centered";
        }
        currentObject = object;
        return currentType = type;
      },
      objectFilterChain: function(fn) {
        return objectFilters.push(fn);
      },
      transformFilterChain: function(fn) {
        return transformFilters.push(fn);
      },
      screenToWorld: function(point) {
        return self.transform().inverse().transformPoint(point);
      }
    });
    self.attrAccessor("transform");
    self.on("afterUpdate", function(elapsedTime) {
      if (currentObject) {
        followTypes[currentType](currentObject, elapsedTime);
      }
      I.x = I.x.clamp(I.cameraBounds.x + I.screen.width / 2, I.cameraBounds.x + I.cameraBounds.width - I.screen.width / 2);
      I.y = I.y.clamp(I.cameraBounds.y + I.screen.height / 2, I.cameraBounds.y + I.cameraBounds.height - I.screen.height / 2);
      return I.transform = Matrix.translate(I.screen.width / 2 - I.x.floor(), I.screen.height / 2 - I.y.floor());
    });
    self.on("draw", function(canvas, objects) {
      return canvas.withTransform(Matrix.translate(I.screen.x, I.screen.y), function(canvas) {
        var transform;
        canvas.clip(0, 0, I.screen.width, I.screen.height);
        objects = objectFilters.pipeline(objects);
        transform = transformFilters.pipeline(self.transform().copy());
        return canvas.withTransform(transform, function(canvas) {
          self.trigger("beforeDraw", canvas);
          return objects.invoke("draw", canvas);
        });
      });
    });
    self.on("overlay", function(canvas, objects) {
      return canvas.withTransform(Matrix.translate(I.screen.x, I.screen.y), function(canvas) {
        canvas.clip(0, 0, I.screen.width, I.screen.height);
        objects = objectFilters.pipeline(objects);
        return objects.invoke("trigger", "overlay", canvas);
      });
    });
    self.include(require("./age"));
    self.include(require("./bounded"));
    _ref = Camera.defaultModules;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      module = _ref[_i];
      self.include(module);
    }
    return self;
  };

  Camera.defaultModules = ["z_sort", "shake", "zoom", "rotate", "flash", "fade", "transition"].map(function(name) {
    return require("./camera/" + name);
  });

  module.exports = Camera;

}).call(this);

//# sourceURL=modules/camera.coffee;

  return module.exports;
},"modules/camera/fade":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    var configureFade, fadeInDefaults, fadeOutDefaults;
    if (I == null) {
      I = {};
    }
    fadeInDefaults = {
      alpha: 0,
      color: 'black',
      duration: 30
    };
    fadeOutDefaults = {
      alpha: 1,
      color: 'transparent',
      duration: 30
    };
    configureFade = function(duration, color, alpha) {
      I.flashDuration = duration;
      I.flashCooldown = duration;
      I.flashColor = Color(color);
      return I.flashTargetAlpha = alpha;
    };
    return self.extend({
      fadeIn: function(options) {
        var alpha, color, duration, _ref;
        if (options == null) {
          options = {};
        }
        _ref = defaults(options, fadeInDefaults), alpha = _ref.alpha, color = _ref.color, duration = _ref.duration;
        return configureFade(duration, color, alpha);
      },
      fadeOut: function(options) {
        var alpha, color, duration, _ref;
        if (options == null) {
          options = {};
        }
        _ref = defaults(options, fadeOutDefaults), alpha = _ref.alpha, color = _ref.color, duration = _ref.duration;
        return configureFade(duration, color, alpha);
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/fade.coffee;

  return module.exports;
},"modules/camera/flash":function(require, global, module, exports, PACKAGE) {
  (function() {
  var approach, defaults, _ref;

  _ref = require("../../util"), approach = _ref.approach, defaults = _ref.defaults;

  module.exports = function(I, self) {
    var defaultParams;
    defaults(I, {
      flashAlpha: 0,
      flashColor: "black",
      flashDuration: 0.3,
      flashCooldown: 0,
      flashTargetAlpha: 0
    });
    defaultParams = {
      color: 'white',
      duration: 0.3,
      targetAlpha: 0
    };
    self.on('afterUpdate', function(dt) {
      if (I.flashCooldown > 0) {
        I.flashAlpha = approach(I.flashAlpha, 0, dt / I.flashDuration);
        return I.flashCooldown = approach(I.flashCooldown, 0, dt);
      }
    });
    self.on('overlay', function(canvas) {
      var previousAlpha;
      previousAlpha = canvas.globalAlpha();
      canvas.globalAlpha(I.flashAlpha);
      canvas.fill(I.flashColor);
      return canvas.globalAlpha(previousAlpha);
    });
    return {
      /**
      A convenient way to set the flash effect instance variables. Alternatively, you can modify them by hand, but
      using Camera#flash is the suggested approach.
      
          camera.flash()
          # => Sets the flash effect variables to their default state. This will cause a white flash that will turn transparent in the next 12 frames.
        
          camera.flash
            color: 'green'
            duration: 30
          # => This flash effect will start off green and fade to transparent over 30 frames.
        
          camera.flash
            color: Color(255, 0, 0, 0)
            duration: 20
            targetAlpha: 1
          # => This flash effect will start off transparent and move toward red over 20 frames 
      
      @name flash
      @methodOf Camera#
      @param {Color} [color="white"] The flash color
      @param {Number} [duration=12] How long the effect lasts
      @param {Number} [targetAlpha=0] The alpha value to fade to. By default, this is set to 0, which fades the color to transparent.
      */

      flash: function(options) {
        var color, duration, targetAlpha;
        if (options == null) {
          options = {};
        }
        defaults(options, defaultParams);
        color = options.color, duration = options.duration, targetAlpha = options.targetAlpha;
        I.flashColor = Color(color);
        I.flashTargetAlpha = targetAlpha;
        I.flashCooldown = duration;
        I.flashDuration = duration;
        return self;
      }
    };
  };

}).call(this);

//# sourceURL=modules/camera/flash.coffee;

  return module.exports;
},"modules/camera/rotate":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    defaults(I, {
      rotation: 0
    });
    self.transformFilterChain(function(transform) {
      return transform.rotate(I.rotation, self.position());
    });
    self.attrAccessor("rotation");
    return self.extend({
      rotate: function(amount) {
        return self.rotation(I.rotation + amount);
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/rotate.coffee;

  return module.exports;
},"modules/camera/shake":function(require, global, module, exports, PACKAGE) {
  (function() {
  var approach, defaults, _ref;

  _ref = require("../../util"), approach = _ref.approach, defaults = _ref.defaults;

  module.exports = function(I, self) {
    var defaultParams;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      shakeIntensity: 20,
      shakeCooldown: 0
    });
    defaultParams = {
      duration: 0.3,
      intensity: 20
    };
    self.on("afterUpdate", function(dt) {
      return I.shakeCooldown = approach(I.shakeCooldown, 0, dt);
    });
    self.transformFilterChain(function(transform) {
      if (I.shakeCooldown > 0) {
        transform.tx += Random.signed(I.shakeIntensity);
        transform.ty += Random.signed(I.shakeIntensity);
      }
      return transform;
    });
    return self.extend({
      shake: function(options) {
        var duration, intensity, _ref1;
        if (options == null) {
          options = {};
        }
        _ref1 = defaults(options, defaultParams), duration = _ref1.duration, intensity = _ref1.intensity;
        I.shakeCooldown = duration;
        I.shakeIntensity = intensity;
        return self;
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/shake.coffee;

  return module.exports;
},"modules/camera/transition":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults, extend, _ref;

  _ref = require("../../util"), defaults = _ref.defaults, extend = _ref.extend;

  module.exports = function(I, self) {
    var defaultOptions, transitionProgress, transitions;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      transitionActive: null,
      transitionStart: null,
      transitionEnd: null
    });
    defaultOptions = {
      color: "white"
    };
    transitionProgress = function() {
      return ((I.age - I.transitionStart) / (I.transitionEnd - I.transitionStart)).clamp(0, 1);
    };
    transitions = {
      angle: function(_arg) {
        var canvas, color, p0, p1, p2, p3, p4, screenSize, t;
        canvas = _arg.canvas, t = _arg.t, screenSize = _arg.screenSize, color = _arg.color;
        p0 = Point(t * (screenSize.x * 2), screenSize.y / 2);
        p1 = p0.subtract(Point(screenSize.x, screenSize.y / 2));
        p2 = p1.subtract(Point(screenSize.x, 0));
        p3 = p2.add(Point(0, screenSize.y));
        p4 = p3.add(Point(screenSize.x, 0));
        return canvas.drawPoly({
          points: [p0, p1, p2, p3, p4],
          color: color
        });
      },
      square: function(_arg) {
        var canvas, color, height, screenSize, t, width;
        canvas = _arg.canvas, t = _arg.t, screenSize = _arg.screenSize, color = _arg.color;
        width = 50;
        height = 50;
        return (screenSize.y / height).ceil().times(function(y) {
          return (screenSize.x / width).ceil().times(function(x) {
            var cellProgress;
            cellProgress = (2 * t - (x + y).mod(2)).clamp(0, 1);
            return canvas.drawRect({
              x: x * width,
              y: y * height,
              width: width,
              height: height * cellProgress,
              color: color
            });
          });
        });
      },
      line: function(_arg) {
        var canvas, color, height, screenSize, t;
        canvas = _arg.canvas, t = _arg.t, screenSize = _arg.screenSize, color = _arg.color;
        height = 50;
        return (screenSize.y / height).ceil().times(function(y) {
          return canvas.drawRect({
            x: 0,
            y: y * height,
            width: screenSize.x,
            height: height * t,
            color: color
          });
        });
      }
    };
    self.on("overlay", function(canvas) {
      var transitionName;
      if (transitionName = I.transitionActive) {
        return transitions[transitionName](extend({
          canvas: canvas,
          screenSize: Point(I.screen.width, I.screen.height),
          t: transitionProgress()
        }, I.transitionOptions));
      }
    });
    return self.extend({
      transition: function(_arg) {
        var duration, name, options, _ref1;
        _ref1 = _arg != null ? _arg : {}, name = _ref1.name, duration = _ref1.duration, options = _ref1.options;
        if (name == null) {
          name = "angle";
        }
        if (duration == null) {
          duration = 1;
        }
        if (options == null) {
          options = {};
        }
        I.transitionActive = name;
        I.transitionStart = I.age;
        I.transitionEnd = I.age + duration;
        return I.transitionOptions = defaults(options, defaultOptions);
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/transition.coffee;

  return module.exports;
},"modules/camera/z_sort":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      zSort: true
    });
    self.objectFilterChain(function(objects) {
      if (I.zSort) {
        objects.sort(function(a, b) {
          return a.I.zIndex - b.I.zIndex;
        });
      }
      return objects;
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/camera/z_sort.coffee;

  return module.exports;
},"modules/camera/zoom":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    var clampZoom;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      maxZoom: 10,
      minZoom: 0.1,
      zoom: 1
    });
    self.attrAccessor("zoom");
    self.transformFilterChain(function(transform) {
      return transform.scale(I.zoom, I.zoom, self.position());
    });
    clampZoom = function(value) {
      return value.clamp(I.minZoom, I.maxZoom);
    };
    return self.extend({
      zoomIn: function(percentage) {
        return self.zoom(clampZoom(I.zoom * (1 + percentage)));
      },
      zoomOut: function(percentage) {
        return self.zoom(clampZoom(I.zoom * (1 - percentage)));
      }
    });
  };

}).call(this);

//# sourceURL=modules/camera/zoom.coffee;

  return module.exports;
},"modules/cameras":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, Camera;

  Bindable = require("./bindable");

  Camera = require("./camera");

  module.exports = function(I, self) {
    var cameras;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable();
    }
    cameras = [Camera()];
    self.on('update', function(elapsedTime) {
      return self.cameras().invoke('trigger', 'update', elapsedTime);
    });
    self.on('afterUpdate', function(elapsedTime) {
      return self.cameras().invoke('trigger', 'afterUpdate', elapsedTime);
    });
    self.on('draw', function(canvas) {
      return self.cameras().invoke('trigger', 'draw', canvas, self.objects());
    });
    self.on('overlay', function(canvas) {
      return self.cameras().invoke('trigger', 'overlay', canvas, self.objects());
    });
    return self.extend({
      addCamera: function(data) {
        return cameras.push(Camera(data));
      },
      cameras: function(newCameras) {
        if (newCameras) {
          cameras = newCameras;
          return self;
        } else {
          return cameras;
        }
      }
    });
  };

}).call(this);

//# sourceURL=modules/cameras.coffee;

  return module.exports;
},"modules/clamp":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, defaults, extend, _ref;

  Bindable = require("./bindable");

  _ref = require("../util"), defaults = _ref.defaults, extend = _ref.extend;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      clampData: {}
    });
    self.on("afterUpdate", function() {
      var data, property, _ref1, _results;
      _ref1 = I.clampData;
      _results = [];
      for (property in _ref1) {
        data = _ref1[property];
        _results.push(I[property] = I[property].clamp(data.min, data.max));
      }
      return _results;
    });
    return self.extend({
      clamp: function(data) {
        return extend(I.clampData, data);
      },
      clampToBounds: function(bounds) {
        bounds || (bounds = Rectangle({
          x: 0,
          y: 0,
          width: App.width,
          height: App.height
        }));
        return self.clamp({
          x: {
            min: bounds.x + I.width / 2,
            max: bounds.width - I.width / 2
          },
          y: {
            min: bounds.y + I.height / 2,
            max: bounds.height - I.height / 2
          }
        });
      }
    });
  };

}).call(this);

//# sourceURL=modules/clamp.coffee;

  return module.exports;
},"modules/cooldown":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, approach, defaults, _ref;

  Bindable = require("./bindable");

  _ref = require("../util"), approach = _ref.approach, defaults = _ref.defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      cooldowns: {}
    });
    self.on("update", function(dt) {
      var approachBy, cooldownOptions, name, target, _ref1, _results;
      _ref1 = I.cooldowns;
      _results = [];
      for (name in _ref1) {
        cooldownOptions = _ref1[name];
        approachBy = cooldownOptions.approachBy, target = cooldownOptions.target;
        _results.push(I[name] = approach(I[name], target, approachBy * dt));
      }
      return _results;
    });
    return self.extend({
      cooldown: function(name, options) {
        var approachBy, target;
        if (options == null) {
          options = {};
        }
        target = options.target, approachBy = options.approachBy;
        if (target == null) {
          target = 0;
        }
        if (approachBy == null) {
          approachBy = 1;
        }
        if (I[name] == null) {
          I[name] = 0;
        }
        I.cooldowns[name] = {
          target: target,
          approachBy: approachBy
        };
        return self;
      }
    });
  };

}).call(this);

//# sourceURL=modules/cooldown.coffee;

  return module.exports;
},"modules/drawable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, defaults;

  Bindable = require("./bindable");

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      alpha: 1,
      color: "#196",
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      zIndex: 0
    });
    self.off(".Drawable");
    self.on('draw.Drawable', function(canvas) {
      var previousAlpha, sprite;
      if ((I.alpha != null) && I.alpha !== 1) {
        previousAlpha = canvas.context().globalAlpha;
        canvas.context().globalAlpha = I.alpha;
      }
      if (sprite = self.sprite()) {
        sprite.draw(canvas, -sprite.width / 2, -sprite.height / 2);
      } else {
        if (I.radius != null) {
          canvas.drawCircle({
            x: 0,
            y: 0,
            radius: I.radius,
            color: I.color
          });
        } else {
          canvas.drawRect({
            x: -I.width / 2,
            y: -I.height / 2,
            width: I.width,
            height: I.height,
            color: I.color
          });
        }
      }
      if ((I.alpha != null) && I.alpha !== 1) {
        return canvas.context().globalAlpha = previousAlpha;
      }
    });
    return self.extend({
      draw: function(canvas) {
        self.trigger('beforeTransform', canvas);
        canvas.withTransform(self.transform(), function(canvas) {
          self.trigger('beforeDraw', canvas);
          self.trigger('draw', canvas);
          return self.trigger('afterDraw', canvas);
        });
        self.trigger('afterTransform', canvas);
        return self;
      },
      sprite: function() {
        var name, url;
        if (name = I.spriteName) {
          return Sprite.loadByName(name);
        } else if (url = I.spriteURL) {
          return Sprite.load(url);
        }
      },
      transform: function() {
        var center, transform;
        center = self.center();
        transform = Matrix.translation(center.x.floor(), center.y.floor());
        transform = transform.concat(Matrix.scale(I.scale * I.scaleX, I.scale * I.scaleY));
        if (I.rotation) {
          transform = transform.concat(Matrix.rotation(I.rotation));
        }
        if (I.spriteOffset) {
          transform = transform.concat(Matrix.translation(I.spriteOffset.x, I.spriteOffset.y));
        }
        return transform;
      }
    });
  };

}).call(this);

//# sourceURL=modules/drawable.coffee;

  return module.exports;
},"modules/effect":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    return self.extend({
      fadeOut: function(duration, complete) {
        if (duration == null) {
          duration = 1;
        }
        return self.tween(duration, {
          alpha: 0,
          complete: complete
        });
      }
    });
  };

}).call(this);

//# sourceURL=modules/effect.coffee;

  return module.exports;
},"modules/engine/background":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../../util").defaults;

  module.exports = function(I, self) {
    var backgroundSprite;
    defaults(I, {
      background: null,
      backgroundColor: "#00010D",
      clear: false
    });
    self.attrAccessor("clear", "backgroundColor");
    backgroundSprite = function() {
      if (I.background) {
        return Sprite.loadByName(I.background);
      }
    };
    self.on("beforeDraw", function() {
      var sprite;
      if (I.clear) {
        return I.canvas.clear();
      } else if (sprite = backgroundSprite()) {
        return sprite.fill(I.canvas, 0, 0, I.canvas.width(), I.canvas.height());
      } else if (I.backgroundColor) {
        return I.canvas.fill(I.backgroundColor);
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/engine/background.coffee;

  return module.exports;
},"modules/engine/collision":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Collision;

  Collision = require("/lib/collision");

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    return self.extend({
      /**
      Detects collisions between a bounds and the game objects.
      
      @name collides
      @methodOf Engine#
      @param bounds The bounds to check collisions with.
      @param [sourceObject] An object to exclude from the results.
      @returns {Boolean} true if the bounds object collides with any of the game objects, false otherwise.
      */

      collides: function(bounds, sourceObject, selector) {
        if (selector == null) {
          selector = ".solid";
        }
        return self.find(selector).inject(false, function(collided, object) {
          return collided || (object !== sourceObject) && object.collides(bounds) && object;
        });
      },
      /**
      Detects collisions between a bounds and the game objects.
      Returns an array of objects colliding with the bounds provided.
      
      @name collidesWith
      @methodOf Engine#
      @param bounds The bounds to check collisions with.
      @param [sourceObject] An object to exclude from the results.
      @returns {Array} An array of objects that collide with the given bounds.
      */

      collidesWith: function(bounds, sourceObject, selector) {
        if (selector == null) {
          selector = ".solid";
        }
        return self.find(selector).select(function(object) {
          return object !== sourceObject && object.collides(bounds);
        });
      },
      /**
      Detects collisions between a ray and the game objects.
      
      @name rayCollides
      @methodOf Engine#
      @param source The origin point
      @param direction A point representing the direction of the ray
      @param [sourceObject] An object to exclude from the results.
      @param [selector] A selector to choos which objects in the engine to collide with
      */

      rayCollides: function(_arg) {
        var direction, hits, nearestDistance, nearestHit, selector, source, sourceObject;
        source = _arg.source, direction = _arg.direction, sourceObject = _arg.sourceObject, selector = _arg.selector;
        if (selector == null) {
          selector = "";
        }
        hits = self.find(selector).map(function(object) {
          var hit;
          hit = (object !== sourceObject) && Collision.rayRectangle(source, direction, object.centeredBounds());
          if (hit) {
            hit.object = object;
          }
          return hit;
        });
        nearestDistance = Infinity;
        nearestHit = null;
        hits.each(function(hit) {
          var d;
          if (hit && (d = hit.distance(source)) < nearestDistance) {
            nearestDistance = d;
            return nearestHit = hit;
          }
        });
        return nearestHit;
      },
      objectsUnderPoint: function(point, selector) {
        var bounds;
        if (selector == null) {
          selector = "";
        }
        bounds = {
          x: point.x,
          y: point.y,
          width: 0,
          height: 0
        };
        return self.find(selector).select(function(object) {
          return object.collides(bounds);
        });
      }
    });
  };

}).call(this);

//# sourceURL=modules/engine/collision.coffee;

  return module.exports;
},"modules/engine/finder":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Finder;

  Finder = require("finder");

  module.exports = function(I, self) {
    var finder;
    if (I == null) {
      I = {};
    }
    finder = Finder();
    return self.extend({
      find: function(selector) {
        return finder.find(self.objects(), selector);
      }
    });
  };

}).call(this);

//# sourceURL=modules/engine/finder.coffee;

  return module.exports;
},"modules/engine/game_state":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameState, defaults;

  defaults = require("../../util").defaults;

  GameState = require("../../game_state");

  module.exports = function(I, self) {
    var requestedState;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      currentState: GameState()
    });
    requestedState = null;
    self.on("update", function(elapsedTime) {
      I.currentState.trigger("beforeUpdate", elapsedTime);
      I.currentState.trigger("update", elapsedTime);
      return I.currentState.trigger("afterUpdate", elapsedTime);
    });
    self.on("afterUpdate", function() {
      var previousState;
      if (requestedState != null) {
        I.currentState.trigger("exit", requestedState);
        self.trigger('stateExited', I.currentState);
        previousState = I.currentState;
        I.currentState = requestedState;
        I.currentState.trigger("enter", previousState);
        self.trigger('stateEntered', I.currentState);
        return requestedState = null;
      }
    });
    self.on("draw", function(canvas) {
      I.currentState.trigger("beforeDraw", canvas);
      I.currentState.trigger("draw", canvas);
      return I.currentState.trigger("overlay", canvas);
    });
    return self.extend({
      add: function(classNameOrEntityData, entityData) {
        var object;
        if (entityData == null) {
          entityData = {};
        }
        if (typeof classNameOrEntityData === "string") {
          entityData["class"] = classNameOrEntityData;
        } else {
          entityData = classNameOrEntityData;
        }
        self.trigger("beforeAdd", entityData);
        object = I.currentState.add(entityData);
        self.trigger("afterAdd", object);
        return object;
      },
      camera: function(n) {
        if (n == null) {
          n = 0;
        }
        return self.cameras()[n];
      },
      cameras: function(newCameras) {
        if (newCameras != null) {
          I.currentState.cameras(newCameras);
          return self;
        } else {
          return I.currentState.cameras();
        }
      },
      fadeIn: function(options) {
        if (options == null) {
          options = {};
        }
        return self.cameras().invoke('fadeIn', options);
      },
      fadeOut: function(options) {
        if (options == null) {
          options = {};
        }
        return self.cameras().invoke('fadeOut', options);
      },
      flash: function(options) {
        if (options == null) {
          options = {};
        }
        return self.camera(options.camera).flash(options);
      },
      objects: function() {
        return I.currentState.objects();
      },
      setState: function(newState) {
        return requestedState = newState;
      },
      shake: function(options) {
        if (options == null) {
          options = {};
        }
        return self.camera(options.camera).shake(options);
      },
      saveState: function() {
        return I.currentState.saveState();
      },
      loadState: function(newState) {
        return I.currentState.loadState(newState);
      },
      reload: function() {
        return I.currentState.reload();
      }
    });
  };

}).call(this);

//# sourceURL=modules/engine/game_state.coffee;

  return module.exports;
},"modules/engine/keyboard":function(require, global, module, exports, PACKAGE) {
  (function() {
  var keyName, prevKeysDown, updateKeys;

  window.keydown = {};

  window.justPressed = {};

  window.justReleased = {};

  prevKeysDown = {};

  keyName = function(event) {
    return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
  };

  $(document).bind("keydown", function(event) {
    var key;
    key = keyName(event);
    return keydown[key] = true;
  });

  $(document).bind("keyup", function(event) {
    var key;
    key = keyName(event);
    return keydown[key] = false;
  });

  updateKeys = function() {
    var key, value, _results;
    window.justPressed = {};
    window.justReleased = {};
    keydown.any = false;
    for (key in keydown) {
      value = keydown[key];
      justPressed[key] = value && !prevKeysDown[key];
      justReleased[key] = !value && prevKeysDown[key];
      if (justPressed[key] || (typeof mousePressed !== "undefined" && mousePressed !== null ? mousePressed.left : void 0) || (typeof mousePressed !== "undefined" && mousePressed !== null ? mousePressed.right : void 0)) {
        justPressed.any = true;
      }
      if (value || (typeof mouseDown !== "undefined" && mouseDown !== null ? mouseDown.left : void 0) || (typeof mouseDown !== "undefined" && mouseDown !== null ? mouseDown.right : void 0)) {
        keydown.any = true;
      }
    }
    prevKeysDown = {};
    _results = [];
    for (key in keydown) {
      value = keydown[key];
      _results.push(prevKeysDown[key] = value);
    }
    return _results;
  };

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    self.on("beforeUpdate", function() {
      return updateKeys();
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/engine/keyboard.coffee;

  return module.exports;
},"modules/engine/mouse":function(require, global, module, exports, PACKAGE) {
  (function() {
  var buttonName, buttonNames, prevButtonsDown;

  window.mouseDown = {};

  window.mousePressed = {};

  window.mouseReleased = {};

  window.mousePosition = Point(0, 0);

  prevButtonsDown = {};

  buttonNames = {
    1: "left",
    2: "middle",
    3: "right"
  };

  buttonName = function(event) {
    return buttonNames[event.which];
  };

  $(document).bind("mousemove", function(event) {
    var offset;
    offset = $("canvas").offset() || {
      left: 0,
      top: 0
    };
    mousePosition.x = event.pageX - offset.left;
    return mousePosition.y = event.pageY - offset.top;
  });

  $(document).bind("mousedown", function(event) {
    return mouseDown[buttonName(event)] = true;
  });

  $(document).bind("mouseup", function(event) {
    return mouseDown[buttonName(event)] = false;
  });

  window.updateMouse = function() {
    var button, value, _results;
    window.mousePressed = {};
    window.mouseReleased = {};
    for (button in mouseDown) {
      value = mouseDown[button];
      if (!prevButtonsDown[button]) {
        mousePressed[button] = value;
      }
    }
    for (button in mouseDown) {
      value = mouseDown[button];
      if (prevButtonsDown[button]) {
        mouseReleased[button] = !value;
      }
    }
    prevButtonsDown = {};
    _results = [];
    for (button in mouseDown) {
      value = mouseDown[button];
      _results.push(prevButtonsDown[button] = value);
    }
    return _results;
  };

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    self.on("beforeUpdate", function() {
      return typeof updateMouse === "function" ? updateMouse() : void 0;
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/engine/mouse.coffee;

  return module.exports;
},"modules/expirable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable, defaults;

  Bindable = require("./bindable");

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Bindable(I);
    }
    defaults(I, {
      duration: -1
    });
    self.on("update", function(dt) {
      if (I.duration !== -1 && I.age >= I.duration) {
        return I.active = false;
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/expirable.coffee;

  return module.exports;
},"modules/follow":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    defaults(I, {
      velocity: Point(0, 0),
      speed: 1
    });
    self.attrAccessor("speed");
    return self.extend({
      follow: function(obj) {
        var position;
        if (obj.position != null) {
          position = obj.position();
        } else if (obj.x != null) {
          position = obj;
        }
        if (position) {
          return I.velocity = position.subtract(self.position()).norm(self.speed());
        }
      }
    });
  };

}).call(this);

//# sourceURL=modules/follow.coffee;

  return module.exports;
},"modules/meter":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      meters: {}
    });
    self.on('overlay', function(canvas) {
      var backgroundColor, borderColor, borderRadius, borderWidth, color, height, meterData, name, ratio, show, width, x, y, _ref, _ref1, _ref2;
      _ref = I.meters;
      for (name in _ref) {
        meterData = _ref[name];
        backgroundColor = meterData.backgroundColor, (_ref1 = meterData.border, borderColor = _ref1.color, borderRadius = _ref1.radius, borderWidth = _ref1.width), color = meterData.color, height = meterData.height, show = meterData.show, width = meterData.width, x = meterData.x, y = meterData.y;
        if (meterData.position != null) {
          _ref2 = meterData.position, x = _ref2.x, y = _ref2.y;
        }
        if (!show) {
          return;
        }
        ratio = (I[name] / I["" + name + "Max"]).clamp(0, 1);
        canvas.drawRoundRect({
          color: backgroundColor,
          radius: borderRadius,
          x: x,
          y: y,
          width: width,
          height: height
        });
        canvas.drawRoundRect({
          color: color,
          x: x,
          y: y,
          radius: borderRadius,
          width: width * ratio,
          height: height
        });
        canvas.drawRoundRect({
          x: x,
          y: y,
          width: width,
          height: height,
          radius: borderRadius,
          stroke: {
            color: borderColor,
            width: borderWidth
          }
        });
      }
    });
    return self.extend({
      /**
      Configures a meter to be drawn each overlay event.
      
          player = GameObject
      
          player.meter 'health',
            border
              color: 'brown'
              radius: 3
            color: 'pink'
            height: 20
            x: 5
            y: 5
            show: true
            width: 150
      
          # => Sets up a health meter, using all the configuration options
      
      @name meter
      @methodOf Metered#
      @param {String} name The name of the property to meter
      @param {Object} options The meter configuration options
      @param {String} border: color Color of the meter's border
      @param {Number} border: width Width of the meter's border
      @param {String} color Color of the meter's inner rectangle
      @param {Number} height Height of the meter
      @param {Object} position An x, y object representing the position of the meter
      @param {Number} x x position of the meter
      @param {Number} y y position of the meter
      @param {Number} border: radius Border radius of the meter
      @param {Boolean} show Boolean to toggle whether of not to display the meter
      @param {Number} width How wide the meter is
      */

      meter: function(name, options) {
        if (options == null) {
          options = {};
        }
        defaults(options, {
          backgroundColor: 'black',
          border: {
            color: 'white',
            radius: 2,
            width: 1.5
          },
          color: 'green',
          height: 10,
          x: 0,
          y: 0,
          show: true,
          width: 100
        });
        if (I[name] == null) {
          I[name] = 100;
        }
        if (!I["" + name + "Max"]) {
          if (I[name]) {
            I["" + name + "Max"] = I[name];
          } else {
            I["" + name + "Max"] = 100;
          }
        }
        return I.meters[name] = options;
      },
      /**
      Shows the named meter
      
          player = GameObject
      
          # creates a health meter but disables visibility
          player.meter 'health'
            show: false
      
          # enables visibility for the meter named 'health'
          player.showMeter 'health'
      
      @name showMeter
      @methodOf Metered#
      @param {String} name The name of the meter to show
      */

      showMeter: function(name) {
        return I.meters[name].show = true;
      },
      /**
      Hides the named meter
      
          player = GameObject
      
          # creates a health meter
          player.meter 'health'
      
          # disables visibility for the meter named 'health'
          player.hideMeter 'health'
      
      @name hideMeter
      @methodOf Metered#
      @param {String} name The name of the meter to hide
      */

      hideMeter: function(name) {
        return I.meters[name].show = false;
      },
      /**
      Toggles visibility of the named meter
      
          player = GameObject
      
          # creates a health meter
          player.meter 'health'
      
          # toggles visibility for the meter named 'health'
          player.toggleMeter 'health'
      
      @name toggleMeter
      @methodOf Metered#
      @param {String} name The name of the meter to toggle
      */

      toggleMeter: function(name) {
        return I.meters[name].show = !I.meters[name].show;
      }
    });
  };

}).call(this);

//# sourceURL=modules/meter.coffee;

  return module.exports;
},"modules/movable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      acceleration: Point(0, 0),
      velocity: Point(0, 0)
    });
    I.acceleration = Point(I.acceleration.x, I.acceleration.y);
    I.velocity = Point(I.velocity.x, I.velocity.y);
    self.attrReader("velocity", "acceleration");
    self.off(".Movable");
    return self.on('update.Movable', function(dt) {
      var currentSpeed;
      I.velocity = I.velocity.add(I.acceleration.scale(dt));
      if (I.maxSpeed != null) {
        currentSpeed = I.velocity.magnitude();
        if (currentSpeed > I.maxSpeed) {
          I.velocity = I.velocity.scale(I.maxSpeed / currentSpeed);
        }
      }
      I.x += I.velocity.x * dt;
      return I.y += I.velocity.y * dt;
    });
  };

}).call(this);

//# sourceURL=modules/movable.coffee;

  return module.exports;
},"modules/rotatable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      rotation: 0,
      rotationalVelocity: 0
    });
    self.on('update', function(dt) {
      return I.rotation += I.rotationalVelocity * dt;
    });
    return self;
  };

}).call(this);

//# sourceURL=modules/rotatable.coffee;

  return module.exports;
},"modules/save_state":function(require, global, module, exports, PACKAGE) {
  (function() {
  var extend;

  extend = require("/util").extend;

  module.exports = function(I, self) {
    var savedState;
    if (I == null) {
      I = {};
    }
    if (self == null) {
      self = Core(I);
    }
    savedState = null;
    return self.extend({
      saveState: function() {
        return savedState = I.objects.map(function(object) {
          return extend({}, object.I);
        });
      },
      loadState: function(newState) {
        if (newState || (newState = savedState)) {
          I.objects.invoke("trigger", "remove");
          I.objects = [];
          return newState.each(function(objectData) {
            return self.add(extend({}, objectData));
          });
        }
      },
      reload: function() {
        var oldObjects;
        oldObjects = I.objects;
        I.objects = [];
        oldObjects.each(function(object) {
          object.trigger("remove");
          return self.add(object.I);
        });
        return self;
      }
    });
  };

}).call(this);

//# sourceURL=modules/save_state.coffee;

  return module.exports;
},"modules/timed_events":function(require, global, module, exports, PACKAGE) {
  (function() {
  var defaults,
    __slice = [].slice;

  defaults = require("../util").defaults;

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      everyEvents: [],
      delayEvents: []
    });
    self.bind("update", function(elapsedTime) {
      var event, firingEvents, fn, period, _i, _len, _ref, _ref1;
      _ref = I.everyEvents;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        fn = event.fn, period = event.period;
        if (period <= 0) {
          continue;
        }
        while (event.lastFired < I.age + elapsedTime) {
          self.sendOrApply(fn);
          event.lastFired += period;
        }
      }
      _ref1 = I.delayEvents.partition(function(event) {
        return (event.delay -= elapsedTime) >= 0;
      }), I.delayEvents = _ref1[0], firingEvents = _ref1[1];
      return firingEvents.each(function(event) {
        return self.sendOrApply(event.fn);
      });
    });
    return self.extend({
      every: function(period, fn) {
        if (!(period > 0)) {
          return;
        }
        I.everyEvents.push({
          fn: fn,
          period: period,
          lastFired: I.age
        });
        return self;
      },
      delay: function(seconds, fn) {
        I.delayEvents.push({
          delay: seconds,
          fn: fn
        });
        return self;
      },
      sendOrApply: function() {
        var args, fn;
        fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (typeof fn === "function") {
          return fn.apply(self, args);
        } else {
          return self[fn].apply(self, args);
        }
      }
    });
  };

}).call(this);

//# sourceURL=modules/timed_events.coffee;

  return module.exports;
},"modules/tween":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Easing, defaults, extend, _ref;

  _ref = require("../util"), defaults = _ref.defaults, extend = _ref.extend;

  Easing = require("../lib/easing");

  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    defaults(I, {
      activeTweens: {}
    });
    self.on("update", function(elapsedTime) {
      var data, delta, duration, easing, easingFunction, end, endTime, property, start, startTime, t, _base, _ref1, _results;
      t = I.age + elapsedTime;
      _ref1 = I.activeTweens;
      _results = [];
      for (property in _ref1) {
        data = _ref1[property];
        start = data.start, end = data.end, startTime = data.startTime, endTime = data.endTime, duration = data.duration, easing = data.easing;
        delta = end - start;
        if (t >= endTime) {
          I[property] = end;
          if (typeof (_base = I.activeTweens[property]).complete === "function") {
            _base.complete();
          }
          _results.push(delete I.activeTweens[property]);
        } else {
          if (typeof easing === "string") {
            easingFunction = Easing[easing];
          } else {
            easingFunction = easing;
          }
          _results.push(I[property] = start + delta * easingFunction((t - startTime) / duration));
        }
      }
      return _results;
    });
    return self.extend({
      tween: function(duration, properties) {
        var complete, easing, property, target, _results;
        properties = extend({}, properties);
        easing = properties.easing || "linear";
        complete = properties.complete;
        delete properties.easing;
        delete properties.complete;
        _results = [];
        for (property in properties) {
          target = properties[property];
          _results.push(I.activeTweens[property] = {
            complete: complete,
            end: target,
            start: I[property],
            easing: easing,
            duration: duration,
            startTime: I.age,
            endTime: I.age + duration
          });
        }
        return _results;
      }
    });
  };

}).call(this);

//# sourceURL=modules/tween.coffee;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"version":"0.1.8-alpha.2","width":640,"height":480,"remoteDependencies":["https://code.jquery.com/jquery-1.10.1.min.js"],"dependencies":{"appcache":"distri/appcache:v0.2.0","cornerstone":"distri/cornerstone:v0.2.0","finder":"distri/finder:v0.1.3","hotkeys":"distri/hotkeys:v0.2.0","jquery-utils":"distri/jquery-utils:v0.2.0","sprite":"distri/sprite:v0.3.0","touch-canvas":"distri/touch-canvas:v0.3.0"}};;

  return module.exports;
},"setup":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("jquery-utils");

  require("appcache");

  require("cornerstone");

  global.Bindable = require("./modules/bindable");

  global.Sprite = require("sprite");

}).call(this);

//# sourceURL=setup.coffee;

  return module.exports;
},"style":function(require, global, module, exports, PACKAGE) {
  module.exports = "* {\n  -ms-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\nhtml {\n  height: 100%;\n}\n\nbody {\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;\n  font-weight: 300;\n  font-size: 18px;\n  height: 100%;\n  margin: 0;\n  overflow: hidden;\n  -ms-user-select: none;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  user-select: none;\n}\n\n.center {\n  bottom: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n}";;

  return module.exports;
},"test/engine":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Engine;

  require("../test_setup");

  Engine = require("../engine");

  describe("Engine", function() {
    var MockCanvas;
    MockCanvas = function() {
      return {
        clear: function() {},
        context: function() {
          return {
            beginPath: function() {},
            clip: function() {},
            rect: function() {}
          };
        },
        drawRect: function() {},
        fill: function() {},
        withTransform: function(t, fn) {
          return fn(this);
        },
        clip: function() {},
        globalAlpha: function() {}
      };
    };
    test("#play, #pause, and #paused", function() {
      var engine;
      engine = Engine();
      equal(engine.paused(), false);
      engine.pause();
      equal(engine.paused(), true);
      engine.play();
      equal(engine.paused(), false);
      engine.pause();
      equal(engine.paused(), true);
      engine.pause();
      equal(engine.paused(), false);
      engine.pause(false);
      equal(engine.paused(), false);
      engine.pause(true);
      return equal(engine.paused(), true);
    });
    test("#save and #restore", function() {
      var engine;
      engine = Engine();
      engine.add({});
      engine.add({});
      equals(engine.objects().length, 2);
      engine.saveState();
      engine.add({});
      equals(engine.objects().length, 3);
      engine.loadState();
      return equals(engine.objects().length, 2);
    });
    test("before add event", function() {
      var engine;
      engine = Engine();
      engine.bind("beforeAdd", function(data) {
        return equals(data.test, "test");
      });
      return engine.add({
        test: "test"
      });
    });
    test("#add", function() {
      var engine;
      engine = Engine();
      assert(engine.objects().length === 0);
      engine.add("GameObject", {
        test: true
      });
      return assert(engine.objects().length === 1);
    });
    test("#add class name only", function() {
      var engine;
      engine = Engine();
      assert(engine.objects().length === 0);
      engine.add("GameObject");
      return assert(engine.objects().length === 1);
    });
    test("zSort", function() {
      var bindDraw, engine, n, o1, o2;
      engine = Engine({
        canvas: MockCanvas(),
        zSort: true
      });
      n = 0;
      bindDraw = function(o) {
        return o.bind('draw', function() {
          n += 1;
          return o.I.drawnAt = n;
        });
      };
      o2 = engine.add({
        zIndex: 2
      });
      o1 = engine.add({
        zIndex: 1
      });
      bindDraw(o1);
      bindDraw(o2);
      engine.frameAdvance();
      equals(o1.I.drawnAt, 1, "Object with zIndex " + o1.I.zIndex + " should be drawn first");
      return equals(o2.I.drawnAt, 2, "Object with zIndex " + o2.I.zIndex + " should be drawn second");
    });
    test("draw events", function() {
      var calls, engine;
      engine = Engine({
        canvas: MockCanvas(),
        backgroundColor: false
      });
      calls = 0;
      engine.bind("beforeDraw", function() {
        calls += 1;
        return ok(true);
      });
      engine.bind("draw", function() {
        calls += 1;
        return ok(true);
      });
      engine.frameAdvance();
      return equals(calls, 2);
    });
    test("Remove event", function() {
      var called, engine, object;
      engine = Engine({
        backgroundColor: false
      });
      object = engine.add({
        active: false
      });
      called = 0;
      object.bind("remove", function() {
        called += 1;
        return ok(true, "remove called");
      });
      engine.frameAdvance();
      return assert.equal(called, 1);
    });
    test("#find", function() {
      var engine;
      engine = Engine();
      engine.add({
        id: "testy"
      });
      engine.add({
        test: true
      }).attrReader("test");
      engine.add({
        solid: true,
        opaque: false
      }).attrReader("solid", "opaque");
      equal(engine.find("#no_testy").length, 0, "No object with id `no_testy`");
      equal(engine.find("#testy").length, 1, "Object with id `testy`");
      equal(engine.find(".test").length, 1, "Object with attribute `test`");
      equal(engine.find(".solid=true").length, 1, "Object with attribute `solid` equal to true");
      return equal(engine.find(".opaque=false").length, 1, "Object with attribute `opaque` equal to false");
    });
    test("#camera", function() {
      var engine;
      engine = Engine();
      return equal(engine.camera(), engine.cameras().first());
    });
    test("#collides", function() {
      var engine;
      engine = Engine();
      return engine.collides({
        x: 0,
        y: 0,
        width: 10,
        height: 10
      }, null);
    });
    test("Integration", function() {
      var engine, object;
      engine = Engine({
        FPS: 30
      });
      object = engine.add({
        "class": "GameObject",
        velocity: Point(30, 0)
      });
      engine.frameAdvance();
      equals(object.I.x, 1);
      return equals(object.I.age, 1 / 30);
    });
    test("objectsUnderPoint", function() {
      var engine, object;
      engine = Engine();
      object = engine.add({
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
      equals(engine.objectsUnderPoint(Point(0, 0)).length, 1);
      return equals(engine.objectsUnderPoint(Point(300, 300)).length, 0);
    });
    return test("#setState");
    /*
      engine = Engine()
    
      # TODO: Shouldn't need to use the GameState constructor itself
      nextState = GameState()
    
      engine.setState nextState
    
      # Test state change events
      engine.bind "stateEntered", ->
        ok true
      engine.bind "stateExited", ->
        ok true
    
      engine.update()
    
      equal engine.I.currentState, nextState
    */

  });

}).call(this);

//# sourceURL=test/engine.coffee;

  return module.exports;
},"test/game_object":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../test_setup");

  GameObject = require("../game_object");

  describe("GameObject", function() {
    test("()", function() {
      var gameObject;
      gameObject = GameObject();
      return ok(gameObject);
    });
    test(".construct", function() {
      var gameObject;
      gameObject = GameObject.construct({
        name: "Gandalf"
      });
      return equals(gameObject.I.name, "Gandalf");
    });
    test("construct invalid object", function() {
      return raises(function() {
        return GameObject.construct({
          "class": "aaaaa"
        });
      });
    });
    test("#closest", function() {
      var o, other, other2;
      o = GameObject({
        x: 0,
        y: 0
      });
      other = GameObject({
        x: 1,
        y: 1
      });
      other2 = GameObject({
        x: 10,
        y: 10
      });
      equals(o.closest([]), null);
      return equals(o.closest([other, other2]), other);
    });
    test("elapsedTime", function() {
      var gameObject, timeStep;
      gameObject = GameObject();
      timeStep = 33;
      gameObject.bind("update", function(t) {
        return equals(t, timeStep);
      });
      return gameObject.update(timeStep);
    });
    test("[event] create", function() {
      var called, o;
      o = GameObject();
      called = 0;
      o.bind("create", function() {
        called += 1;
        return ok(true, "created event is fired on create");
      });
      o.create();
      o.create();
      return assert.equal(called, 1);
    });
    test("[event] update", function() {
      var gameObject;
      gameObject = GameObject();
      gameObject.bind("update", function() {
        return equals(gameObject.I.age, 0, 'Age should be 0 on first update');
      });
      return gameObject.trigger("update", 1);
    });
    return test("[event] destroy", function() {
      var called, o;
      o = GameObject();
      called = 0;
      o.bind("destroy", function() {
        called += 1;
        return ok(true, "destroyed event is fired on destroy");
      });
      o.destroy();
      o.destroy();
      return assert.equal(called, 1);
    });
  });

}).call(this);

//# sourceURL=test/game_object.coffee;

  return module.exports;
},"test/game_state":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameState;

  require("../test_setup");

  GameState = require("../game_state");

  describe("GameState", function() {
    return it("should be legit", function() {
      return assert(GameState());
    });
  });

}).call(this);

//# sourceURL=test/game_state.coffee;

  return module.exports;
},"test/modules/bindable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bindable;

  require("../../test_setup");

  Bindable = require("../../modules/bindable");

  describe("Bindable", function() {
    test("#bind and #trigger", function() {
      var o;
      o = Bindable();
      o.bind("test", function() {
        return ok(true);
      });
      return o.trigger("test");
    });
    test("Multiple bindings", function() {
      var o;
      o = Bindable();
      o.bind("test", function() {
        return ok(true);
      });
      o.bind("test", function() {
        return ok(true);
      });
      return o.trigger("test");
    });
    test("#trigger arguments", function() {
      var o, param1, param2;
      o = Bindable();
      param1 = "the message";
      param2 = 3;
      o.bind("test", function(p1, p2) {
        equal(p1, param1);
        return equal(p2, param2);
      });
      return o.trigger("test", param1, param2);
    });
    test("#unbind", function() {
      var callback, o;
      o = Bindable();
      callback = function() {
        return ok(false);
      };
      o.bind("test", callback);
      o.unbind("test", callback);
      o.trigger("test");
      o.bind("test", callback);
      o.unbind("test");
      return o.trigger("test");
    });
    test("#trigger namespace", function() {
      var o;
      o = Bindable();
      o.bind("test.TestNamespace", function() {
        return ok(true);
      });
      o.trigger("test");
      o.unbind(".TestNamespace");
      return o.trigger("test");
    });
    return test("#unbind namespaced", function() {
      var o;
      o = Bindable();
      o.bind("test.TestNamespace", function() {
        return ok(true);
      });
      o.trigger("test");
      o.unbind(".TestNamespace", function() {});
      return o.trigger("test");
    });
  });

}).call(this);

//# sourceURL=test/modules/bindable.coffee;

  return module.exports;
},"test/modules/bounded":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Bounded;

  require("../../test_setup");

  Bounded = require("../../modules/bounded");

  describe("Bounded", function() {
    test('it should have #distance', function() {
      var player;
      player = Bounded();
      return ok(player.distance);
    });
    test('it should proxy #distance to Point.distance', function() {
      var enemy, player;
      player = Bounded({
        x: 50,
        y: 50,
        width: 10,
        height: 10
      });
      enemy = Bounded({
        x: 110,
        y: 120,
        width: 7,
        height: 20
      });
      return equals(player.distance(enemy), Point.distance(player.position(), enemy.position()));
    });
    test("#bounds returns correct x, y, width, height", function() {
      var height, obj, width, x, y;
      x = 5;
      y = 10;
      width = 50;
      height = 75;
      obj = Bounded({
        x: x,
        y: y,
        width: width,
        height: height
      });
      equals(obj.bounds().x, x - width / 2);
      equals(obj.bounds().y, y - height / 2);
      equals(obj.bounds().width, width);
      return equals(obj.bounds().height, height);
    });
    test("#centeredBounds returns correct x, y, xw, yx", function() {
      var bounds, obj, x, y;
      x = -5;
      y = 20;
      obj = Bounded({
        x: x,
        y: y,
        width: 100,
        height: 200
      });
      bounds = obj.centeredBounds();
      equals(bounds.x, x);
      equals(bounds.y, y);
      equals(bounds.xw, 100 / 2);
      return equals(bounds.yw, 200 / 2);
    });
    test("#bounds(width, height) returns correct x, y", function() {
      var bounds, height, obj, offsetX, offsetY, width, x, y;
      x = 20;
      y = 10;
      width = 15;
      height = 25;
      offsetX = 7.5;
      offsetY = 12;
      obj = Bounded({
        x: x,
        y: y,
        width: width,
        height: height
      });
      bounds = obj.bounds(offsetX, offsetY);
      equals(bounds.x, obj.center().x + offsetX - width / 2);
      return equals(bounds.y, obj.center().y + offsetY - height / 2);
    });
    return test("#center returns correct center point", function() {
      var center, obj;
      obj = Bounded({
        x: -5,
        y: 20,
        width: 10,
        height: 60
      });
      center = obj.center();
      return ok(center.equal(Point(-5, 20)));
    });
  });

}).call(this);

//# sourceURL=test/modules/bounded.coffee;

  return module.exports;
},"test/modules/camera":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Camera, GameObject;

  GameObject = require("../../game_object");

  Camera = require("../../modules/camera");

  describe("Camera", function() {
    var MockCanvas;
    MockCanvas = function() {
      return {
        clear: function() {},
        context: function() {
          return {
            beginPath: function() {},
            clip: function() {},
            rect: function() {}
          };
        },
        drawRect: function() {},
        fill: function() {},
        withTransform: function(t, fn) {
          return fn(this);
        },
        clip: function() {},
        globalAlpha: function() {}
      };
    };
    test("create", function() {
      return ok(Camera());
    });
    test("follow", function() {
      var camera, dt, object, transform;
      object = GameObject();
      camera = Camera();
      dt = 1 / 60;
      camera.follow(object);
      camera.trigger("afterUpdate", dt);
      transform = camera.I.transform;
      assert(transform.tx != null, "tx exists: " + transform.tx);
      return assert(transform.ty != null, "ty exists: " + transform.ty);
    });
    test("overlay", function() {
      var called, camera, canvas, object;
      object = GameObject();
      called = 0;
      object.bind('overlay', function() {
        ok(true);
        return called += 1;
      });
      canvas = MockCanvas();
      camera = Camera();
      camera.trigger('overlay', canvas, [object]);
      return assert.equal(called, 1);
    });
    test("zoom", function() {
      var camera;
      camera = Camera();
      camera.zoom(2);
      assert.equal(camera.zoom(), 2);
      camera.zoomOut(0.5);
      return assert.equal(camera.zoom(), 1);
    });
    return test("shake", function() {
      var camera;
      camera = Camera();
      camera.shake({
        duration: 1,
        intensity: 10
      });
      assert.equal(camera.I.shakeCooldown, 1, "Should set shake duration");
      assert.equal(camera.I.shakeIntensity, 10, "Should set intensity");
      return camera.trigger("draw", MockCanvas(), []);
    });
  });

}).call(this);

//# sourceURL=test/modules/camera.coffee;

  return module.exports;
},"test/modules/clamp":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Clamp;

  require("../../test_setup");

  Clamp = require("../../modules/clamp");

  describe("Clamp", function() {
    return test("#clamp", function() {
      var max, o;
      o = Clamp({
        x: 1500
      });
      max = 100;
      o.clamp({
        x: {
          min: 0,
          max: max
        }
      });
      o.trigger("afterUpdate");
      return equals(o.I.x, max);
    });
  });

}).call(this);

//# sourceURL=test/modules/clamp.coffee;

  return module.exports;
},"test/modules/cooldown":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Cooldown", function() {
    test("objects count down each of their cooldowns", function() {
      var obj;
      obj = GameObject({
        bullet: 83,
        cooldowns: {
          bullet: {
            target: 3,
            approachBy: 1
          }
        }
      });
      5..times(function() {
        return obj.update(1);
      });
      equals(obj.I.bullet, 78, "bullet should decrease by 5");
      100..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.bullet, 3, "bullet should not cool down part target value");
    });
    test("should handle negative value", function() {
      var obj;
      obj = GameObject({
        powerup: -70,
        cooldowns: {
          powerup: {
            target: 0,
            approachBy: 1
          }
        }
      });
      11..times(function() {
        return obj.update(1);
      });
      equals(obj.I.powerup, -59, "powerup should increase by 11");
      70..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.powerup, 0, "powerup should not cooldown past target value");
    });
    test("adding many cooldowns to default instance variables", function() {
      var obj;
      obj = GameObject({
        cool: 20,
        rad: 0,
        tubular: 0,
        cooldowns: {
          cool: {
            approachBy: 5,
            target: -5
          },
          rad: {
            approachBy: 0.5,
            target: 1.5
          },
          tubular: {
            approachBy: 1,
            target: 1000
          }
        }
      });
      4..times(function() {
        return obj.update(1);
      });
      equals(obj.I.cool, 0);
      equals(obj.I.rad, 1.5);
      return equals(obj.I.tubular, 4);
    });
    test("#cooldown", function() {
      var obj;
      obj = GameObject({
        health: 100
      });
      obj.cooldown('health');
      3..times(function() {
        return obj.update(1);
      });
      equals(obj.I.health, 97, "health cooldown should exist and equal 97");
      obj.cooldown('turbo', {
        target: 25,
        approachBy: 3
      });
      4..times(function() {
        return obj.update(1);
      });
      equals(obj.I.health, 93, "health should continue of cool down when new cooldowns are added");
      return equals(obj.I.turbo, 12, "turbo should cool down normally");
    });
    test("should not blow up if cooldowns aren't specified", function() {
      var obj;
      obj = GameObject();
      obj.update(1);
      obj.trigger("afterUpdate", 1);
      return equals(obj.I.age, 1, "should successfully update");
    });
    test("use existing value of instance variable as starting value if no value param given", function() {
      var obj;
      obj = GameObject();
      obj.I.health = 3;
      obj.cooldown('health', {
        target: 10
      });
      5..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.health, 8);
    });
    return test("initialize property to 0 if no current value", function() {
      var obj;
      obj = GameObject();
      obj.cooldown('health', {
        target: 10
      });
      5..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.health, 5);
    });
  });

}).call(this);

//# sourceURL=test/modules/cooldown.coffee;

  return module.exports;
},"test/modules/drawable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Drawable", function() {
    test("alpha", function() {
      var object, object2;
      object = GameObject();
      equal(object.I.alpha, 1);
      object2 = GameObject({
        alpha: 0.5
      });
      return equal(object2.I.alpha, 0.5);
    });
    return test("scale", function() {
      var object, transform;
      object = GameObject();
      transform = object.transform();
      equal(transform.a, 1);
      equal(transform.d, 1);
      object = GameObject({
        scale: 2,
        scaleX: -1,
        scaleY: 0.5
      });
      transform = object.transform();
      equal(transform.a, -2);
      return equal(transform.d, 1);
    });
  });

}).call(this);

//# sourceURL=test/modules/drawable.coffee;

  return module.exports;
},"test/modules/effect":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Effect", function() {
    return test("fadeOut", function() {
      var fadedOut, player;
      player = GameObject();
      fadedOut = false;
      player.fadeOut(1, function() {
        return fadedOut = true;
      });
      player.trigger("update", 1);
      player.trigger("afterUpdate", 1);
      equals(player.I.alpha, 0, "Player has faded out");
      return ok(fadedOut, "callback was called");
    });
  });

}).call(this);

//# sourceURL=test/modules/effect.coffee;

  return module.exports;
},"test/modules/expirable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Expirable", function() {
    return test("objects become inactive after their duration", function() {
      var obj;
      obj = GameObject({
        duration: 5
      });
      4..times(function() {
        obj.update(1);
        return obj.trigger("afterUpdate", 1);
      });
      equals(obj.I.active, true, "object is active until duration is exceeded");
      5..times(function() {
        obj.update(1);
        return obj.trigger("afterUpdate", 1);
      });
      return equals(obj.I.active, false, "object is inactive after duration");
    });
  });

}).call(this);

//# sourceURL=test/modules/expirable.coffee;

  return module.exports;
},"test/modules/follow":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Follow", function() {
    return test("should set the correct velocity", function() {
      var enemy, player, rightEnemy;
      player = GameObject({
        x: 50,
        y: 50,
        width: 10,
        height: 10
      });
      enemy = GameObject({
        x: 0,
        y: 50,
        widht: 10,
        height: 10,
        speed: 1
      });
      enemy.follow(player);
      ok(enemy.I.velocity.equal(Point(1, 0)), 'enemy should head toward player with a velocity Point(1, 0)');
      rightEnemy = GameObject({
        x: 100,
        y: 50,
        width: 10,
        height: 10,
        speed: 1
      });
      rightEnemy.follow(player);
      return ok(rightEnemy.I.velocity.equal(Point(-1, 0)), 'rightEnemy should head toward player with a velocity Point(-1, 0)');
    });
  });

}).call(this);

//# sourceURL=test/modules/follow.coffee;

  return module.exports;
},"test/modules/meter":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe('Meter', function() {
    test("should respect 0 being set as the meter attribute", function() {
      var obj;
      obj = GameObject({
        health: 0,
        healthMax: 110
      });
      obj.meter('health');
      return equals(obj.I.health, 0);
    });
    test("should set max<Attribute> if it isn't present in the including object", function() {
      var obj;
      obj = GameObject({
        health: 150
      });
      obj.meter('health');
      return equals(obj.I.healthMax, 150);
    });
    return test("should set both <attribute> and max<attribute> if they aren't present in the including object", function() {
      var obj;
      obj = GameObject();
      obj.meter('turbo');
      equals(obj.I.turbo, 100);
      return equals(obj.I.turboMax, 100);
    });
  });

}).call(this);

//# sourceURL=test/modules/meter.coffee;

  return module.exports;
},"test/modules/movable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Movable", function() {
    test("should update velocity", function() {
      var particle;
      particle = GameObject({
        velocity: Point(1, 2),
        x: 50,
        y: 50
      });
      particle.update(1);
      equals(particle.I.x, 51, "x position updated according to velocity");
      return equals(particle.I.y, 52, "y position updated according to velocity");
    });
    test("should not exceed max speed", function() {
      var particle;
      particle = GameObject({
        velocity: Point(5, 5),
        acceleration: Point(1, 1),
        maxSpeed: 10
      });
      20..times(function() {
        return particle.update(1);
      });
      return ok(particle.I.velocity.magnitude() <= particle.I.maxSpeed, "magnitude of the velocity should not exceed maxSpeed");
    });
    test("should be able to get velocity", function() {
      var object;
      object = GameObject();
      return ok(object.velocity());
    });
    test("should be able to get acceleration", function() {
      var object;
      object = GameObject();
      return ok(object.acceleration());
    });
    return test("should increase velocity according to acceleration", function() {
      var particle;
      particle = GameObject({
        velocity: Point(0, -30),
        acceleration: Point(0, 60)
      });
      60..times(function() {
        return particle.update(1 / 60);
      });
      equals(particle.I.velocity.x, 0);
      return equals(particle.I.velocity.y, 30);
    });
  });

}).call(this);

//# sourceURL=test/modules/movable.coffee;

  return module.exports;
},"test/modules/rotatable":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Rotatable", function() {
    return test("objects update their rotation", function() {
      var obj;
      obj = GameObject({
        rotationalVelocity: Math.PI / 4,
        rotation: Math.PI / 6
      });
      equals(obj.I.rotation, Math.PI / 6, "Respects default rotation value");
      2..times(function() {
        return obj.update(1);
      });
      equals(obj.I.rotation, Math.PI / 2 + Math.PI / 6);
      4..times(function() {
        return obj.update(1);
      });
      return equals(obj.I.rotation, (3 / 2) * Math.PI + Math.PI / 6);
    });
  });

}).call(this);

//# sourceURL=test/modules/rotatable.coffee;

  return module.exports;
},"test/modules/tween":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  require("../../test_setup");

  GameObject = require("../../game_object");

  describe("Tweening", function() {
    return test("should allow for simple linear tweening", function() {
      var o, targetValue;
      o = GameObject({
        x: 0
      });
      targetValue = 10;
      o.tween(10, {
        x: targetValue
      });
      return 12..times(function(i) {
        o.update(1);
        o.trigger("afterUpdate", 1);
        return equals(o.I.x, Math.min(i + 1, targetValue));
      });
    });
  });

}).call(this);

//# sourceURL=test/modules/tween.coffee;

  return module.exports;
},"test_setup":function(require, global, module, exports, PACKAGE) {
  (function() {
  require("../../setup");

  global.test = it;

  global.ok = assert;

  global.equal = assert.equal;

  global.equals = assert.equal;

  global.raises = assert.throws;

}).call(this);

//# sourceURL=test_setup.coffee;

  return module.exports;
},"util":function(require, global, module, exports, PACKAGE) {
  (function() {
  var __slice = [].slice;

  module.exports = {
    approach: function(current, target, amount) {
      return (target - current).clamp(-amount, amount) + current;
    },
    defaults: function() {
      var name, object, objects, target, _i, _len;
      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (name in object) {
          if (!target.hasOwnProperty(name)) {
            target[name] = object[name];
          }
        }
      }
      return target;
    },
    extend: function() {
      var name, source, sources, target, _i, _len;
      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = sources.length; _i < _len; _i++) {
        source = sources[_i];
        for (name in source) {
          target[name] = source[name];
        }
      }
      return target;
    }
  };

}).call(this);

//# sourceURL=util.coffee;

  return module.exports;
},"test/dust":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Dust;

  Dust = require("../main");

  describe("Dust", function() {
    it("Should expose Util", function() {
      return assert(Dust.Util);
    });
    return it("Should expose Collision", function() {
      return assert(Dust.Collision);
    });
  });

}).call(this);

//# sourceURL=test/dust.coffee;

  return module.exports;
}}}},"distribution":{"base":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject;

  GameObject = require("dust").GameObject;

  module.exports = function(I) {
    var self;
    self = GameObject(I).extend({
      center: function() {
        return Point(I.x, I.y);
      }
    });
    self.on("drawDebug", function(canvas) {
      var center, x, y;
      if (I.radius) {
        center = self.center();
        x = center.x;
        y = center.y;
        return canvas.drawCircle({
          x: x,
          y: y,
          radius: I.radius,
          color: "rgba(255, 0, 255, 0.5)"
        });
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=base.coffee;

  return module.exports;
},"bounds_extensions":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = function(I, self) {
    if (I == null) {
      I = {};
    }
    self.extend({
      top: function() {
        return I.y - I.height / 2;
      },
      bottom: function() {
        return I.y + I.height / 2;
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=bounds_extensions.coffee;

  return module.exports;
},"cloud":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Base, GameObject, defaults, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  Base = require("./base");

  module.exports = GameObject.registry.Cloud = function(I) {
    var self;
    defaults(I, {
      spriteName: "cloud",
      height: 32,
      width: 128,
      y: -120 + rand(240),
      zIndex: 1
    });
    self = Base(I);
    self.on("update", function() {
      var destruction;
      destruction = engine.find(".destruction").first();
      if (destruction) {
        if (I.x < destruction.I.x - I.width) {
          return I.active = false;
        }
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=cloud.coffee;

  return module.exports;
},"destruction":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Base, GameObject, churnSprites, defaults, height, waveSprites, width, _ref, _ref1, _ref2;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  Base = require("./base");

  _ref2 = require("./pixie"), width = _ref2.width, height = _ref2.height;

  churnSprites = [Sprite.loadByName("churn")];

  waveSprites = ["wave", "wave1"].map(function(name) {
    return Sprite.loadByName(name);
  });

  module.exports = GameObject.registry.Destruction = function(I) {
    var self;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      color: "red",
      destruction: true,
      x: -240,
      y: 0,
      width: 10,
      height: height,
      zIndex: 7
    });
    self = GameObject(I);
    self.attrAccessor("destruction");
    self.on("update", function(dt) {
      var osc, player;
      osc = 30 * Math.sin(Math.TAU * I.age);
      I.x += (osc + 90) * dt;
      if (player = engine.find("Player").first()) {
        return I.x = I.x.clamp(player.I.x - width / 2 + osc, Infinity);
      }
    });
    return self.on("draw", function(canvas) {
      waveSprites.wrap((I.age / 8).floor()).fill(canvas, -width, 0, width + 16, height);
      return churnSprites.wrap((I.age / 8).floor()).fill(canvas, 0, 0, 32, height);
    });
  };

}).call(this);

//# sourceURL=destruction.coffee;

  return module.exports;
},"duct_tape":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject, extend, images, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, extend = _ref1.extend), GameObject = _ref.GameObject;

  images = require("./images");

  GameObject.defaultModules.push(require("./bounds_extensions"));

  Sprite.loadByName = function(name) {
    var url;
    url = images[name];
    return Sprite.load(url);
  };

  extend(Number.prototype, {
    approach: function(target, maxDelta) {
      return this + (target - this).clamp(-maxDelta, maxDelta);
    },
    approachByRatio: function(target, ratio) {
      return this.approach(target, this * ratio);
    },
    floor: function() {
      if (isNaN(this)) {
        throw "Can't floor NaN";
      } else {
        return Math.floor(this);
      }
    }
  });

}).call(this);

//# sourceURL=duct_tape.coffee;

  return module.exports;
},"game_over":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject, defaults, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  module.exports = GameObject.registry.GameOver = function(I) {
    var lineHeight, self;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      zIndex: 10
    });
    lineHeight = 24;
    self = GameObject(I);
    self.off("draw");
    self.on("overlay", function(canvas) {
      var lines;
      lines = ("surf'd for " + ((I.distance / 100).toFixed(2)) + " meters\nsur5'd for " + (I.time.toFixed(2)) + " seconds\nsuccumb'd to " + I.causeOfDeath).split("\n");
      canvas.font("24px bold 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif");
      return lines.forEach(function(line, i) {
        return canvas.centerText({
          color: "#FFF",
          text: line,
          y: 160 - (lines.length / 2 - i) * lineHeight
        });
      });
    });
    self.on("update", function() {
      if (keydown.space || keydown["return"] || keydown.escape) {
        return engine.trigger("restart");
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=game_over.coffee;

  return module.exports;
},"images":function(require, global, module, exports, PACKAGE) {
  module.exports = {"churn":"http://a0.pixiecdn.com/surfn/images/churn.png","cloud":"http://a0.pixiecdn.com/surfn/images/cloud.png","depths":"http://a0.pixiecdn.com/surfn/images/depths.png","depths0":"http://a0.pixiecdn.com/surfn/images/depths0.png","depths1":"http://a0.pixiecdn.com/surfn/images/depths1.png","player":"http://a0.pixiecdn.com/surfn/images/player.png","player_0":"http://a0.pixiecdn.com/surfn/images/player_0.png","player_10":"http://a0.pixiecdn.com/surfn/images/player_10.png","player_12":"http://a0.pixiecdn.com/surfn/images/player_12.png","player_14":"http://a0.pixiecdn.com/surfn/images/player_14.png","player_2":"http://a0.pixiecdn.com/surfn/images/player_2.png","player_4":"http://a0.pixiecdn.com/surfn/images/player_4.png","player_6":"http://a0.pixiecdn.com/surfn/images/player_6.png","player_8":"http://a0.pixiecdn.com/surfn/images/player_8.png","rocks":"http://a0.pixiecdn.com/surfn/images/rocks.png","wave":"http://a0.pixiecdn.com/surfn/images/wave.png","wave1":"http://a0.pixiecdn.com/surfn/images/wave1.png"};;

  return module.exports;
},"lib/music":function(require, global, module, exports, PACKAGE) {
  (function() {
  var track;

  track = $("<audio />", {
    loop: "loop"
  }).appendTo('body').get(0);

  track.volume = 1;

  module.exports = {
    play: function(name) {
      track.src = require("/music")["SurfN-2-Sur5"];
      return track.play();
    }
  };

}).call(this);

//# sourceURL=lib/music.coffee;

  return module.exports;
},"lib/preloader":function(require, global, module, exports, PACKAGE) {
  (function() {
  module.exports = {
    preload: function(_arg) {
      var complete, failedResource, loaded, loadedResource, loading, progress, resources;
      resources = _arg.resources, complete = _arg.complete, progress = _arg.progress;
      loading = 0;
      loaded = 0;
      failedResource = function(url) {
        console.error("Failed to load:", url);
        return loadedResource();
      };
      loadedResource = function(url) {
        console.log("loaded:", url);
        loaded += 1;
        if (loaded === loading) {
          return complete();
        } else {
          return typeof progress === "function" ? progress(loaded / loading) : void 0;
        }
      };
      return resources.forEach(function(resource) {
        return Object.keys(resource).forEach(function(name) {
          var element, url;
          loading += 1;
          url = resource[name];
          if (url.match(/\.(png|jpg|git)$/)) {
            return Sprite.load(url, function() {
              return loadedResource(url);
            });
          } else if (url.match(/\.(mp3|wav|ogg)/)) {
            element = new Audio;
            element.onloadeddata = function() {
              return loadedResource(url);
            };
            element.onerror = function() {
              return failedResource(url);
            };
            element.src = url;
            element.load();
            element.volume = 0;
            return element.play();
          } else {
            console.warn("unknown file type", url);
            return setTimeout(loadedResource, 0);
          }
        });
      });
    },
    softPreload: function(resources) {
      return resources.forEach(function(resource) {
        return Object.keys(resource).forEach(function(name) {
          var element, url;
          url = resource[name];
          if (url.match(/\.(png|jpg|git)$/)) {
            return Sprite.load(url);
          } else if (url.match(/\.(mp3|wav|ogg)/)) {
            element = new Audio;
            element.src = url;
            element.load();
            element.volume = 0;
            return element.play();
          } else {
            console.warn("unknown file type", url);
            return setTimeout(loadedResource, 0);
          }
        });
      });
    }
  };

}).call(this);

//# sourceURL=lib/preloader.coffee;

  return module.exports;
},"lib/sound":function(require, global, module, exports, PACKAGE) {
  (function() {
  var channels, extend, freeChannel, maxChannels, _i, _results,
    __slice = [].slice;

  extend = function() {
    var name, source, sources, target, _i, _len;
    target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = sources.length; _i < _len; _i++) {
      source = sources[_i];
      for (name in source) {
        target[name] = source[name];
      }
    }
    return target;
  };

  maxChannels = 16;

  channels = (function() {
    _results = [];
    for (var _i = 0; 0 <= maxChannels ? _i < maxChannels : _i > maxChannels; 0 <= maxChannels ? _i++ : _i--){ _results.push(_i); }
    return _results;
  }).apply(this).map(function() {
    return extend(document.createElement("audio"), {
      autobuffer: true,
      preload: 'auto'
    });
  });

  freeChannel = function() {
    var freeChannels;
    freeChannels = channels.filter(function(sound) {
      return sound.currentTime === sound.duration || sound.currentTime === 0;
    });
    return freeChannels[0];
  };

  module.exports = {
    playFromURL: function(url) {
      var channel;
      if (channel = freeChannel()) {
        try {
          channel.currentTime = 0;
        } catch (_error) {}
        channel.src = url;
        channel.play();
        return channel;
      }
    }
  };

}).call(this);

//# sourceURL=lib/sound.coffee;

  return module.exports;
},"main":function(require, global, module, exports, PACKAGE) {
  (function() {
  var DEBUG_DRAW, Dust, Music, clock, height, loadingBar, restartGame, setUpGame, width, _ref;

  Dust = require("dust");

  global.Collision = Dust.Collision;

  global.Sound = require("/lib/sound");

  Sound.play = function(name) {
    var sounds;
    sounds = require("/sounds");
    return Sound.playFromURL(sounds[name]);
  };

  require("/duct_tape");

  require("./cloud");

  require("./destruction");

  require("./player");

  require("./rock");

  require("./water");

  require("./game_over");

  Music = require("/lib/music");

  DEBUG_DRAW = false;

  _ref = require("/pixie"), width = _ref.width, height = _ref.height;

  window.engine = Dust.init({
    width: width,
    height: height
  });

  engine.I.backgroundColor = "#CC5500";

  setUpGame = function() {
    var box, player, water;
    player = engine.add({
      "class": "Player",
      x: 240,
      y: 0
    });
    box = engine.add({
      "class": "Rock",
      x: 160,
      y: 200
    });
    4..times(function(n) {
      return engine.add({
        "class": "Cloud",
        x: n * 128
      });
    });
    water = engine.add({
      "class": "Water"
    });
    return engine.add("Destruction");
  };

  loadingBar = engine.add({
    x: width / 2,
    y: height / 2,
    width: 0,
    height: height,
    color: "white"
  });

  require("/lib/preloader").preload({
    resources: ["/images"].map(require),
    progress: function(percent) {
      console.log(percent);
      return loadingBar.I.width = percent * width;
    },
    complete: function() {
      loadingBar.destroy();
      return setUpGame();
    }
  });

  require("/lib/preloader").softPreload(["/music", "/sounds"].map(require));

  /*
  camera = engine.camera()
  camera.on "afterUpdate", ->
    if player = engine.find("Player").first()
      camera.I.transform.tx = 240 + player.I.x
  */


  engine.on("afterUpdate", function() {
    var deltaX, player;
    if (player = engine.find("Player").first()) {
      deltaX = 240 - player.I.x;
      player.I.distance -= deltaX;
      return engine.objects().forEach(function(object) {
        return object.I.x += deltaX;
      });
    }
  });

  clock = 0;

  engine.on("update", function() {
    var player;
    clock += 1;
    if (player = engine.find("Player").first()) {
      if (clock % 60 === 0) {
        engine.add({
          "class": "Rock",
          x: player.I.x + 2 * width
        });
      }
      if (clock % 55 === 0) {
        return engine.add({
          "class": "Cloud",
          x: player.I.x + 2 * width
        });
      }
    }
  });

  restartGame = function() {
    var doRestart;
    engine.objects().invoke("destroy");
    doRestart = function() {
      engine.unbind("afterUpdate", doRestart);
      return setUpGame();
    };
    return engine.on("afterUpdate", doRestart);
  };

  engine.on("draw", function(canvas) {
    if (DEBUG_DRAW) {
      return engine.find("Player, Rock").invoke("trigger", "drawDebug", canvas);
    }
  });

  engine.bind("restart", function() {
    return restartGame();
  });

  Music.play("SurfN-2-Sur5");

  engine.start();

  $(document).on("keydown", null, "pause", function() {
    return engine.pause();
  });

}).call(this);

//# sourceURL=main.coffee;

  return module.exports;
},"music":function(require, global, module, exports, PACKAGE) {
  module.exports = {"SurfN-2-Sur5":"http://a0.pixiecdn.com/surfn/music/SurfN-2-Sur5.mp3"};;

  return module.exports;
},"pixie":function(require, global, module, exports, PACKAGE) {
  module.exports = {"author":"STRd6","name":"Surfing 2 Survive","description":"As a lone FBI agent you must surf to survive.","version":"0.1.0","width":480,"height":320,"entryPoint":"main","remoteDependencies":["https://code.jquery.com/jquery-1.10.1.min.js"],"dependencies":{"dust":"distri/dust:v0.1.8-alpha.2"}};;

  return module.exports;
},"player":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Base, GameObject, defaults, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  Base = require("./base");

  module.exports = GameObject.registry.Player = function(I) {
    var GRAVITY, angleSprites, land, launch, self, setSprite, sprites, wipeout;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      airborne: true,
      distance: 0,
      heading: Math.TAU / 4,
      spriteName: "player",
      launchBoost: 1.5,
      radius: 8,
      rotationVelocity: Math.TAU / 64,
      waterSpeed: 5,
      velocity: Point(0, 0),
      zIndex: 5
    });
    self = Base(I);
    GRAVITY = Point(0, 0.25);
    sprites = [];
    angleSprites = 8;
    angleSprites.times(function(n) {
      var t;
      t = n * 2;
      return sprites.push("player_" + t);
    });
    setSprite = function() {
      var n;
      n = (angleSprites * I.heading / Math.TAU).round().mod(angleSprites);
      return I.spriteName = sprites[n];
    };
    wipeout = function(causeOfDeath) {
      I.active = false;
      Sound.play("crash");
      return engine.add({
        "class": "GameOver",
        causeOfDeath: causeOfDeath,
        distance: I.distance,
        time: I.age,
        y: 160
      });
    };
    land = function() {
      var projection;
      projection = self.velocity().norm().dot(Point.fromAngle(I.heading));
      if (projection < 0) {
        wipeout("bad landing");
      }
      I.airborne = false;
      return Sound.play("land");
    };
    launch = function() {
      I.airborne = true;
      I.velocity = I.velocity.norm(I.launchBoost * I.waterSpeed);
      return Sound.play("splash");
    };
    self.on("drawDebug", function(canvas) {
      var p;
      canvas.strokeColor("rgba(0, 255, 0, 0.75)");
      p = Point.fromAngle(I.heading).scale(10);
      return canvas.drawLine({
        start: Point(I.x - p.x, I.y - p.y),
        end: Point(I.x + p.x, I.y + p.y, 1)
      });
    });
    self.on("update", function() {
      var circle, depthsLevel, headingChange, hitDestruction, hitRock, speed, water, waterLevel;
      I.x += I.velocity.x;
      I.y += I.velocity.y;
      I.waterSpeed = 5 + I.age / 30;
      circle = self.circle();
      hitRock = false;
      engine.find("Rock").each(function(rock) {
        if (Collision.circular(circle, rock.circle())) {
          return hitRock = true;
        }
      });
      if (hitRock) {
        wipeout("a rock");
        return;
      }
      hitDestruction = false;
      engine.find(".destruction").each(function(destruction) {
        if (I.x < destruction.I.x) {
          return hitDestruction = true;
        }
      });
      if (hitDestruction) {
        wipeout("a rogue wave");
        return;
      }
      water = engine.find(".water").first();
      waterLevel = water.top();
      depthsLevel = water.bottom();
      headingChange = I.rotationVelocity;
      if (I.airborne) {
        headingChange *= 2;
      }
      if (keydown.left) {
        I.heading -= headingChange;
      }
      if (keydown.right) {
        I.heading += headingChange;
      }
      setSprite();
      if (I.y > depthsLevel) {
        return wipeout("the depths");
      } else if (I.y >= waterLevel) {
        if (I.airborne) {
          land();
        }
        speed = I.velocity.magnitude();
        speed = speed.approachByRatio(I.waterSpeed, 0.1);
        return I.velocity = Point.fromAngle(I.heading).scale(speed);
      } else {
        if (!I.airborne) {
          launch();
        }
        return I.velocity = I.velocity.add(GRAVITY);
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=player.coffee;

  return module.exports;
},"rock":function(require, global, module, exports, PACKAGE) {
  (function() {
  var Base, GameObject, defaults, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  Base = require("./base");

  module.exports = GameObject.registry.Rock = function(I) {
    var self;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      spriteName: "rocks",
      height: 32,
      radius: 16,
      width: 32,
      y: 160 + rand(160),
      zIndex: 6
    });
    self = Base(I);
    self.on("update", function() {
      var destruction;
      destruction = engine.find(".destruction").first();
      if (destruction) {
        if (I.x < destruction.I.x - I.width) {
          return I.active = false;
        }
      }
    });
    return self;
  };

}).call(this);

//# sourceURL=rock.coffee;

  return module.exports;
},"sounds":function(require, global, module, exports, PACKAGE) {
  module.exports = {"crash":"http://a0.pixiecdn.com/surfn/sounds/crash.wav","land":"http://a0.pixiecdn.com/surfn/sounds/land.wav","splash":"http://a0.pixiecdn.com/surfn/sounds/splash.wav","wave":"http://a0.pixiecdn.com/surfn/sounds/wave.wav"};;

  return module.exports;
},"water":function(require, global, module, exports, PACKAGE) {
  (function() {
  var GameObject, defaults, depthsSprites, _ref, _ref1;

  _ref = require("dust"), (_ref1 = _ref.Util, defaults = _ref1.defaults), GameObject = _ref.GameObject;

  depthsSprites = [Sprite.loadByName("depths0"), Sprite.loadByName("depths1")];

  module.exports = GameObject.registry.Water = function(I) {
    var self;
    if (I == null) {
      I = {};
    }
    defaults(I, {
      color: "blue",
      water: true,
      x: 0,
      y: 240,
      width: 480,
      height: 160,
      zIndex: 0
    });
    self = GameObject(I);
    self.attrAccessor("water");
    self.on("update", function() {
      var amplitude, player;
      if (player = engine.find("Player").first()) {
        I.x = player.I.x;
      }
      amplitude = 15 + I.age;
      if (rand(3) === 0 && I.age.mod(90) === 0) {
        Sound.play("wave");
      }
      return I.y = 240 + amplitude * Math.sin(Math.TAU / 4 * I.age);
    });
    self.on("draw", function(canvas) {
      var offset;
      offset = I.x.mod(32);
      return canvas.withTransform(Matrix.translation(-I.width / 2, 0), function(canvas) {
        return depthsSprites.wrap((I.age / 8).floor()).fill(canvas, 0, I.height / 2, I.width, I.height);
      });
    });
    return self;
  };

}).call(this);

//# sourceURL=water.coffee;

  return module.exports;
}}});
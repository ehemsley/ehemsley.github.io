(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
'use strict';

var Sorter = require('sorter');

document.addEventListener('DOMContentLoaded', function () {
  // do your setup here
  console.log('Initialized app');
  var sorter = new Sorter();
});
});

require.register("sorter.js", function(exports, require, module) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Papa = require('papaparse');

Array.prototype.minBy = function (fn) {
  return this.extremumBy(fn, Math.min);
};

Array.prototype.maxBy = function (fn) {
  return this.extremumBy(fn, Math.max);
};

Array.prototype.extremumBy = function (pluck, extremum) {
  return this.reduce(function (best, next) {
    var pair = [pluck(next), next];
    if (!best) {
      return pair;
    } else if (extremum.apply(null, [best[0], pair[0]]) == best[0]) {
      return best;
    } else {
      return pair;
    }
  }, null)[1];
};

module.exports = function () {
  function Sorter() {
    var _this = this;

    _classCallCheck(this, Sorter);

    this.box = document.getElementById('drag-box');
    this.box.addEventListener('dragover', function () {
      return _this.handle_drag_over(event);
    }, false);
    this.box.addEventListener('drop', function () {
      return _this.handle_file_select(event);
    }, false);
  }

  _createClass(Sorter, [{
    key: 'handle_drag_over',
    value: function handle_drag_over(event) {
      event.stopPropagation();
      event.preventDefault();

      event.dataTransfer.dropEffect = 'link';
      return;
    }
  }, {
    key: 'handle_file_select',
    value: function handle_file_select(event) {
      event.stopPropagation();
      event.preventDefault();

      var loaded = false;
      var file = event.dataTransfer.files[0];

      this.parse_csv(file);
      return;
    }
  }, {
    key: 'parse_csv',
    value: function parse_csv(file, callback) {
      var _this2 = this;

      Papa.parse(file, { header: true, complete: function complete(results) {
          return _this2.handle_data(results.data);
        } });
    }
  }, {
    key: 'handle_data',
    value: function handle_data(data) {
      var players = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var row = _step.value;

          if (row["Submission Date"] != "") {
            var player = {
              name: row["First Name"].trim().toLowerCase() + " " + row["Last Name"].trim().toLowerCase(),
              skill: parseInt(row["In order to help us select fair teams, please rank your basketball skill (we think everyone is great at basketball!):"]),
              teammate_request: row["Teams are \"randomly drafted\" by Effie and Aerienne. You are allowed to choose *one* friend that you would like to be on the same team with -- we will try to accomodate your request!"]
            };
            players.push(player);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.pick_teams(players);
    }
  }, {
    key: 'pick_teams',
    value: function pick_teams(data) {
      function team_value(team) {
        return team.map(function (a) {
          return a.skill;
        }).reduce(function (a, b) {
          return a + b;
        }, 0);
      }

      var teams = [];
      teams[0] = [];
      teams[1] = [];
      teams[2] = [];
      teams[3] = [];

      var sorted_by_skill = [].concat(_toConsumableArray(data.entries())).sort(function (a, b) {
        return a[1].skill > b[1].skill ? -1 : a[1].skill < b[1].skill ? 1 : 0;
      });

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = sorted_by_skill[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var datum = _step2.value;

          var player = datum[1];
          var lowest_value_team = teams.minBy(function (a) {
            return team_value(a);
          });
          var team_with_request = teams.find(function (a) {
            return a.some(function (e) {
              return e.name == player.teammate_request.trim().toLowerCase();
            });
          });

          if (team_with_request == undefined) {
            lowest_value_team.push(player);
          } else {
            console.log('request filled! ' + player.name + ' requested ' + player.teammate_request);
            team_with_request.push(player);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var iterator = 1;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = teams[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var team = _step3.value;

          var team_div = document.createElement("div");
          team_div.className = "team-container";

          var team_title_div = document.createElement("div");
          team_title_div.className = "team";
          team_title_div.innerHTML = "Team " + iterator;

          this.box.appendChild(team_div);
          team_div.appendChild(team_title_div);

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = team[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var player = _step4.value;

              var player_div = document.createElement("div");
              player_div.className = "player";
              player_div.innerHTML = player.name;
              team_div.appendChild(player_div);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          var score_div = document.createElement("div");
          score_div.className = "score";
          score_div.innerHTML = team_value(team);
          team_div.appendChild(score_div);
          iterator += 1;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }]);

  return Sorter;
}();
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map
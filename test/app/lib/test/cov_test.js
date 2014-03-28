(function(_require, __dirname, __filename) {
	var require = _require('ti-node-require')(__dirname);


	var should = require('should/should');
	require('ti-mocha');

	var CRAZY_PATH = '../../../../././../modules/.././modules/foo/../foo/./bar';

	function testQuux(o) {
		should.exist(o);
		o.should.be.a.Function;
		o().should.equal('quux');
	}

	function testApp(o) {
		should.exist(o);
		o.should.equal('app');
	}

	function testFoobar(o) {
		should.exist(o);
		o.should.be.a.Function;
		o().should.equal('/modules/foo/bar.js');
	}

	function testThrow(o) {
		var threw = false;
		try {
			require(o);
		} catch (e) {
			threw = true;
			should.exist(e);
			e.message.should.match(/find module/);
			should.exist(e.code);
			e.code.should.equal('MODULE_NOT_FOUND');
		}
		threw.should.be.true;
	}

	describe('ti-node-require', function() {

		describe('require()', function() {

			it('should be a function', function() {
				should.exist(require);
				require.should.be.a.Function;
			});

			it('"require.resolve()" should be a function', function() {
				should.exist(require.resolve);
				require.resolve.should.be.a.Function;
			});

			it('"require.resolve()" should return the full path to modules', function() {
				should.exist(require.resolve);
				require.resolve('/modules/quux.js').should.equal('/modules/quux.js');
				require.resolve('/modules/quux').should.equal('/modules/quux.js');
				require.resolve('../modules/quux').should.equal('/modules/quux.js');
				require.resolve('../modules/quux.js').should.equal('/modules/quux.js');
				require.resolve('should').should.equal('/node_modules/should/lib/node.js');
				require.resolve('should/should.js').should.equal('/node_modules/should/should.js');
				require.resolve('should/should').should.equal('/node_modules/should/should.js');
				require.resolve(CRAZY_PATH).should.equal('/modules/foo/bar.js');
			});

			it('should load modules via absolute paths with no extension', function() {
				testQuux(require('/modules/quux'));
				testApp(require('/modules/app'));
				testFoobar(require('/modules/foo/bar'));
			});

			it('should load modules via absolute paths with js extension', function() {
				testQuux(require('/modules/quux.js'));
				testApp(require('/modules/app.js'));
				testFoobar(require('/modules/foo/bar.js'));
			});

			it('should load modules via absolute paths with json extension');

			it('should load modules via relative paths with no extension', function() {
				testQuux(require('../modules/quux'));
				testApp(require('../modules/app'));
				testFoobar(require('../modules/foo/bar'));

				// and one crazy test
				testFoobar(require(CRAZY_PATH));
			});

			it('should load modules via relative paths with js extension', function() {
				testQuux(require('../modules/quux.js'));
				testApp(require('../modules/app.js'));
				testFoobar(require('../modules/foo/bar.js'));

				// and one crazy test
				testFoobar(require(CRAZY_PATH + '.js'));
			});

			it('should load modules via relative paths with json extension');

			it('should load folder as module via package.json');

			it('should load folder as module via index.js');

			it('should load module from node_modules folder', function() {
				var _should = require('should/should');
				should.exist(_should);
				_should.should.be.a.Function;

				var _ = require('underscore');
				(function() {
					_.each([1,2,3], function(n) { n.should.equal(n); });
				}).should.not.throw();
			});

			it('should throw when it can\'t load a module', function() {
				testThrow('/i/dont/exist');
				testThrow('../../../..');
				testThrow('../modules');
				testThrow('/modules');
				testThrow('someModule');
				testThrow('../modules/foo');
				testThrow('../modules/foo/bar.json');
			});

			it('"require.main" should be an object');
			// it('"require.main" should be an object', function() {
			// 	should.exist(require.main);
			// 	require.main.should.be.an.Object;
			// });

			it('"require.main" should be equal to the main module (app.js)');
			// it('"require.main" should be equal to the main module (app.js)', function() {
			// 	should.exist(require.main);
			// 	require.main.should.equal(require('/app'));
			// });

		});

		describe('free variables', function() {

			it('"module" should be an object', function() {
				should.exist(module);
				module.should.be.an.Object;
			});

			it('"module.exports" should be an object', function() {
				should.exist(module.exports);
				module.exports.should.be.an.Object;
			});

			it('"exports" should be an object', function() {
				should.exist(exports);
				exports.should.be.an.Object;
			});

			it('"exports" should equal "module.exports"', function() {
				should.exist(exports);
				exports.should.equal(module.exports);
			});

			it('"module.id" should be the module\'s fully resolved filename', function() {
				module.id.should.equal(__filename);
			});

			it('"module.require()" should be a function', function() {
				should.exist(module.require);
				module.require.should.be.a.Function;
			});

			it('"module.require()" should equal this module\'s "require"', function() {
				should.exist(module.require);
				module.require.should.equal(require);
			});

			it('"module.require()" should require modules as though called from this module');

			it('"module.filename" should be the module\'s fully resolved filename', function() {
				module.id.should.equal(__filename);
			});

			it('"module.loaded" should be boolean', function() {
				should.exist(module.loaded);
				module.loaded.should.be.Boolean;
			});

			it('"module.parent" should be an object', function() {
				should.exist(module.parent);
				module.parent.should.be.an.Object;
			});

			it('"module.parent" should equal parent module object');

			it('"module.children" should be an array', function() {
				should.exist(module.children);
				module.parent.should.be.an.Array;
			});

			it('"module.children" should contain an array of modules required from this module');

		});

	});

	mocha.run();


})(require, '/test', '/test/cov_test.js');
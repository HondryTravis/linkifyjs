const scanner = require('linkifyjs/src/core/scanner');
const t = require('linkifyjs/src/core/tokens').text;

// The elements are
// 1. input string
// 2. Types for the resulting instances
// 3. String values for the resulting instances
const tests = [
	['', [], []],
	['@', [t.AT], ['@']],
	[':', [t.COLON], [':']],
	['.', [t.DOT], ['.']],
	['-', [t.HYPHEN], ['-']],
	['\n', [t.NL], ['\n']],
	['+', [t.PLUS], ['+']],
	['#', [t.POUND], ['#']],
	['/', [t.SLASH], ['/']],
	['&', [t.AMPERSAND], ['&']],
	['*', [t.ASTERISK], ['*']],
	['\\', [t.BACKSLASH], ['\\']],
	['%', [t.PERCENT], ['%']],
	['`', [t.BACKTICK], ['`']],
	['^', [t.CARET], ['^']],
	['|', [t.PIPE], ['|']],
	['~', [t.TILDE], ['~']],
	['$', [t.DOLLAR], ['$']],
	['=', [t.EQUALS], ['=']],
	['-', [t.HYPHEN], ['-']],
	['&?<>(', [t.AMPERSAND, t.QUERY, t.OPENANGLEBRACKET, t.CLOSEANGLEBRACKET, t.OPENPAREN], ['&', '?', '<', '>', '(']],
	['([{}])', [t.OPENPAREN, t.OPENBRACKET, t.OPENBRACE, t.CLOSEBRACE, t.CLOSEBRACKET, t.CLOSEPAREN], ['(', '[', '{', '}', ']', ')']],
	['!,;\'', [t.EXCLAMATION, t.COMMA, t.SEMI, t.APOSTROPHE], ['!', ',', ';', '\'']],
	['hello', [t.DOMAIN], ['hello']],
	['Hello123', [t.DOMAIN], ['Hello123']],
	['hello123world', [t.DOMAIN], ['hello123world']],
	['0123', [t.NUM], ['0123']],
	['123abc', [t.DOMAIN], ['123abc']],
	['http', [t.DOMAIN], ['http']],
	['http:', [t.PROTOCOL], ['http:']],
	['https:', [t.PROTOCOL], ['https:']],
	['files:', [t.DOMAIN, t.COLON], ['files', ':']],
	['file//', [t.DOMAIN, t.SLASH, t.SLASH], ['file', '/', '/']],
	['ftp://', [t.PROTOCOL, t.SLASH, t.SLASH], ['ftp:', '/', '/']],
	['mailto', [t.DOMAIN], ['mailto']],
	['mailto:', [t.MAILTO], ['mailto:']],
	['c', [t.DOMAIN], ['c']],
	['co', [t.TLD], ['co']],
	['com', [t.TLD], ['com']],
	['comm', [t.DOMAIN], ['comm']],
	['abc 123  DoReMi', [t.TLD, t.WS, t.NUM, t.WS, t.DOMAIN], ['abc', ' ',  '123', '  ', 'DoReMi']],
	['abc 123 \n  DoReMi', [t.TLD, t.WS, t.NUM, t.WS, t.NL, t.WS, t.DOMAIN], ['abc', ' ',  '123', ' ', '\n', '  ', 'DoReMi']],
	['local', [t.DOMAIN], ['local']],
	['localhost', [t.LOCALHOST], ['localhost']],
	['localhosts', [t.DOMAIN], ['localhosts']],
	['500px', [t.DOMAIN], ['500px']],
	['500-px', [t.DOMAIN], ['500-px']],
	['-500px', [t.HYPHEN, t.DOMAIN], ['-', '500px']],
	['500px-', [t.DOMAIN, t.HYPHEN], ['500px', '-']],
	['123-456', [t.DOMAIN], ['123-456']],
	['foo\u00a0bar', [t.TLD, t.WS, t.TLD], ['foo', '\u00a0', 'bar']], // nbsp
	['çïrâ.ca', [t.DOMAIN, t.DOT, t.TLD], ['çïrâ', '.', 'ca']],
	['www.🍕💩.ws', [t.DOMAIN, t.DOT, t.DOMAIN, t.DOT, t.TLD], ['www', '.', '🍕💩', '.', 'ws']],
	[
		'za̡͊͠͝lgό.gay', // May support diacritics in the future if someone complains
		[t.TLD, t.SYM, t.SYM, t.SYM, t.SYM, t.DOMAIN, t.DOT, t.TLD],
		['za', '͠', '̡', '͊', '͝', 'lgό','.','gay']
	],
	[
		'Direniş İzleme Grubu\'nun',
		[t.DOMAIN, t.WS, t.DOMAIN, t.WS, t.DOMAIN, t.APOSTROPHE, t.DOMAIN],
		['Direniş', ' ', 'İzleme', ' ', 'Grubu', '\'', 'nun']
	],
	[
		'example.com　　　テスト', // spaces are ideographic space
		[t.DOMAIN, t.DOT, t.TLD, t.WS, t.DOMAIN],
		['example', '.', 'com', '　　　', 'テスト']
	],
	[
		'#АБВ_бв #한글 #سلام',
		[t.POUND, t.DOMAIN, t.UNDERSCORE, t.DOMAIN, t.WS, t.POUND, t.DOMAIN, t.WS, t.POUND, t.DOMAIN],
		['#', 'АБВ', '_', 'бв', ' ', '#', '한글', ' ', '#', 'سلام']
	]
];


describe('linkifyjs/core/scanner#run()', () => {
	let start;
	before(() => { start = scanner.init(); });

	function makeTest(test) {
		return it('Tokenizes the string "' + test[0] + '"', () => {
			var str = test[0];
			var types = test[1];
			var values = test[2];
			var result = scanner.run(start, str);

			expect(result.map((token) => token.t)).to.eql(types);
			expect(result.map((token) => token.v)).to.eql(values);
		});
	}

	// eslint-disable-next-line mocha/no-setup-in-describe
	tests.map(makeTest, this);

	it('Correctly sets start and end indexes', () => {
		expect(scanner.run(start, 'Hello, World!')).to.eql([
			{ t: t.DOMAIN, v: 'Hello', s: 0, e: 5 },
			{ t: t.COMMA, v: ',', s: 5, e: 6 },
			{ t: t.WS, v: ' ', s: 6, e: 7 },
			{ t: t.TLD, v: 'World', s: 7, e: 12 },
			{ t: t.EXCLAMATION, v: '!', s: 12, e: 13 },
		]);
	});

	describe('Custom protocols', () => {
		before(() => { start = scanner.init(['twitter', 'fb', 'steam']); });

		it('Correctly tokenizes a full custom protocols', () => {
			expect(scanner.run(start, 'steam://hello')).to.eql([
				{ t: t.PROTOCOL, v: 'steam:', s: 0, e: 6 },
				{ t: t.SLASH, v: '/', s: 6, e: 7 },
				{ t: t.SLASH, v: '/', s: 7, e: 8 },
				{ t: t.DOMAIN, v: 'hello', s: 8, e: 13 }
			]);
		});

		it('Classifies partial custom protocols as domains', () => {
			expect(scanner.run(start, 'twitter sux')).to.eql([
				{ t: t.DOMAIN, v: 'twitter', s: 0, e: 7 },
				{ t: t.WS, v: ' ', s: 7, e: 8 },
				{ t: t.DOMAIN, v: 'sux', s: 8, e: 11 }
			]);
		});
	});
});

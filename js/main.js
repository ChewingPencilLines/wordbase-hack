var fn = null;

angular.module('wordBaseHack', [])
    .controller('wordBaseController', function () {
    
    var that = this;
    
    that.puzzle = [
        'AHULTEMIDG',
        'NELMERFOAR',
        'ZIOJHFDMLP',
        'IMNAUENISD',
        'LADGMALUIE',
        'TSLERSDANZ',
        'OHDYETKESO',
        'ENSLIMOTLI',
        'DIERMLSETA',
        'CODNUIVYRT',
        'EHOTERALUA',
        'ICMRTSTEON',
        'VITDELNADC'];

    // that.puzzle = [
    //     'HPALBNQRAB',
    //     'ABLUWBUHEO',
    //     'TIRAEOSESW',
    //     'GOTRVTOHEH',
    //     'NYIPERGIRB',
    //     'LIGNTGNLOS',
    //     'FRSEOIAIPE',
    //     'TAGXRSTCSR',
    //     'NDSNTHYSIE',
    //     'EAHIPTGAWT',
    //     'INKYANETES',
    //     'OCNTEMUMRA',
    //     'DIGILNAPLP'];

    // that.puzzle = [
    //     'HYCSTVAIUG',
    //     'CSANEIRALR',
    //     'TOSGLRWSES',
    //     'ACPIMOSXAC',
    //     'NURACTEOHA',
    //     'TDONBARCRS',
    //     'OINEXSCSQL',
    //     'NLIRNISAUE',
    //     'IDENTAEDNS',
    //     'EFUDSRVLIG',
    //     'WSKEGNUGOV',
    //     'LOGOVEIVAO',
    //     'ALDCRSETPS'];
    
    var WIDTH = that.puzzle[0].length;
    var HEIGHT = that.puzzle.length;

    function init (dictionary, formableWords) {
        that.dictionary = dictionary;
        that.formableWords = formableWords

        for (var i = 0; i < that.puzzle.length; i++) {
            that.puzzle[i] = that.puzzle[i].split('');
        }
        console.log('READY!');
    }

    that.words = [];

    that.getWordFromSequence = function (sequence) {
        return sequence.map(function (object) {
            return object.letter;
        }).join('');
    };

    that.findWordsFromCell = function (i, j) {
        var words = [];
        var count = 0;
        function traverse(currPuzzle, currSeq, i, j) {
            count++;
            if (i < 0 || i >= HEIGHT || 
                j < 0 || 
                j >= WIDTH) {
                return;
            }
            if (currPuzzle[i][j] === '*') {
                return;
            }
            currSeq.push({
                letter: currPuzzle[i][j],
                row: i,
                col: j
            });
            currPuzzle[i][j] = '*';
            var puzzle = _.cloneDeep(currPuzzle);
            var currentWord = that.getWordFromSequence(currSeq);
            if (that.dictionary[currentWord]) {
                words.push(currSeq);
            }
            if (!that.formableWords[currentWord]) {
                return;
            }
            traverse(puzzle, _.cloneDeep(currSeq), i - 1, j - 1);
            traverse(puzzle, _.cloneDeep(currSeq), i - 1, j);
            traverse(puzzle, _.cloneDeep(currSeq), i - 1, j + 1);
            traverse(puzzle, _.cloneDeep(currSeq), i, j - 1);
            traverse(puzzle, _.cloneDeep(currSeq), i, j + 1);
            traverse(puzzle, _.cloneDeep(currSeq), i + 1, j - 1);
            traverse(puzzle, _.cloneDeep(currSeq), i + 1, j);
            traverse(puzzle, _.cloneDeep(currSeq), i + 1, j + 1);
        }

        traverse(_.cloneDeep(that.puzzle), [], i, j);

        words.sort(function (a, b) {
            return b.length - a.length;
        });
        console.log('DONE', count, words);
        that.words = words;
    }

    $(function () {
        $.get('data/words.json', function (data) {
            var dictionary = {};
            var formableWords = {};
            data.forEach(function (word) {
                dictionary[word] = true;
                for (var i = 1; i < word.length; i++) {
                    formableWords[word.slice(0, i)] = true;
                }
            });
            init(dictionary, formableWords);
        });
    });
});

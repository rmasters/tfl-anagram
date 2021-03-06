# tfl-anagram

Every day, the Evening Standard publishes a tube quiz, in which you solve a selection of clues in order to find a highly
inefficient tube journey, changing lines at each stop. One of these clues is always an anagram. I am terrible at
anagrams.

## Usage

1.  Test an anagram: `node anagram.js "Earthmen Gurn"`: `[ 'Turnham Green' ]`
2.  Optionally, re-acquire a list of station names: `node fetch_stations.js > stations.txt` (i.e. when Crossrail opens)

The anagram matching is fairly broad, since a lot of these station names are still verbose - if all of the characters
of the anagram are contained in the name, and there are at least as many occurrences of each letter of the anagram in
the matched name, it'll match. e.g.:

```
$ node anagram.js "loo"
[ 'London Liverpool Street', ..., 'Waterloo' ]

$ node anagram.js "loooo"
[ 'London Liverpool Street' ]
```

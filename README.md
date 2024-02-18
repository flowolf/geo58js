# Geo58js

Yet another short-link specification for geo-coordinates.

Sister library of [Geo58 (Python)](https://github.com/flowolf/Geo58).

## Key Features

- uses base-58 encoding
- can be as short as 8 characters, mostly 9 characters
- maximum length of 10 characters
- resolves to about 1.1m accuracy
- geocoordinates that are close, look similar
- can include a zoom level of a map (20-5)

### Base58 encoding

[Base58 encoding](https://en.wikipedia.org/wiki/Base58) uses 58 alphanumerical characters, 49 of the alphabet plus 9 digits.
Characters that look similar ('0', 'O', 'I', 'l') are omitted.
This allows for manual copying of data with little potential for ambiguity.

### 8-10 characters short

The encoding is done in the followin schema:
`[Zoom 4bit][joined [Lat 25bit][Lon 26bit]]`

- `Zoom`: beeing an optional parameter for a possible viewport (see below).
- `posLat`: is the latitude (mapped from [-90,90] to [0, 180]).
- `posLon`: is the longitude (mapped from [-180,180] to [0, 360]).

The last 51 bit are 'intervoven' to generate a bit-sequence with least significant bits to the right.
This allows the generation of short-strings that are similar to each other if they are close to one another.

### Link similarity

The following 3 short-strings, refer to cafes in Heidelberg, which are only ~25m apart:

- `NBiwwcnfq ->  { zoom: 19, lat: 49.41054, lon: 8.69964 }`
- `NBiwwcnuw ->  { zoom: 19, lat: 49.41047, lon: 8.69984 }`
- `NBiwwcnZc ->  { zoom: 19, lat: 49.41035, lon: 8.69971 }`

### Zoom level (can be) included

4 bit of the short-string are used to encode the zoom level of a viewport. This can be used to
hint at the size of the object that is being referred to.
The zoom level is pre-fixed to the bit-sequence. It is also 'inverted' to allow zoom level 20
to be represented as zero and 19 as one. Zoom level 5 would be using 4 bits.

As the zoom level is pre-fixed, zoom level 20 does not 'consume' any bit-bandwidth, resulting in a
short-string being as short as possible.

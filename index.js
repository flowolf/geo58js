class Geo58Error extends Error {
  constructor(message) {
    super(message);
    this.name = "Geo58Error";
  }
}

alph = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

class Geo58 {
  // Geo58 class to hold and convert geo-coordinates in z/x/y format and
  //   base58 encoded short strings.

  //   zoom: zoom level between 5-20.
  //   lat:  latitude
  //   lon:  longitude
  //   x:    latitude
  //   y:    longitude
  //   geo58:  geo58 encoded geo-coordinate

  constructor(initData) {
    // console.log(`init data`, initData);
    if (initData === undefined) {
      initData = {};
    }

    ({
      zoom: this.zoom,
      lat: this.lat,
      lon: this.lon,
      x: this.x,
      y: this.y,
      geo58: this.geo58,
    } = initData);

    this.lat = this.x || this.lat;
    this.lon = this.y || this.lon;
    this.x = this.x || this.lat;
    this.y = this.y || this.lon;

    if (this.geo58 === undefined || this.geo58 === null) {
      // console.log("no geo58");
      this.geo58 = this._coordsToGeo58(this.zoom, this.lat, this.lon);
    }
    if ((!this.zoom || !this.lat || !this.lon) && this.geo58) {
      // console.log("geo58 but no other stuff");
      ({
        zoom: this.zoom,
        x: this.lat,
        y: this.lon,
        x: this.x,
        y: this.y,
      } = this._geo58ToCoords(this.geo58));
      this._validateCoords(this.zoom, this.lat, this.lon);
    }
  }

  toString() {
    const geo58rep = [
      "=🌎=============== Geo58 ==================🌍=",
      "\n",
      "geo58: ",
      this.geo58,
      "\n",
      "zoom: ",
      this.zoom,
      "\n",
      "lat: ",
      this.lat,
      "\n",
      "lon: ",
      this.lon,
      "\n",
      "x: ",
      this.x,
      "\n",
      "y: ",
      this.y,
      "\n",
      "==============================================\n",
    ];
    return "".concat(...geo58rep);
  }

  getGeo58(x, y) {
    return this.geo58;
  }

  getCoordinates() {
    return {
      zoom: this.zoom,
      lat: this.lat,
      lon: this.lon,
    };
  }

  _int2base58(i) {
    this._int = i;
    let base58str = [];
    while (i > 0) {
      base58str.push(alph.charAt(Number(i % BigInt(58))));
      i = i / BigInt(58);
    }
    base58str.reverse();
    return "".concat(...base58str);
  }

  _base582int(b58String) {
    let i = BigInt(0);
    let c;
    for (let x = 0; x < b58String.length; x++) {
      c = b58String.charAt(x);
      i *= BigInt(58);
      i += BigInt(alph.indexOf(c));
    }
    this._int = i;
    return i;
  }

  _validateCoords(zoom, x, y) {
    x = Math.floor(Number(x) * 100000);
    y = Math.floor(Number(y) * 100000);
    zoom = Math.floor(zoom + 0.5);
    if (x < -9000000 || x > 9000000) {
      throw new Geo58Error(`lat (x) is out of range ${zoom} ${x} ${y}`);
    }
    if (y < -18000000 || y > 18000000) {
      throw new Geo58Error(`lon (y) is out of range ${zoom} ${x} ${y}`);
    }
    if (zoom < 5 || zoom > 20) {
      throw new Geo58Error(`zoom is out of range (5-20)`);
    }
  }

  _convertCoordsToInt(x, y, z) {
    if (z === undefined) {
      z = 20;
    }
    this._validateCoords(z, x, y);

    x = Math.floor((x + 90) * 100000);
    y = Math.floor((y + 180) * 100000);
    let mergedCoords = BigInt(0);
    mergedCoords = this._binMergeXY(x, y);

    z = Math.floor(z + 0.5);
    z = (z - 20) * -1; // zoom 20 = 0x0

    // coord = z << 51 | x << 26 | y // 25 bits
    let coord = (BigInt(z) << BigInt(51)) | mergedCoords;
    return coord;
  }

  _convertIntToCoords(i) {
    let zoom = (i & (BigInt(15) << BigInt(25 + 26))) >> BigInt(51);
    let x, y;
    ({ x, y } = this._binUnmergeXY(i & BigInt(0x7ffffffffffff)));
    let z = Number(zoom) * -1 + 20;
    z = Math.floor(z);
    // console.log(`_convertIntToCoords: ${z} ${x} ${y}`);
    x = Number(x - BigInt(9000000)) / 100000;
    y = Number(y - BigInt(18000000)) / 100000;
    return { zoom: z, x: x, y: y };
  }

  _binMergeXY(x, y) {
    x = BigInt(x);
    y = BigInt(y);
    let a = BigInt(0);
    let b = BigInt(0);
    let mask = BigInt(0x1);
    for (let s = BigInt(1); s < 26; s++) {
      a |= (x & mask) << s;
      mask = mask << BigInt(1);
    }
    mask = BigInt(0x1);
    for (let s = BigInt(0); s < 27; s++) {
      b |= (y & mask) << s;
      mask = mask << BigInt(1);
    }
    return a | b;
  }

  _binUnmergeXY(i) {
    let a = BigInt(0);
    let b = BigInt(0);
    let mask = BigInt(0x2);
    for (let s = BigInt(1); s < 27; s++) {
      a |= (i & mask) >> s;
      mask = mask << BigInt(2);
    }
    mask = BigInt(0x1);
    for (let s = BigInt(0); s < 27; s++) {
      b |= (i & mask) >> s;
      mask = mask << BigInt(2);
    }
    // console.log(
    //   `binary converted coords: ${a}, ${b}, ${a - BigInt(9000000)} ${
    //     b - BigInt(18000000)
    //   }`
    // );
    return { x: a, y: b };
  }

  _coordsToGeo58(zoom, x, y) {
    // console.log(`_coordsToGeo58: ${zoom}, ${x}, ${y}`);
    let i = this._convertCoordsToInt(x, y, zoom);
    return this._int2base58(i);
  }

  _geo58ToCoords(geo58) {
    let i = this._base582int(geo58);
    let zoom, x, y;
    ({ zoom, x, y } = this._convertIntToCoords(i));
    return { zoom: zoom, x: x, y: y };
  }
}
// interface Geo58
// {
//   zoom: int;
//   _int: BigInt;
//   lat: Number;
//   lon: Number;
//   x: Number;
//   y: Number;
//   geo58:String}

module.exports = Geo58;

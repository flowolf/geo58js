const Geo58 = require("../index");

console.log = () => {};

describe("coordinates to geo58", () => {
  it.each([
    [{ zoom: 19, lat: 47.10379, lon: 15.3816 }, "ND8CaShUu"],
    [{ zoom: 15, lat: 87.07071, lon: 175.43951 }, "2k86MwTm5x"],
    [{ zoom: 19, lat: 90.0, lon: -180.0 }, "NzpRz3GST"],
    [{ zoom: 19, lat: -90.0, lon: -180.0 }, "JaqxqcLEB"],
    [{ zoom: 19, lat: -90.0, lon: 180.0 }, "TQnu8UCej"],
    [{ zoom: 12, lat: 90.0, lon: 180.0 }, "3eug79ATTD"],
    [{ zoom: 14, lat: -89.12346, lon: 179.12345 }, "2yKzdW3Net"],
    [{ zoom: 14, lat: 89.12346, lon: -179.12345 }, "2tv2eGq6jN"],
    [{ zoom: 14, lat: -89.12346, lon: -179.12345 }, "2pW58yD5eC"],
    [{ zoom: 17, lat: -47.12346, lon: -15.12345 }, "vkwB9Kagt"],
    [{ zoom: 19, lat: 47.12346, lon: -15.12345 }, "LhywHZspp"],
    [{ zoom: 15, lat: -47.12346, lon: 15.12345 }, "2ZRm4AGLc8"],
    [{ zoom: 12, lat: 47.12346, lon: 15.12345 }, "3VJ2dVZHsv"],
    [{ zoom: 13, lat: 7.12346, lon: 1.12345 }, "3BQicuKeq6"],
    [{ zoom: 14, lat: -17.12346, lon: 150.12345 }, "2snAX6GEG8"],
    [{ zoom: 15, lat: 77.12346, lon: 15.12345 }, "2acokS56Xz"],
    [{ zoom: 17, lat: 47.12346, lon: 15.12346 }, "yNopJWdk7"],
    [{ zoom: 17, lat: 47.12346, lon: 15.12344 }, "yNopJWdk3"],
    [{ zoom: 17, lat: 47.12346, lon: 15.12345 }, "yNopJWdk4"],
    [{ zoom: 18, lat: 10.12347, lon: 0.12345 }, "fVfNrFoR4"],
    [{ zoom: 19, lat: 10.12346, lon: 0.12345 }, "MupR1eUBr"],
  ])("%p converting to %p", (inp, res) => {
    let g = new Geo58(inp);
    expect(g.getGeo58()).toBe(res);
  });
});

describe("geo58 to coordinates", () => {
  it.each([
    [{ geo58: "ND8CaShUu" }, { zoom: 19, lat: 47.10379, lon: 15.3816 }],
    [{ geo58: "2k86MwTm5x" }, { zoom: 15.0, lat: 87.07071, lon: 175.43951 }],
    [{ geo58: "NzpRz3GST" }, { zoom: 19, lat: 90.0, lon: -180.0 }],
    [{ geo58: "JaqxqcLEB" }, { zoom: 19, lat: -90.0, lon: -180.0 }],
    [{ geo58: "TQnu8UCej" }, { zoom: 19, lat: -90.0, lon: 180.0 }],
    [{ geo58: "3eug79ATTD" }, { zoom: 12, lat: 90.0, lon: 180.0 }],
    [{ geo58: "2yKzdW3Net" }, { zoom: 14, lat: -89.12346, lon: 179.12345 }],
    [{ geo58: "2tv2eGq6jN" }, { zoom: 14, lat: 89.12346, lon: -179.12345 }],
    [{ geo58: "2pW58yD5eC" }, { zoom: 14, lat: -89.12346, lon: -179.12345 }],
    [{ geo58: "vkwB9Kagt" }, { zoom: 17, lat: -47.12346, lon: -15.12345 }],
    [{ geo58: "LhywHZspp" }, { zoom: 19, lat: 47.12346, lon: -15.12345 }],
    [{ geo58: "2ZRm4AGLc8" }, { zoom: 15, lat: -47.12346, lon: 15.12345 }],
    [{ geo58: "3VJ2dVZHsv" }, { zoom: 12, lat: 47.12346, lon: 15.12345 }],
    [{ geo58: "3BQicuKeq6" }, { zoom: 13, lat: 7.12346, lon: 1.12345 }],
    [{ geo58: "2snAX6GEG8" }, { zoom: 14, lat: -17.12346, lon: 150.12345 }],
    [{ geo58: "2acokS56Xz" }, { zoom: 15, lat: 77.12346, lon: 15.12345 }],
    [{ geo58: "yNopJWdk7" }, { zoom: 17, lat: 47.12346, lon: 15.12346 }],
    [{ geo58: "yNopJWdk3" }, { zoom: 17, lat: 47.12346, lon: 15.12344 }],
    [{ geo58: "yNopJWdk4" }, { zoom: 17, lat: 47.12346, lon: 15.12345 }],
    [{ geo58: "fVfNrFoR4" }, { zoom: 18, lat: 10.12347, lon: 0.12345 }],
    [{ geo58: "MupR1eUBr" }, { zoom: 19, lat: 10.12346, lon: 0.12345 }],
  ])("%p converts back to %p", (inp, res) => {
    let g = new Geo58(inp);
    expect(g.getCoordinates()).toStrictEqual(res);
    expect(g.lat).toBe(res.lat);
    expect(g.lon).toBe(res.lon);
    expect(g.lat).toBe(g.x);
    expect(g.lon).toBe(g.y);
    expect(g.geo58).toBe(inp.geo58);
  });
});

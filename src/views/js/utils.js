var util = {
  coordEach: function(geojson, callback, excludeWrapCoord) {
    var i, j, k, g, l, geometry, stopG, coords,
      geometryMaybeCollection,
      wrapShrink = 0,
      currentIndex = 0,
      isGeometryCollection,
      isFeatureCollection = geojson.type === 'FeatureCollection',
      isFeature = geojson.type === 'Feature',
      stop = isFeatureCollection ? geojson.features.length : 1;
    for (i = 0; i < stop; i++) {
      geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry :
        (isFeature ? geojson.geometry : geojson));
      isGeometryCollection = geometryMaybeCollection.type === 'GeometryCollection';
      stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
      for (g = 0; g < stopG; g++) {
        geometry = isGeometryCollection ?
          geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
        coords = geometry.coordinates;
        wrapShrink = (excludeWrapCoord &&
          (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon')) ?
          1 : 0;
        if (geometry.type === 'Point') {
          callback(coords, currentIndex);
          currentIndex++;
        } else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
          for (j = 0; j < coords.length; j++) {
            callback(coords[j], currentIndex);
            currentIndex++;
          }
        } else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
          for (j = 0; j < coords.length; j++)
            for (k = 0; k < coords[j].length - wrapShrink; k++) {
              callback(coords[j][k], currentIndex);
              currentIndex++;
            }
        } else if (geometry.type === 'MultiPolygon') {
          for (j = 0; j < coords.length; j++)
            for (k = 0; k < coords[j].length; k++)
              for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                callback(coords[j][k][l], currentIndex);
                currentIndex++;
              }
        } else if (geometry.type === 'GeometryCollection') {
          for (j = 0; j < geometry.geometries.length; j++)
            this.coordEach(geometry.geometries[j], callback, excludeWrapCoord);
        } else {
          throw new Error('Unknown Geometry Type');
        }
      }
    }
  },
  viewFitBounds: function(map,geojsonArr){
    let bbox = [Infinity, Infinity, -Infinity, -Infinity];
    geojsonArr.map(geojson=>{
      this.coordEach(geojson, function (coord) {
        if (bbox[0] > coord[0]) bbox[0] = coord[0];
        if (bbox[1] > coord[1]) bbox[1] = coord[1];
        if (bbox[2] < coord[0]) bbox[2] = coord[0];
        if (bbox[3] < coord[1]) bbox[3] = coord[1];
      })
    })
    map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {padding: 80});
    return bbox;
  },
  wktToCenter: function(wkt){
    if(wkt.startsWith("MULTIPOLYGON")){
      var firstLeftIndex = wkt.indexOf('(')
      let str = wkt.substring(firstLeftIndex + 1, wkt.length - 1)
      let polyArray = str.split(")),((")
      for(let i=0;i<polyArray.length;i++){
        let pStr = polyArray[i]
        if(polyArray.length == 1){

        }else if(i == 0){

        }else if(i == polyArray.length - 1){

        }else{

        }
      }
    }
  },
  // lnglatToPixel:function(lng,lat,zoom) {
  //
  //   let X= (lng + 180) * (256  * 2^zoom) / 360;
  //   let siny = Math.sin(lat * Math.PI / 180);
  //
  //   let y = Math.log((1 + siny) / (1 - siny));
  //
  //   let Y= (128 * 2^ zoom) * (1 - y / (2 * Math.PI));
  //
  //   return {x:X,y:Y};
  //
  // }
  MergeArray:function(arr1,arr2){
    var _arr = new Array();
    for(var i=0;i<arr1.length;i++){
      _arr.push(arr1[i]);
    }
    for(var i=0;i<arr2.length;i++){
      var flag = true;
      for(var j=0;j<arr1.length;j++){
        if(arr2[i]==arr1[j]){
          flag=false;
          break;
        }
      }
      if(flag){
        _arr.push(arr2[i]);
      }
    }
    return _arr;
  },
  // md5加密、解密
  md5: function(string) {
    var F = function(x, y, z) {
      return (x & y) | ((~ x) & z);
    }
    var G = function(x, y, z) {
      return (x & z) | (y & (~ z));
    }
    var H = function(x, y, z) {
      return (x ^ y ^ z);
    }
    var I = function(x, y, z) {
      return (y ^ (x | (~ z)));
    }
    var rotateLeft = function(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    var FF = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var GG = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var HH = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var II = function(a, b, c, d, x, s, ac) {
      a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    };
    var uTF8Encode = function(string) {
      string = string.replace(/\x0d\x0a/g, "\x0a");
      var output = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          output += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          output += String.fromCharCode((c >> 6) | 192);
          output += String.fromCharCode((c & 63) | 128);
        } else {
          output += String.fromCharCode((c >> 12) | 224);
          output += String.fromCharCode(((c >> 6) & 63) | 128);
          output += String.fromCharCode((c & 63) | 128);
        }
      }
      return output;
    };
    var wordToHex = function(lValue) {
      var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValueTemp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
      }
      return WordToHexValue;
    };
    var addUnsigned = function(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
      if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }
    var convertToWordArray = function(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWordsTempOne = lMessageLength + 8;
      var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
      var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
      var lWordArray = Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
    string = uTF8Encode(string);
    x = convertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
      AA = a; BB = b; CC = c; DD = d;
      a = FF(a, b, c, d, x[k+0],  S11, 0xD76AA478);
      d = FF(d, a, b, c, x[k+1],  S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k+2],  S13, 0x242070DB);
      b = FF(b, c, d, a, x[k+3],  S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k+4],  S11, 0xF57C0FAF);
      d = FF(d, a, b, c, x[k+5],  S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k+6],  S13, 0xA8304613);
      b = FF(b, c, d, a, x[k+7],  S14, 0xFD469501);
      a = FF(a, b, c, d, x[k+8],  S11, 0x698098D8);
      d = FF(d, a, b, c, x[k+9],  S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k+10], S13, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[k+11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k+12], S11, 0x6B901122);
      d = FF(d, a, b, c, x[k+13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k+14], S13, 0xA679438E);
      b = FF(b, c, d, a, x[k+15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k+1],  S21, 0xF61E2562);
      d = GG(d, a, b, c, x[k+6],  S22, 0xC040B340);
      c = GG(c, d, a, b, x[k+11], S23, 0x265E5A51);
      b = GG(b, c, d, a, x[k+0],  S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k+5],  S21, 0xD62F105D);
      d = GG(d, a, b, c, x[k+10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k+15], S23, 0xD8A1E681);
      b = GG(b, c, d, a, x[k+4],  S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k+9],  S21, 0x21E1CDE6);
      d = GG(d, a, b, c, x[k+14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k+3],  S23, 0xF4D50D87);
      b = GG(b, c, d, a, x[k+8],  S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k+13], S21, 0xA9E3E905);
      d = GG(d, a, b, c, x[k+2],  S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k+7],  S23, 0x676F02D9);
      b = GG(b, c, d, a, x[k+12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k+5],  S31, 0xFFFA3942);
      d = HH(d, a, b, c, x[k+8],  S32, 0x8771F681);
      c = HH(c, d, a, b, x[k+11], S33, 0x6D9D6122);
      b = HH(b, c, d, a, x[k+14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k+1],  S31, 0xA4BEEA44);
      d = HH(d, a, b, c, x[k+4],  S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k+7],  S33, 0xF6BB4B60);
      b = HH(b, c, d, a, x[k+10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k+13], S31, 0x289B7EC6);
      d = HH(d, a, b, c, x[k+0],  S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k+3],  S33, 0xD4EF3085);
      b = HH(b, c, d, a, x[k+6],  S34, 0x4881D05);
      a = HH(a, b, c, d, x[k+9],  S31, 0xD9D4D039);
      d = HH(d, a, b, c, x[k+12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k+15], S33, 0x1FA27CF8);
      b = HH(b, c, d, a, x[k+2],  S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k+0],  S41, 0xF4292244);
      d = II(d, a, b, c, x[k+7],  S42, 0x432AFF97);
      c = II(c, d, a, b, x[k+14], S43, 0xAB9423A7);
      b = II(b, c, d, a, x[k+5],  S44, 0xFC93A039);
      a = II(a, b, c, d, x[k+12], S41, 0x655B59C3);
      d = II(d, a, b, c, x[k+3],  S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k+10], S43, 0xFFEFF47D);
      b = II(b, c, d, a, x[k+1],  S44, 0x85845DD1);
      a = II(a, b, c, d, x[k+8],  S41, 0x6FA87E4F);
      d = II(d, a, b, c, x[k+15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k+6],  S43, 0xA3014314);
      b = II(b, c, d, a, x[k+13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k+4],  S41, 0xF7537E82);
      d = II(d, a, b, c, x[k+11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k+2],  S43, 0x2AD7D2BB);
      b = II(b, c, d, a, x[k+9],  S44, 0xEB86D391);
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }
    var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return tempValue.toLowerCase();
  },
// Base64加密、解密
  Base64:{
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = this._utf8_encode(input);
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output +
          this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
      }
      return output;
    },

    // public method for decoding
    decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = this._utf8_decode(output);
      return output;
    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }

      }
      return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
      var string = "";
      var i = 0,c1,c2,c3;
      var c = c1 = c2 = 0;
      while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i+1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i+1);
          c3 = utftext.charCodeAt(i+2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    }
  },
// sh1加密、解密
  sh1:function(){
    var hexcase = 0; /* 十六进制输出格式。0 -小写；1 -大写 */
    var b64pad = ""; /* base- 64填充字符。“=”表示严格的RFC合规性 */
    var chrsz = 8; /* 每个输入字符的位数。8 - ASCII；16 -统一码 */
    this.hex_sha1=function(s) {
      return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
    }

    this.b64_sha1=function(s) {
      return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
    }

    this.str_sha1=function(s) {
      return binb2str(core_sha1(str2binb(s), s.length * chrsz));
    }

    this.hex_hmac_sha1=function(key, data) {
      return binb2hex(core_hmac_sha1(key, data));
    }

    this.b64_hmac_sha1=function(key, data) {
      return binb2b64(core_hmac_sha1(key, data));
    }

    this.str_hmac_sha1=function(key, data) {
      return binb2str(core_hmac_sha1(key, data));
    }
    this.sha1_vm_test=function() {
      return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
    }

    function core_sha1(x, len) {
      x[len >> 5] |= 0x80 << (24 - len % 32);
      x[((len + 64 >> 9) << 4) + 15] = len;

      var w = Array(80);
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;
      var e = -1009589776;

      for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;

        for (var j = 0; j < 80; j++) {
          if (j < 16) w[j] = x[i + j];
          else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
          var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
          e = d;
          d = c;
          c = rol(b, 30);
          b = a;
          a = t;
        }

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
      }
      return Array(a, b, c, d, e);

    }
    function sha1_ft(t, b, c, d) {
      if (t < 20) return (b & c) | ((~b) & d);
      if (t < 40) return b ^ c ^ d;
      if (t < 60) return (b & c) | (b & d) | (c & d);
      return b ^ c ^ d;
    }
    function sha1_kt(t) {
      return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
    }
    function core_hmac_sha1(key, data) {
      var bkey = str2binb(key);
      if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

      var ipad = Array(16),
        opad = Array(16);
      for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }

      var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
      return core_sha1(opad.concat(hash), 512 + 160);
    }
    function safe_add(x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }
    function rol(num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
    }
    function str2binb(str) {
      var bin = Array();
      var mask = (1 << chrsz) - 1;
      for (var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
      return bin;
    }
    function binb2str(bin) {
      var str = "";
      var mask = (1 << chrsz) - 1;
      for (var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
      return str;
    }
    function binb2hex(binarray) {
      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
      }
      return str;
    }
    function binb2b64(binarray) {
      var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var str = "";
      for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
          if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
          else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
      }
      return str;
    }
  }
}
export default util

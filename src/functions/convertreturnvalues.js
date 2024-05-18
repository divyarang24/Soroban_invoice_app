import BigNumber from "bignumber.js";
import * as SorobanClient from "stellar-sdk";
import { Buffer } from "buffer";
// import { buffer } from "stream/consumers";


// BigNumber
export function scvalToBigNumber(arm, obj) {
  switch (arm) {
    case "i128":
      let object_value = obj._value;
      const hi = new BigNumber(object_value._attributes.hi._value);
      const lo = new BigNumber(object_value._attributes.lo._value);
      const result = new BigNumber(hi).times("18446744073709551616").plus(lo);
      return result.toNumber();
      break;
    case "u128":
      let obj2 = obj._value;
      const hi2 = new BigNumber(obj2._attributes.hi._value);
      const lo2 = new BigNumber(obj2._attributes.lo._value);
      const result2 = new BigNumber(hi2)
        .times("18446744073709551616")
        .plus(lo2);
      return result2.toNumber();
      break;
    case 'str':
        let byteArray = obj._value.data ? obj._value.data:"undefined";
        const str = String.fromCharCode(...byteArray);
        return str;
        break;
    case "map":
      let for_map = obj._value.map(a => a._attributes);
      let object = {};
      let map_arm = for_map.map(a => a.val._arm);
      for_map.map(a => {
        const key = Buffer.from(a.key._value.data).toString("utf8");

        switch (a.val._arm) {
          case "i128":
            let object_value = a.val._value;
            const hi = new BigNumber(object_value._attributes.hi._value);
            const lo = new BigNumber(object_value._attributes.lo._value);
            const result = new BigNumber(hi)
              .times("18446744073709551616")
              .plus(lo);

            object[key] = result.toNumber();
            break;
          case "u128":
            let obj2 = a.val._value;
            const hi2 = new BigNumber(obj2._attributes.hi._value);
            const lo2 = new BigNumber(obj2._attributes.lo._value);
            const result2 = new BigNumber(hi2)
              .times("18446744073709551616")
              .plus(lo2);
            object[key] = result2.toNumber();
            break;
          case "bytes":
            object[key] = a.val._value.data;
            break;
          case "u64":
            let u64 = parseInt(a.val._value._value);
            object[key] = u64;
            break;
          case "address":
            let arms = a["val"]["_value"]["_arm"];
            if (arms == "accountId"){
              let data = a["val"]["_value"]["_value"]["_value"]["data"];
             const accountIDBytes = new Uint8Array(data);
             const publicKey = StellarSdk.StrKey.encodeEd25519PublicKey(accountIDBytes);
             const address = publicKey.toString();
             object[key] = address;
            } else if(arms == "contractId"){
              let array = a["val"]["_value"]["_value"]["data"];
              const hexString = array.map(i => i.toString(16).padStart(2, '0')).join('');
              object[key] = hexString;
             }
            break;
          case "vec":
            let arm = a.val._value[0]? a.val._value[0]._arm :"undefined";

            if (arm === "address") {
              const dataArray = a.val._value;
              let addresslist = [];
              for (let i = 0; i < dataArray.length; i++) {
                let value = a.val._value[i]._value._value?._value.data;
                let accountIDBytes2 = new Uint8Array(value);
                let publicKey2 = StellarSdk.StrKey.encodeEd25519PublicKey(accountIDBytes2);
                let address2 = publicKey2.toString();
                addresslist.push(address2);
              }
              object[key] = addresslist;
              break;
            }
            else if (arm === "sym"){
              let array = [];
              let vec = a.val._value[0]._value.data;
              let string = String.fromCharCode(...vec);
              object[key] = string;
              break;
            }
            else if (arm === "u64"){
              const dataArray = a.val._value;
              let datelist = [];
              for (let i = 0; i < dataArray.length; i++) {
                let value = a.val._value[i]._value._value;
                let u64 = parseInt(value);
                datelist.push(u64);
              }
              object[key] = datelist;
              break;
            }
            else if ( arm === "str"){
              let array = [];
              let vec = a.val._value.map(a => {
                let data = a._value.data;
                let string = String.fromCharCode(...data);
                array.push(string);
              });
              object[key] = array;
              break;
            }
            else if (arm === "i32"){
              let datelist = [];
              const dataArray = a.val._value.map(a => {
                   datelist.push(a._value);
              });
              object[key] = datelist;
            }
            else {
              object[key] = [];
              break;
            }
            break;
          case 'str':
            let str_data = a.val._value.data;
            let string = String.fromCharCode(...str_data);
            object[key] = string;
            break;
          default:
            const u32Val = a.val._value;
            object[key] = u32Val;
            break;
        }
      });
      return object;
    default:
      break;
  }
}

function bigNumberFromBytes(signed, ...bytes) {
  let sign = 1;
  if (signed && bytes[0] === 0x80) {
    // top bit is set, negative number.
    sign = -1;
    bytes[0] &= 0x7f;
  }
  let b = BigInt(0);
  for (let byte of bytes) {
    b <<= BigInt(8);
    b |= BigInt(byte);
  }
  return BigNumber(b.toString()).multipliedBy(sign);
}

function bigintToBuf(bn) {
  var hex = BigInt(bn).toString(16).replace(/^-/, "");
  if (hex.length % 2) {
    hex = "0" + hex;
  }

  var len = hex.length / 2;
  var u8 = new Uint8Array(len);

  var i = 0;
  var j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  if (bn < BigInt(0)) {
    // Set the top bit
    u8[0] |= 0x80;
  }

  return Buffer.from(u8);
}

function xdrUint64ToNumber(value) {
  let b = 0;
  b |= value.high;
  b <<= 8;
  b |= value.low;
  return b;
}

function scvalToString(value) {
  return value.bytes().toString();
}

function xdrtostring(val) {
  const decodedData = Buffer.from(val, "base64").toString("utf8");
  return decodedData;
}

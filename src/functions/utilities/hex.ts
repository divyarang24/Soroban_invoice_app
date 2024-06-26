function encode(data:any) {
  let bytes:any = null;

  // Convert any valid incoming data to Uint8Array.
  if (data instanceof Uint8Array) {
    bytes = data;
  } else if (data instanceof ArrayBuffer) {
    bytes = new Uint8Array(data);
  }

  if (bytes === null) {
    var e = new Error(`Error: cannot encode data of type '${typeof data}'.`);
    throw e;
  }

  // Take each byte and conver to string using 16 radix and zero padding to produce 2 characters per byte.
  return bytes.reduce((hex: any, byte: { toString: (arg0: number) => string; }) => `${hex}${byte.toString(16).padStart(2, '0')}`, '');
}

function decode(data: string) {
  const bytes:any = [];
  for (let cursor = 0; cursor < data.length; cursor += 2) {
    // Cut data string into 2 character long chunks and parse with 16 radix.
    bytes.push(Number.parseInt(data.substr(cursor, 2), 16));
  }
  return new Uint8Array(bytes);
}

export { encode, decode };

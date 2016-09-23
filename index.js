const merge = require('xtend');

const max = ( x, y ) => x > y ? x : y;

const defaultTimestamp = x => (x ? new Date(x) : new Date()).getTime();

const defaultOpts = {
  timestamp: defaultTimestamp,
  size: 6,
  timeBuffer: 100
};

class Timeable {
  constructor( options = {} ) {
    this.opts = merge(defaultOpts, options);
    let { timestamp, size, timeBuffer } = this.opts;
    this.lastTimestamp = timestamp() - 1;
    this.timestamp = timestamp;
    this.size = size;
    this.timeBuffer = timeBuffer;
    this.count = 0;
  }

  next() {
    const ts = this.timestamp();
    let b = Buffer.alloc(this.size), id;

    if (ts > this.lastTimestamp) this.count = 0;
    else ++this.count;

    id = ts * this.timeBuffer + this.count;
    this.lastTimestamp = max(ts, Math.floor(id / this.timeBuffer));
    b.writeUIntBE(id, 0, this.size);

    return b;
  }

  toTime( id ) {
    return Math.floor(id.readUIntBE(0, this.size) / this.timeBuffer);
  }

  fromTime( time ) {
    let b = Buffer.alloc(this.size);
    b.writeUIntBE(new Date(time).getTime() * this.timeBuffer, 0, this.size);
    return b;
  }
}

module.exports = Timeable;
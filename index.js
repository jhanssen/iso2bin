const fs = require("fs");

const input = process.argv[2];
const output = process.argv[3];
const pad = parseInt(process.argv[4]);
const inSector = parseInt(process.argv[5]);
if (isNaN(pad)) {
    pad = 0;
}
if (isNaN(inSector)) {
    inSector = 2048;
}

if (!input || !output) {
    console.error("need an input and output file name");
    process.exit(1);
}

let inf, outf;
try {
    inf = fs.openSync(input, "r");
    outf = fs.openSync(output, "w");
} catch (e) {
    console.error(e.message);
    process.exit(0);
}

let num;
const buf = Buffer.alloc(2352);

// pad in number of sectors
for (let i = 0; i < pad; ++i) {
    num = fs.writeSync(outf, buf, 0);
    if (num != 2352) {
        console.error("wrote", num);
        process.exit(1);
    }
}

// bin files have a 16 byte header
if (inSector != 2352) {
    num = fs.writeSync(outf, buf, 0, 16);
    if (num != 16) {
        console.error("wrote", num);
        process.exit(1);
    }
}

for (;;) {
    try {
        num = fs.readSync(inf, buf, 0, inSector);
        if (num != inSector) {
            console.log("read", num);
            process.exit(0);
        }
        num = fs.writeSync(outf, buf, 0);
        if (num != 2352) {
            console.error("wrote", num);
            process.exit(1);
        }
    } catch (e) {
        console.error(e.message);
        process.exit(0);
    }
}

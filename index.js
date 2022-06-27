const fs = require("fs");

const input = process.argv[2];
const output = process.argv[3];

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

const buf = Buffer.alloc(2352);

let off = 0, num;
for (;;) {
    try {
        num = fs.readSync(inf, buf, 0, 2048, off);
        if (num != 2048) {
            process.exit(0);
        }
        num = fs.writeSync(outf, buf, 0);
        if (num != 2352) {
            console.error("wrote", num);
        }

        off += 2048;
    } catch (e) {
        console.error(e.message);
        process.exit(0);
    }
}

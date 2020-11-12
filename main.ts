import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { walk, exists, existsSync, ensureDir, ensureDirSync, ensureFile } from "https://deno.land/std/fs/mod.ts";

const dirname = v4.generate();
interface User {
    firstName: string;
    lastName: string;
    email: string;
    photoFileName: string;
}

const user: User = {
    firstName: "Cat",
    lastName: "Smith",
    email: "cat.smith@somecompany.com",
    photoFileName: "cat.jpg"
};

// exists(`./data/${dirname}`)
// .then( what => {
//     console.log(what);
// })
// .catch(e => {
//     console.error(e);
// });

// if( existsSync(`./data/${dirname}`)) {
//     console.log("Dir exists");
// }
// else {
//     console.error("No such dir exists!");
// }

// await ensureDir(`./data/${dirname}`);
//----------------------------------------------
const cfile = await Deno.open("./data/cat.jpg");
const fcontent = await Deno.readAll(cfile); // fcontent: Uint8Array 

await ensureFile('./data/newcat.jpg');
const outputFile = await Deno.open("./data/newcat.jpg", { write: true });
await Deno.writeAll(outputFile, fcontent);
Deno.close(outputFile.rid);
// ----------------------------------------------
const setupUser = async ( info: User ) => {
    const foldername = v4.generate();
    const fname = `${info.firstName}_${info.lastName}.txt`;
    await ensureDir(`./data/${foldername}`);
    await ensureFile(`./data/${foldername}/${fname}`);
    const fhandler = Deno.open(`./data/${foldername}/${fname}`);
    const encoder = new TextEncoder();
    const data = encoder.encode(`${info.firstName},${info.lastName},${info.email},${info.photoFileName}\n`);
    await Deno.writeFile(`./data/${foldername}/${fname}`, data, { create: false });
    await Deno.writeFile(`./data/${foldername}/${fname}`, data, { append: true });
    await Deno.writeFile(`./data/${foldername}/${fname}`, data, { append: true });
    await Deno.writeFile(`./data/${foldername}/${fname}`, data, { append: true });   
    await Deno.writeFile(`./data/${foldername}/${fname}.json`, encoder.encode(JSON.stringify(info)), { create: true }); 
}

await setupUser(user);

const listFiles = async (path: string) => {
  for await (const item of walk(path)) {      
    if(item.isDirectory) {
    console.log("Directory: ", item.path);  
    }
    else {
    console.log("File name: ", item.path); 
    }      
  }
}

await listFiles("./data");
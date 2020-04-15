/**
 * SARS-COV-2 - RevEng Project 
 * Samuel Lespes Cardillo
 * 
 * Rebuilt from scratch for GitHub publication
 * 
 * To Do : 
 * - Comparison between different GenSeq.
 * - Graphic interface for data viz.
 * - More understandable map for understanding mutations.
 */

const fs = require("fs")
  ,   util = require("util")
  ,   zlib = require("zlib")

let codonsTable = "";
let geneticSeqName = "";

// We load up the codon table
fs.readFile('./codontable.json', (err, data) => {
  codonsTable = JSON.parse(data);
})

// We take the sample from the GenBank
function getSample(sampleName, outputRna) {
  outputRna = outputRna || false;
  geneticSeqName = sampleName;

  return new Promise((resolve, reject) => {
    let covidSample = require("fs").readFile(`./${sampleName}.txt`, (err, data) => {
      let string = new Buffer.alloc(data.length, data).toString();
      string = string.replace(/[\s\d]+/gm, '');

      fs.mkdir(`./exports/${geneticSeqName}`, (err) => { 
      })

      // If outputRna is given then we
      if(outputRna) { 
        fs.writeFile(`./exports/${geneticSeqName}/${geneticSeqName}.txt`, string, (err) => {})      
      }

      return resolve(string);
    })
  })
}

// Allows to encode the genome in order to obtain size in Kilobytes
async function encodeGenome(data) { 
  let encoder = new util.TextEncoder;
  
  zlib.gzip(encoder.encode(data), (err, result) => {
    return result.length;
  })
}

function translate(data, start, end, markStop, outputName) { 
  let translation = "";
  outputName = outputName || false;
  markStop = markStop || false;
  data = data.substr(start-1, end-(start-1));


  for(var i = 0; i < data.length; i = i + 3) {
    let frame = (data[i] + data[i+1] + data[i+2]).toUpperCase();

    for(var k in codonsTable) {
      if(codonsTable[k].includes(frame)) { 
        // If STOP and markStop is false then we don't mark the stop
        // if(k === "X" && !markStop) continue;
        translation += k; // We add the amino acid in the translation
      }
    }
  }

  // If outputName is given then we save the output in a file with corresponding name
  if(outputName) { 
    fs.writeFile(`./exports/${geneticSeqName}/${outputName}.txt`, translation, (err) => {
      if(err) console.log(err);
    })
  }
  

  return translation;
}

// Wuhan first genome
// getSample("MN9089473", true).then((data) => {
//   let orf1ab = translate(data.substr(266-1, 21555-(266-1)), false, "orf1ab");
//   let spike_protein = translate(data.substr(21563-1, 25384-(21563-1)), false, "spike_protein");
//   let orfa3 = translate(data.substr(25393-1, 26220-(25393-1)), false, "orf3a");
//   let e_protein = translate(data.substr(26245-1, 26472-(26245-1)), false, "E");
//   let m_protein = translate(data.substr(26523-1, 27191-(26523-1)), false, "M");
//   let orf6 = translate(data.substr(27202-1, 27387-(27202-1)), false, "orf6");
//   let orf7a = translate(data.substr(27894-1, 27759-(27894-1)), false, "orf7a");
//   let orf8 = translate(data.substr(27894-1, 28259-(27894-1)), false, "orf8");
//   let n = translate(data.substr(28274-1, 29533-(28274-1)), false, "N");
//   let orf10 = translate(data.substr(29558-1, 29674-(29558-1)), false, "orf10");
// })

// Partial ORF1ab nsp2 (Tunis - 3 April 2020)
getSample("MT324683", true).then((data) => {
  let orf1ab = translate(data, 1, 344, true, "orf1ab");
})



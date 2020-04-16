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
        if(k === "X" && !markStop) continue;
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


function compare(genSeqOne, genSeqTwo) {
  let genSeqOneLength = genSeqOne.length;
  let genSeqTwoLength = genSeqTwo.length;
  let diff = {
    total: 0,
    mismatch: []
  }

  if(genSeqOneLength !== genSeqTwoLength) return console.log("Length mismatch.");

  for(var i = 0; i < genSeqOneLength; i++) {
    if(genSeqOne[i] !== genSeqTwo[i]) {
      diff.total++;
      diff.mismatch.push({position: i, seqOne: genSeqOne[i], seqTwo: genSeqTwo[i]})
    }
  }

  console.log(`${diff.total} possible diff in compared sequences.`);
}




// compare("RAPHGHVMVELVAELEGIQYGRSGETLGVLVPHVGEIPVAYRKVLLRKNGNKGAGGHSYGADLKSFDLGDELGTDPYEDFQENWNTKHSSGVTRELMRELNGGAYTRYVDNNF", "TAPHGHVMVELVAELEGIQYGRSGETLGVLVPHVGEIPVAYRKVLLRKNGNKGAGGHSYGADLKSFDLGDELGTDPYEDFQENWNTKHSSGVTRELMRELNGGAYTRYVDNNF")

let cheerio = require("cheerio");
let request = require("request");
request("https://www.ncbi.nlm.nih.gov/nuccore/MN908947", (err, res) => {
  let uid = res.body.split("ordinalpos=1&amp;ncbi_uid=");
  uid = uid[1].split('&')[0];
  let link = `https://www.ncbi.nlm.nih.gov/sviewer/viewer.fcgi?id=${uid}&db=nuccore&report=genbank&conwithfeat=on&withparts=on&hide-cdd=on&retmode=html&withmarkup=on&tool=portal&log$=seqview&maxdownloadsize=1000000`
  
  console.debug("Fetching API url...")
  request(link, (err, res) => {
    let features = res.body.split(/(_CDS_)[0-9](" class="feature")/);
    // let features = res.body.split("CDS\"")
    console.dir(features.length)

    // Start at 4 -- Everything else is useless overhead
    // for(var i = 1; i < features.length; i++) { 
    //   let genomeDetails = features[i];
    //   let name = genomeDetails.split("/gene=\"")[1].split("\"")[0];
    //   // let length = genomeDetails.split("join(")[1];
    //   console.log(name)
      
    // }

    


    // console.dir(features[startPos]);
  })




  

  // let response = res.body.split("class=\"feature\"");
  // let features = [];

  // fs.writeFile("debug.txt", response, 'utf8', (err) => {})
  
  // console.dir(response[0])
  

})


// Wuhan first genome
// getSample("MN9089473", true).then((data) => {
//   let orf1ab = translate(data, 266, 21555, false, "orf1ab");
//   let spike_protein = translate(data, 21563, 25384, false, "spike_protein");
//   let orfa3 = translate(data, 25393, 26220, false, "orf3a");
//   let e_protein = translate(data, 26245, 26472, false, "E");
//   let m_protein = translate(data, 26523, 27191, false, "M");
//   let orf6 = translate(data, 27202, 27387, false, "orf6");
//   let orf7a = translate(data, 27894, 27759, false, "orf7a");
//   let orf8 = translate(data, 27894, 28259, false, "orf8");
//   let n = translate(data, 28274, 29533, false, "N");
//   let orf10 = translate(data, 29558, 29674, false, "orf10");
// })

// Complete Sars Cov 2 (NC - April 2020)
// No mutation in NSP2
// getSample("MT308702", true).then((data) => {
//   let orf1ab = translate(data, 241, 21530, false, "orf1ab");
//   let nsp2 = translate(data, 781, 2694, false, "nsp2");
//   let spike_protein = translate(data, 21538, 25359, false, "spike_protein");
//   let orfa3 = translate(data, 25368, 26195, false, "orf3a");
//   let e_protein = translate(data, 26220, 26447, false, "E");
//   let m_protein = translate(data, 26498, 27166, false, "M");
//   let orf6 = translate(data, 27177, 27362, false, "orf6");
//   let orf7a = translate(data, 27369, 27734, false, "orf7a");
//   let orf8 = translate(data, 27869, 28234, false, "orf8");
//   let n = translate(data, 28249, 29508, false, "N");
//   let orf10 = translate(data, 29533, 29649, false, "orf10");
// })

// // Partial ORF1ab nsp2 (Tunis - 3 April 2020)
// Mutation of first amino NSP2 (T to R)
// getSample("MT324683", true).then((data) => {
//   let orf1ab = translate(data, 1, 344, true, "orf1ab");
// })
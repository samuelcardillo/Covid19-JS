/**
 * SARS-COV-2 - RevEng Project 
 * Samuel Lespes Cardillo
 */

const fs = require("fs")
  ,   util = require("util")
  ,   zlib = require("zlib")
  ,   request = require("request");

const arguments = process.argv.slice(2);

if(arguments.length > 0) {
  let name = arguments[0]; 
  downloadGenome(name).then(() => {
    generateReport(name);
  })
}



//////////////////////////////////////////////////////////////////////

// Allows to encode the genome in order to obtain size in Kilobytes
async function encodeGenome(data) { 
  let encoder = new util.TextEncoder;
  
  zlib.gzip(encoder.encode(data), (err, result) => {
    return result.length;
  })
}

// Translate RNA to AA
function translate(data, start, end, markStop, genomeName, proteinName) { 
  let translation = "";

  fs.readFile('./codontable.json', (err, unparsedCodonsTable) => {
    codonsTable = JSON.parse(unparsedCodonsTable);
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
    fs.writeFile(`./exports/${genomeName}/${proteinName}.txt`, translation, (err) => {
      if(err) console.log(err);
    })
  })
}

// Download a genome from the NCBI GenBank
function downloadGenome(name) {
  return new Promise((resolve, reject) => {
    request(`https://www.ncbi.nlm.nih.gov/nuccore/${name}`, (err, res) => {
      let uid = res.body.split("ordinalpos=1&amp;ncbi_uid=");
      uid = uid[1].split('&')[0];
      let link = `https://www.ncbi.nlm.nih.gov/sviewer/viewer.fcgi?id=${uid}&db=nuccore&report=genbank&conwithfeat=on&withparts=on&hide-cdd=on&retmode=html&withmarkup=on&tool=portal&log$=seqview&maxdownloadsize=1000000`
      
      request(link, (err, res) => {
        let features = res.body.split(/(?:_CDS_[0-9]" class="feature">)/);
        let genomeInfos = res.body.split("_source_0\" class=\"feature\">")[1];
        let fullSequence = [];
        let fullGenome = {
          infos: {
            name: genomeInfos.split("/organism=\"")[1].split("\"")[0],
            date: genomeInfos.split("/collection_date=\"")[1].split("\"")[0],
            isolate: genomeInfos.split("/isolate=\"")[1].split("\"")[0],
            country: genomeInfos.split("/country=\"")[1].split("\"")[0],
            host: genomeInfos.split("/host=\"")[1].split("\"")[0],        
          },
          proteins: [],
          code: null
        }

        // Start at 1 -- 0 is overhead
        for(var i = 1; i < features.length; i++) {
          let name = features[i].split("/gene=\"")[1].split("\"")[0];
          let sequence = JSON.parse(`[${features[i].split("features[\"CDS\"].push([")[1].split("]);")[0]}]`);
          let start = sequence[0][0];
          let end = (sequence.length > 1) ? sequence[1][1] : sequence[0][1];

          fullGenome.proteins.push({
            name: name,
            start: start,
            end: end
          })
        }

        let unparsedSequences = res.body.split(/(?:<span class="ff_line" id="[A-Z]{1,}[0-9]{1,20}(?:.)[0-9]{1,10}(?:_)[0-9]{1,10}">)/);
        for(var i2 = 1; i2 < unparsedSequences.length; i2++) { 
          fullSequence.push(unparsedSequences[i2].split("</span>")[0]);
        }
        fullGenome.code = fullSequence.join('').split(' ').join('');

        fs.writeFile(`./genomes/${name}.json`, JSON.stringify(fullGenome), (err) => {
          if(err) return reject();
          return resolve();
        })
      })
    })
  })
}

// Generate a report of the genome
function generateReport(name) { 
  fs.readFile(`./genomes/${name}.json`, (err, json) => {
    json = JSON.parse(json);

    fs.mkdir(`./exports/${name}`, (err) => { })    

    for(var k in json.proteins) {
      translate(json.code, json.proteins[k].start, json.proteins[k].end, false, name, json.proteins[k].name);
    }
  })
}

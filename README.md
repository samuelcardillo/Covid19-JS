
## Covid19.js

Still WIP. Focus is on making mutations "easier" to detect without big software. GUI will be built in order to allow better data viz. Initial code was trashed in order to rewrite properly a code suitable for GitHub publication.

## Usage

Give the name from the GenBank as an argument to `covid19.js` in order to automatically download and interpret it. 
You can then use `viewer.html` to look at the genome and `compare.html` to compare 2 downloaded genomes in order
to see possible mutations.

Example of starting `covid19.js` : 
`./covid19.js MN908947`

You can find the genomes on the NCBI website : https://www.ncbi.nlm.nih.gov/genbank/sars-cov-2-seqs/

## Understand Sars-Cov-2

Here is a very brief explanation of the main proteins of Sars-Cov-2 in order to make it easier to understand which mechanisms the possible mutations might affect.

* ORF1ab (payload) : In charge of the virus replication 
* S - Spike Protein (exploit) : Attach to the ACE2 receptor to send the payload
* ORF3a : Help to poke a hole in the infected cell membrane for the payload to be sent
* E : Help to create the virus oil bubble and apparently also altering genetic activity patterns.
* M : Help at creating the outer shell of SARS-Cov-2 with S, E and N.
* ORF6 : Block the signal sent to the immune system
* ORF7a : Block the production of tetherin from infected cells to allow the virus to replicate properly. It can also activate the suicide of an infected cell.
* ORF8 : Very different than other coronaviruses. Researchers are still debating its use.
* N : Help at making the RNA code stable.
* ORF10 : Plays an unkown role (like ORF8) and seems to be quite unique for SARS-Cov-2.

## To do :
- Enhance interface design
- Improve comparison system
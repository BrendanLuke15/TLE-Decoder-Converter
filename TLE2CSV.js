/*
By: Brendan Luke
Date: March 26, 2022
Scope: convert TLEs to CSV format, then call chart function
*/

// Read uploaded .txt file case:
window.onload = function() { // wait until HTML is all loaded, was causing some errors
    inputButton = document.getElementById('fileInput');
    inputButton.addEventListener('change',fileUpload); // add event listener for change in fileInput
}
function fileUpload() {
    document.getElementById('fileInput').click();
    var file = this.files[0]; // get the first file
    var fileName = file.name; // filename of uploaded file
    var reader = new FileReader(); // create new file reader
    reader.readAsBinaryString(file); // required
    reader.onload = function(e) { // when file upload is completed do the following:
        let data = e.target.result; // data string 
        output(data,fileName);
    }
}

// Read submitted text case:
function textSubmit() {
    var data = document.getElementById('textInput').value; // get contents of textInput element
    if (data === "") { // check if input is empty
        alert('Please submit data to the text input area.'); // alert user to input data
    } else {
        output(data,"Output TLEs.txt");
    }
}

// Output function
function output(data,fileName) {
    data = data.split('\n'); // split data into array by new line
    var csvString = 'TLE:,Epoch (Excel Date):,Epoch:,Mean Motion:,Period (s):,Semi-Major Axis (m):,Eccentricity:,Inclination (deg):,Argument of Periapsis (deg):,Right Ascension of the Ascending Node (deg):,Apoapsis (km):,Periapsis (km):,Semi-Major Axis Height (km):,398600.44188,6378137\n'; // initialize final data holder
    var j = 0; // counter variable for data object indexing
    Epoch = []; MM = []; T = []; sma = []; ecc = []; inc = []; weta = []; RAAN = []; Apo = []; Peri = []; smaH = [];
    for (let i = 0; i < data.length; i++) { // start from first line
        var lineNo = data[i].substring(0,1); // line number of TLE
        if (lineNo == '1') { // new TLE
            // get Epoch data:
            year = data[i].substring(18,20); // last two digits of year
            if (parseInt(year) < 57) {
                year = parseInt('20'+year);
            } else {
                year = parseInt('19'+year);
            }
            day = data[i].substring(20,31); // day of year
            /*
                offer two Epoch formats; ISO formatted string, and formula for excel dates
            */
            EpochExcel = '=date(' + year + ',1,1)+' + (parseFloat(day)-1).toString(); // excel formula to find epoch
            Epoch[j] = Epoch2ISODateStr(day, year);

            // write data
            csvString = csvString + '"' + data[i] + '\n';
        } else if (lineNo == '2') { // second line of TLE
            csvString = csvString + data[i] + '\n'; // write TLE to string
            MM[j] = data[i].substring(52,62); // mean motion (revs/day)
            T[j] = 86400/parseFloat(MM[j]); // orbital period (s)
            sma[j] = Math.pow((Math.pow(T[j],2)*3.9860044188*Math.pow(10,14)/Math.pow((2*Math.PI),2)),(1/3)); // semi-major axis (m)
            ecc[j] = '0.' + data[i].substring(26,32); // eccentricity
            inc[j] = data[i].substring(8,15); // inclination (deg)
            weta[j] = data[i].substring(34,41); // argument of periapsis (deg)
            RAAN[j] = data[i].substring(17,24); // right ascension of the ascending node (deg)
            Apo[j] = (sma[j]*(1+parseFloat(ecc[j]))-6378137)/1000; // apoapsis (km)
            Peri[j] = (sma[j]*(1-parseFloat(ecc[j]))-6378137)/1000; // periapsis (km)
            smaH[j] = (sma[j]-6378137)/1000; // semi-major axis height (km) 

            // write data & iterate
            csvString = csvString + '","' + EpochExcel + '",' + Epoch[j] + "," + MM[j] + ',' + T[j] + ',' + sma[j] + ',' + ecc[j] + 
                        ',' + inc[j] + ',' + weta[j] + ',' + RAAN[j] + ',' + Apo[j] + ',' + Peri[j] + ',' + smaH[j] + '\n';              
            j = j+1;
        }
    }

    // create outData object containing all data
    const outData = {epoch:Epoch, MeanMotion:MM, OrbitalPeriod:T, SemiMajorAxisM:sma, Eccentricity:ecc, Inclination:inc, ArgumentOfPeriapsis:weta, RightAscensionOfAscendingNode:RAAN,
                    Apoapsis:Apo, Periapsis:Peri, SemiMajorAxisH:smaH};

    let blobFile = new Blob([csvString], {type: 'text/plain'}); // creates new blob data type from 'csvString' string variable
    // below creates file and downloads it to user's computer
    var a = document.createElement("a"),
    url = URL.createObjectURL(blobFile);
    a.href = url;
    a.download = fileName.substring(0,fileName.length-4) + ".csv";
    document.body.appendChild(a);
    a.click();

    // hide input elements and show canvas
    document.getElementById("inputHouse").style.display = "none";
    document.getElementById("submitHouse").style.display = "none";
    document.getElementById("chart-container").style.display = "";
    document.getElementById("chart-selection").style.display = "";

    // call charting function
    createChart(outData);
}

// function for dates
function Epoch2ISODateStr(day, year) {
    // expects float for day
    dayF = Math.floor(day);
    hour = Math.floor((day-dayF)*24);
    minute = Math.floor((((day-dayF)*24)-hour)*60);
    second = Math.floor((((((day-dayF)*24)-hour)*60)-minute)*60);

    temp = new Date(year,0,dayF,hour,minute,second);
    month = temp.getMonth() + 1;
    dayS = temp.getDate();

    // fix leading zeros if needed
    if (month < 10) {
        month = "0" + month.toString();
    }
    if (dayS < 10) {
        dayS = "0" + dayS.toString();
    }
    if (hour < 10) {
        hour = "0" + hour.toString();
    }
    if (minute < 10) {
        minute = "0" + minute.toString();
    }
    if (second < 10) {
        second = "0" + second.toString();
    }
    ISO_String = year + "-" + month + "-" + dayS + "T" + hour + ":" + minute + ":" + second + "Z";
    return ISO_String
}
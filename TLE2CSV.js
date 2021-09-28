/*
By: Brendan Luke
Date: September 28, 2021
Scope: convert TLEs to CSV format
*/

// Read uploaded .txt file case:
inputButton = document.getElementById('fileInput');
inputButton.addEventListener('change',fileUpload); // add event listener for change in fileInput
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
    var csvString = 'TLE:,Epoch:,Mean Motion:,Period (s):,Semi-Major Axis (m):,Eccentricity:,Inclination (deg):,Argument of Periapsis (deg):,Right Ascension of the Ascending Node (deg):,Apoapsis (km):,Periapsis (km):,Semi-Major Axis Height (km):,398600.44188,6378137\n'; // initialize final data holder
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
                        for now just pass the excel equation to the epoch data field
            */
            //day = addDays(new Date(year.toString()+'-01-01T00:00:00Z'),parseFloat(day));
            Epoch = '=date(' + year + ',1,1)+' + (parseFloat(day)-1).toString(); // excel formula to find epoch

            // write data
            csvString = csvString + '"' + data[i] + '\n';
        } else { // second line of TLE
            csvString = csvString + data[i] + '\n'; // write TLE to string
            MM = data[i].substring(52,62); // mean motion (revs/day)
            T = 86400/parseFloat(MM); // orbital period (s)
            sma = Math.pow((Math.pow(T,2)*3.9860044188*Math.pow(10,14)/Math.pow((2*Math.PI),2)),(1/3)); // semi-major axis (m)
            ecc = '0.' + data[i].substring(26,32); // eccentricity
            inc = data[i].substring(8,15); // inclination (deg)
            weta = data[i].substring(34,41); // argument of periapsis (deg)
            RAAN = data[i].substring(17,24); // right ascension of the ascending node (deg)
            Apo = (sma*(1+parseFloat(ecc))-6378137)/1000; // apoapsis (km)
            Peri = (sma*(1-parseFloat(ecc))-6378137)/1000; // periapsis (km)
            smaH = (sma-6378137)/1000; // semi-major axis height (km) 

            // write data
            csvString = csvString + '","' + Epoch + '",' + MM + ',' + T + ',' + sma + ',' + ecc + ',' + inc + ',' + weta + ',' + RAAN + ',' + Apo + ',' + Peri + ',' + smaH + '\n';              
        }
    }

    let blobFile = new Blob([csvString], {type: 'text/plain'}); // creates new blob data type from 'csvString' string variable
    // below creates file and downloads it to user's computer
    var a = document.createElement("a"),
    url = URL.createObjectURL(blobFile);
    a.href = url;
    a.download = fileName.substring(0,fileName.length-4) + ".csv";
    document.body.appendChild(a);
    a.click(); 
}

// function for dates
function Epoch2ISODateStr(day, year) {
    // expects float for day
    dayF = Math.floor(day);
    hour = Math.floor((day-dayF)*24);
    minute = Math.floor((((day-dayF)*24)-hour)*60);
    second = Math.floor((((((day-dayF)*24)-hour)*60)-minute)*60);

    temp = new Date(year,0,day,hour,minute,second);
    month = temp.getUTCMonth() + 1;
    dayS = temp.getDate();

    ISO_String = year + "-" + month + "-" + dayS + "T" + hour + ":" + minute + ":" + second + "Z";

    return ISO_String
    /* need to fix leading zeros */
}
/*
By: Brendan Luke
Date: March 26, 2022
Scope: create chart.js plot from TLE data
*/

function createChart(outData) { // this is called after the TLE decoded data is written to a file and downloading
    var Xselections = document.getElementById("X-Axis"); // get DOM access to x-axis selection
    var Yselections = document.getElementById("Y-Axis"); // get DOM access to y-axis selection

    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Semi-Major Axis Height (km)', // default
                data: [], // initialize empty, populate later
                backgroundColor: '#0D5198',
                borderColor: '#0D5198',
                borderWidth: 1.5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'yyyy-MMM-dd HH:mm'
                        }
                    },
                    adapters: {
                        date: {
                            zone: 'UTC'
                        }
                    }
                },
                y: {
                    type: 'linear'
                }
            }
        },
        plugins: [plugin],
    });

    for (i = 0; i < outData[Xselections.value].length; i++) { // add data
        myChart.data.datasets[0].data.push({x: luxon.DateTime.fromISO(outData.epoch[i]).ts, y: outData.SemiMajorAxisH[i]});
    }
    myChart.update(); // force update to display default data

    Xselections.addEventListener("change", function() { // change X data and label
        myChart.data.datasets[0].label = Xselections.options[Xselections.selectedIndex].text; // change label
        for (i = 0; i < myChart.data.datasets[0].data.length; i++) { // change x data
            myChart.data.datasets[0].data[i].x = outData[Xselections.value][i]; 
        }
        if (Xselections.value.toString() == 'epoch') {
            timeFlag = true;
        } else {
            timeFlag = false;
        }
        axesConfig(myChart.options.scales,timeFlag,true);
        myChart.update();
    });
    
    Yselections.addEventListener("change", function() { // change Y data and label
        myChart.data.datasets[0].label = Yselections.options[Yselections.selectedIndex].text; // change label
        for (i = 0; i < myChart.data.datasets[0].data.length; i++) { // change x data
            myChart.data.datasets[0].data[i].y = outData[Yselections.value][i]; 
        }
        if (Yselections.value.toString() == 'epoch') {
            timeFlag = true;
        } else {
            timeFlag = false;
        }
        axesConfig(myChart.options.scales,timeFlag,false)
        myChart.update();
    });
}

const plugin = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
};

function axesConfig(scaleOption,timeFlag,xAxis) {
    // configure axes (time or not)    
    if (timeFlag) { // is 'epoch' data
        if (xAxis) { // is x-axis
            scaleOption.x = {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'yyyy-MMM-dd HH:mm'
                    }
                },
                adapters: {
                    date: {
                        zone: 'UTC'
                    }
                }
            }
        } else { // is y-axis
            scaleOption.y = {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'yyyy-MMM-dd HH:mm'
                    }
                },
                adapters: {
                    date: {
                        zone: 'UTC'
                    }
                }
            }
        }
    } else { // any other data field
        if (xAxis) { // is x-axis
            scaleOption.x = {type: 'linear'}
        } else { // is y-axis
            scaleOption.y = {type: 'linear'}
        }
    }
}
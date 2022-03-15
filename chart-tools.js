/*
By: Brendan Luke
Date: March 15, 2022
Scope: create chart.js plot from TLE data
*/

function createChart(outData) { // this is called after the TLE decoded data is written to a file and downloading
    var Xselections = document.getElementById("X-Axis"); // get DOM access to x-axis selection
    var Yselections = document.getElementById("Y-Axis"); // get DOM access to y-axis selection

    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: outData.epoch, // default
            datasets: [{
                label: 'Semi-Major Axis Height (km)', // default
                data: outData.SemiMajorAxisH, // default
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
                    //type: 'time',
                    /*
                    time: {
                        displayFormats: {

                        }
                    }
                    */
                }
            }
        },
        plugins: [plugin],
    });

    Xselections.addEventListener("change", function() { // change X data and label
        myChart.data.datasets[0].label = Yselections.options[Yselections.selectedIndex].text; // change label
        myChart.data.datasets[0].data = outData[Yselections.value]; // change data
        myChart.update();
    });
    
    Yselections.addEventListener("change", function() { // change Y data and label
        myChart.data.datasets[0].label = Yselections.options[Yselections.selectedIndex].text; // change label
        myChart.data.datasets[0].data = outData[Yselections.value]; // change data
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
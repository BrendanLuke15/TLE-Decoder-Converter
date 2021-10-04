/*
By: Brendan Luke
Date: October 4, 2021
Scope: create chart.js plot from TLE data
*/

function createChart(outData) { // this is called after the TLE decoded data is written to a file and downloading
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: outData.epoch,
            datasets: [{
                //label: 'Semi-Major Axis Height (km)',
                data: outData.SemiMajorAxisH,//Object.values(smaH),
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
                    //type: 'timeseries',
                }
            }
        },
        plugins: [plugin],
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
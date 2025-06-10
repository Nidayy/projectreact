import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function LineChart({ data }) {
  const chartRef = useRef(null); 
  const chartInstanceRef = useRef(null); 

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current?.getContext('2d');
    if (ctx) {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar', 
        data: {
          labels: data.labels,
          datasets: data.datasets,
        },
        options:
        {
          scales: {
            scale1: {
              type: 'linear',
              position: 'left',
              title: {
                display: true,
                text: 'Bin Frequency',
              },
              stacked: true 
            },
            scale2: {
              type: 'linear',
              position: 'right',
              title: {
                display: true,
                text: 'WOE',
              },
              stacked: false 
            },
          },
          plugins: {
            title: {
              display: true,
              text: data.title ,  
              font: {
                size: 16
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.dataset.label || '';
                  const datasets = context.chart.data.datasets;
                  const index = context.dataIndex;
          
                  const totalValue = datasets.reduce((sum, ds) => 
                    (ds.label === 'Event' || ds.label === 'Non Event') ? sum + ds.data[index] : sum, 0);
          
                  const value = context.raw;
          
                  if (label === 'Event' || label === 'Non Event') {
                    return `${label}: ${(value / totalValue * 100).toFixed(2)}%`;
                  }
                  return `${label}: ${value}`;
                },
              },
            },
          },
          
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]); 

  const downloadChart = () => {
    if (chartInstanceRef.current) {
      const link = document.createElement('a');
      link.href = chartInstanceRef.current.toBase64Image();
      link.download = 'chart.png';
      link.click();
    }
  };

  return (
    <div> 
      <canvas ref={chartRef} width="400" height="200" />
      <button 
        onClick={downloadChart} style={{
          backgroundColor: '#4CAF50',  
          color: 'white',              
          padding: '10px 15px',        
          border: 'none',              
          borderRadius: '15px',         
          margin : 5          
        }}
      >Download Chart</button>
    </div>
  );
}

export default LineChart;

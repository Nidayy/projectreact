import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const SimpleHeatMapApex = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'heatmap',
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              {
                from: -Infinity,
                to: 0,
                color: '#ff0000', // Kırmızı (negatif korelasyonlar)
                name: 'Negative values',
              },
              {
                from: 0,
                to: 10,
                color: '#339900', // Çok koyu yeşil
                name: '0% - 10%',
              },
              {
                from: 10,
                to: 20,
                color: '#339933', // Koyu yeşil
                name: '10% - 20%',
              },
              {
                from: 20,
                to: 30,
                color: '#339966', // Yeşil
                name: '20% - 30%',
              },
              {
                from: 30,
                to: 40,
                color: '#339999', // Açık yeşil
                name: '30% - 40%',
              },
              {
                from: 40,
                to: 50,
                color: '#3399CC', // Sarı
                name: '40% - 50%',
              },
              {
                from: 50,
                to: 60,
                color: '#3399FF', // Altın sarısı
                name: '50% - 60%',
              },
              {
                from: 60,
                to: 70,
                color: '#33CC00', // Turuncu
                name: '60% - 70%',
              },
              {
                from: 70,
                to: 80,
                color: '#33CC33', // Koyu turuncu
                name: '70% - 80%',
              },
              {
                from: 80,
                to: 90,
                color: '#33CC66', // Koyu turuncu-kırmızı
                name: '80% - 90%',
              },
              {
                from: 90,
                to: 100,
                color: '#33CC99', // Kırmızı
                name: '90% - 100%',
              },
            ],
          },
        },
      },
      xaxis: {
        position: 'top',
        categories: [],
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val === 1 ? '1' : `${val}%`, 
        style: {
          colors: ['#fff'],
        },
      },
      title: {
        text: '2D HeatMap with Percentage Values',
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/getdata');
        const data = response.data;

    
        const allLabels = [...new Set([...data.map(item => item.column_1), ...data.map(item => item.column_2)])];

        
        const matrix = allLabels.map(yLabel => 
          allLabels.map(xLabel => {
            if (xLabel === 'Age' && yLabel === 'Age') {
              return 1; 
            }
            const foundItem = data.find(item => 
              (item.column_1 === xLabel && item.column_2 === yLabel) ||
              (item.column_1 === yLabel && item.column_2 === xLabel)
            );
            const correlation = foundItem ? foundItem.correlation : 0;
            return correlation === 0 ? 1 : (correlation * 100).toFixed(1); // 
          })
        );

   
        const seriesData = allLabels.map((label, i) => ({
          name: label,
          data: matrix[i],
        }));

        setChartData(prevChartData => ({
          ...prevChartData,
          series: seriesData,
          options: {
            ...prevChartData.options,
            xaxis: {
              ...prevChartData.options.xaxis,
              categories: allLabels,
            },
          },
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="heatmap"
        height="900"
        width="900"
      />
    </div>
  );
};

export default SimpleHeatMapApex;

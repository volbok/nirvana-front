/* eslint eqeqeq: "off" */
import React, { useEffect, useContext } from 'react';
import Context from '../pages/Context';
import ApexCharts from 'apexcharts'

function Chart(type, status, cor, arraydados, arraydatas, title, width) {

  const {
    pagina,
  } = useContext(Context);

  var opt_null = {
    dataLabels: {
      enabled: true,
      enabledOnSeries: undefined,
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: ['#000000']
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9,
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45
        }
      },
      dropShadow: {
        enabled: false,
        top: 1,
        left: 1,
        blur: 1,
        color: '#000',
        opacity: 0.45
      }
    },
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
      },
    },
    chart: {
      type: type,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    legend: { show: false },
    series: [
      {
        name: status,
        data: []
      }
    ],
    xaxis: {
      categories: [],
      labels: { show: true },
    },
    yaxis: {
      labels: { show: false },
    }
  }

  var opt_bar = {
    dataLabels: {
      enabled: true,
      enabledOnSeries: undefined,
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: ['#000000']
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9,
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45
        }
      },
      dropShadow: {
        enabled: false,
      }
    },
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
      },
    },
    chart: {
      type: 'bar',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [cor],
    series: [
      {
        name: status,
        data: arraydados
      }
    ],
    xaxis: {
      categories: arraydatas,
      labels: { show: true },
    },
    yaxis: {
      labels: { show: false },
    }
  }

  var opt_line = {
    dataLabels: {
      enabled: true,
      enabledOnSeries: undefined,
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: -5,
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: ['#000000']
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9,
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45
        }
      },
      dropShadow: {
        enabled: false,
      }
    },
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
      },
    },
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: cor,
    legend: {
      show: true,
      showForSingleSeries: false,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: 'top',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 400,
      formatter: undefined,
      inverseOrder: false,
      width: undefined,
      height: undefined,
      tooltipHoverFormatter: undefined,
      customLegendItems: [],
      offsetX: 0,
      offsetY: 0,
      labels: {
        colors: undefined,
        useSeriesColors: false
      },
      markers: {
        size: 7,
        shape: undefined,
        strokeWidth: 1,
        fillColors: undefined,
        customHTML: undefined,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 5,
        vertical: 0
      },
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      },
    },
    series: arraydados,
    xaxis: {
      categories: arraydatas,
      labels: { show: true },
    },
    yaxis: {
      labels: { show: false },
    }
  }

  var opt_donut = {
    chart: {
      type: 'donut',
    },
    colors: cor,
    series: arraydados,
    labels: arraydatas,
    legend: {
      height: 300,
      // offsetY: 35,
      formatter: function (seriesName, opt) {
        return (
          seriesName + ': ' + opt.w.config.series[opt.seriesIndex]
        )
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return (
          opt.w.config.series[opt.seriesIndex] +
          ' (' + Math.ceil(val) + "%)"
        )
      },
      enabledOnSeries: undefined,
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        colors: ['#000000']
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9,
      },
    },
    plotOptions: {
      pie: {
        customScale: 0.7,
        expandOnClick: false,
        donut: {
          size: '60%'
        }
      },
    },
  }

  useEffect(() => {
    if (pagina == 'DASHBOARD') {
      let options = null;
      if (type == 'bar') {
        options = opt_bar;
      } else if (type == 'donut') {
        options = opt_donut;
      } else if (type == 'line') {
        options = opt_line;
      }
      let chart = null;
      chart = new ApexCharts(document.getElementById('chart ' + status), opt_null);
      chart.render();
      chart.destroy();
      setTimeout(() => {
        if (arraydados.length > 0) {
          chart.destroy();
          chart = new ApexCharts(document.getElementById('chart ' + status), options)
          chart.render();
        }
      }, 1000);
    }
  }, [pagina, arraydatas, arraydados]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column', justifyContent: 'center',
        alignContent: 'center', alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        margin: 10,
        backgroundColor: 'white',
        width: width,
        alignSelf: 'center',
        position: 'relative',
        verticalAlign: 'center',
      }}>
      <div className='text1'
        style={{
          display: title == 1 ? 'flex' : 'none',
          top: 10
        }}>
        {status}
      </div>
      <div style={{ width: width, height: 9 * width / 16, alignSelf: 'center' }} id={'chart ' + status}></div>
    </div>
  );
}

export default Chart;

<template>
  <div class="widget has-text-white weather is-relative">
    <div class="blur-background"></div>

    <div class="widget-content">
      <!-- Header Start -->
      <div class="widget-header is-flex mr-0">
        <div class="widget-title is-flex-grow-1">
          Weather
        </div>
        <div class="is-flex-shrink-0">
          <b-dropdown v-model="selectedCityIndex" :mobile-modal="false" animation="fade1"
            aria-role="list" class="weather-dropdown" position="is-bottom-left">
            <template #trigger="{ active }">
              <b-button :icon-right="active ? 'up-outline' : 'down-outline'"
                :label="cities[selectedCityIndex]" icon-pack="casa" type="is-primary" />
            </template>
            <b-dropdown-item v-for="(city, index) in cities" :key="'city' + index" :value="index"
              aria-role="listitem">
              {{ city }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <!-- Header End -->

      <!-- Main Weather Info -->
      <div class="weather-main is-flex is-align-items-center mb-3">
        <div class="weather-temp is-flex-grow-1">
          <div class="temp-value">{{ weather.temp }}°C</div>
          <div class="weather-desc">{{ weather.desc }}</div>
        </div>
        <div class="weather-icon">
          <div class="icon-placeholder">🌤️</div>
        </div>
      </div>

      <!-- Chart Start -->
      <div class="chart-container">
        <canvas ref="chart"></canvas>
      </div>
      <!-- Chart End -->

      <!-- Status Start -->
      <div class="is-flex weather-stats">
        <div class="is-flex-shrink-0 is-size-65 is-flex is-align-items-center has-text-grey-100">
          <div class="stats-grid">
            <span class="stat-item">
              <span class="stat-icon">🌡️</span>
              {{ weather.feels_like }}°C
            </span>
            <span class="stat-item ml-3">
              <span class="stat-icon">💧</span>
              {{ weather.humidity }}%
            </span>
            <span class="stat-item ml-3">
              <span class="stat-icon">💨</span>
              {{ weather.wind }} km/h
            </span>
          </div>
        </div>
      </div>
      <!-- Status End -->
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js"

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale)

export default {
  name: "Weather",
  icon: "weather-outline",
  title: "Weather",
  initShow: true,
  data() {
    return {
      apiKey: "cea8e9e3b0f5ba0f8738baa15e170ff3",
      selectedCityIndex: 0,
      cities: ["Baghdad", "London", "New York", "Tokyo", "Sydney", "Paris", "Berlin", "Moscow", "Dubai", "Singapore","Mumbai","Duhok","Erbil","Basra","Najaf"],
      weather: {
        temp: "--",
        desc: "--",
        feels_like: "--",
        humidity: "--",
        wind: "--"
      },
      chart: null
    }
  },
  computed: {
    selectedCity() {
      return this.cities[this.selectedCityIndex]
    }
  },
  watch: {
    selectedCityIndex(val, oldVal) {
      if (val !== oldVal) {
        localStorage.setItem('selectedCityIndex', val)
        this.fetchWeather()
      }
    }
  },
  mounted() {
    // Load saved city selection
    const savedIndex = localStorage.getItem('selectedCityIndex')
    if (savedIndex) {
      this.selectedCityIndex = parseInt(savedIndex)
    }
    this.fetchWeather()
  },
  methods: {
    async fetchWeather() {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.selectedCity}&appid=${this.apiKey}&units=metric`
        const res = await axios.get(url)

        // Current weather
        const current = res.data.list[0].main
        this.weather.temp = Math.round(current.temp)
        this.weather.feels_like = Math.round(current.feels_like)
        this.weather.humidity = current.humidity
        this.weather.desc = res.data.list[0].weather[0].description
        this.weather.wind = Math.round(res.data.list[0].wind.speed * 3.6) // Convert m/s to km/h

        // Forecast chart (next 8 entries, every 3 hours)
        const labels = res.data.list.slice(0, 8).map((item) =>
          new Date(item.dt_txt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        )
        const temps = res.data.list.slice(0, 8).map((item) => Math.round(item.main.temp))

        this.renderChart(labels, temps)
      } catch (e) {
        console.error("Weather fetch failed:", e)
      }
    },
    renderChart(labels, temps) {
      if (this.chart) this.chart.destroy()
      
      this.chart = new Chart(this.$refs.chart, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Temperature",
              data: temps,
              borderColor: "rgb(0, 143, 251)",
              backgroundColor: "rgba(0, 143, 251, 0.1)",
              tension: 0.4,
              fill: true,
              pointRadius: 0,
              pointHoverRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false },
            tooltip: { enabled: true }
          },
          scales: {
            x: { 
              ticks: { 
                color: "#ffffff",
                fontSize: 10
              },
              grid: { 
                display: false 
              },
              border: {
                display: false
              }
            },
            y: { 
              ticks: { 
                color: "#ffffff",
                fontSize: 10
              },
              grid: { 
                color: "rgba(255, 255, 255, 0.1)"
              },
              border: {
                display: false
              }
            }
          },
          elements: {
            point: {
              radius: 0
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.weather {
  position: relative;
  z-index: 10;
  
  .widget-content {
    padding: 16px;
  }

  .weather-main {
    .temp-value {
      font-size: 2rem;
      font-weight: bold;
      line-height: 1;
    }
    
    .weather-desc {
      font-size: 0.875rem;
      color: #ccc;
      text-transform: capitalize;
      margin-top: 4px;
    }

    .weather-icon {
      .icon-placeholder {
        font-size: 2.5rem;
      }
    }
  }

  .chart-container {
    height: 130px;
    overflow: hidden;
    margin: 16px -0.875rem 16px -0.875rem;
  }

  .weather-stats {
    .stats-grid {
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      
      .stat-item {
        display: flex;
        align-items: center;
        color: #f0f0f0;
        
        .stat-icon {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.weather {
  .weather-dropdown {
    .button {
      margin: 0;
      padding: 0;
      height: initial;
      background-color: transparent;
      font-weight: bold;
      font-size: 0.875rem;
      position: relative;
      z-index: 200;
      outline: none;
      border: 0;
      color: #f0f0f0;

      &:focus:not(:active) {
        box-shadow: 0 0 0 0 !important;
      }

      &:hover,
      &:active {
        outline: none;
        background-color: transparent;
      }

      span {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        max-width: 5rem;
      }

      .icon {
        font-size: 1.25rem !important;
        height: 1.5rem;
        line-height: 1.5rem;
        color: #f0f0f0;

        &:last-child:not(:first-child) {
          margin-right: 0;
        }
      }
    }

    .dropdown-menu {
      min-width: 5rem;

      .dropdown-content {
        max-width: 7rem;
        border-radius: 10px;
        padding: 4px !important;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(1rem);

        .dropdown-divider {
          margin: 4px;
        }

        .dropdown-item {
          padding: 0.25rem 0.5rem 0.25rem 0.5rem;
          border-radius: 5px;
          transition: all 0.25s;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #fff;
          font-size: 0.75rem;
          margin-bottom: 0.25rem;

          &:last-child {
            margin-bottom: 0;
          }

          &:hover {
            background: rgba(0, 0, 0, 0.2) !important;
          }

          &.is-active {
            background: rgba(0, 0, 0, 0.2) !important;
          }
        }
      }
    }
  }
}
</style>
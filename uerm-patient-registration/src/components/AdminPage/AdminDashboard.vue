<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-4 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div
                class="text-h4 text-weight-bolder"
                :class="{
                  'text-h5': !$q.screen.lt.md,
                  'text-h5': $q.screen.lt.md,
                }"
              >
                <q-spinner v-if="loading" color="white" size="0.8em" />
                <span v-else>{{ inpatientCount }}</span>
              </div>

              <div
                class="text-subtitle2"
                :class="{
                  'text-subtitle2': !$q.screen.lt.md,
                  'text-caption': $q.screen.lt.md,
                }"
              >
                ADMISSION
              </div>
            </q-card-section>

            <q-card-section class="col-auto flex flex-center">
              <q-icon
                name="groups"
                class="opacity-50"
                :size="$q.screen.lt.md ? '40px' : '50px'"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div
                class="text-h4 text-weight-bolder"
                :class="{
                  'text-h5': !$q.screen.lt.md,
                  'text-h5': $q.screen.lt.md,
                }"
              >
                <q-spinner v-if="loading" color="white" size="0.8em" />
                <span v-else>{{ outpatientCount }}</span>
              </div>

              <div
                class="text-subtitle2"
                :class="{
                  'text-subtitle2': !$q.screen.lt.md,
                  'text-caption': $q.screen.lt.md,
                }"
              >
                OPD
              </div>
            </q-card-section>

            <q-card-section class="col-auto flex flex-center">
              <q-icon
                name="groups"
                class="opacity-50"
                :size="$q.screen.lt.md ? '40px' : '50px'"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div
                class="text-h4 text-weight-bolder"
                :class="{
                  'text-h5': !$q.screen.gt.md,
                  'text-h5': $q.screen.lt.md,
                }"
              >
                <q-spinner v-if="loading" color="white" size="0.8em" />
                <span v-else>{{ erpatientCount }}</span>
              </div>

              <div
                class="text-subtitle2"
                :class="{
                  'text-subtitle2': !$q.screen.lt.md,
                  'text-caption': $q.screen.lt.md,
                }"
              >
                ER
              </div>
            </q-card-section>

            <q-card-section class="col-auto flex flex-center">
              <q-icon
                name="groups"
                class="opacity-50"
                :size="$q.screen.lt.md ? '40px' : '50px'"
              />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-7">
        <q-card
          class="fit no-shadow bg-white"
          style="border: 1px solid #e0e0e0; border-radius: 8px"
        >
          <q-card-section
            class="bg-grey-3 q-py-sm"
            style="border-bottom: 1px solid #e0e0e0"
          >
            <div
              class="text-subtitle2 text-weight-bold text-center text-uppercase text-blue-grey-9"
            >
              Monthly Registration Trends
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row justify-center">
              <div class="col-12 text-grey">
                <apexchart
                  width="100%"
                  height="350"
                  type="line"
                  :options="chartOptions"
                  :series="series"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-5">
        <q-card
          class="fit no-shadow bg-white"
          style="border: 1px solid #e0e0e0; border-radius: 8px"
        >
          <q-card-section
            class="bg-grey-3 q-py-sm"
            style="border-bottom: 1px solid #e0e0e0"
          >
            <div
              class="text-subtitle2 text-weight-bold text-center text-uppercase text-blue-grey-9"
            >
              By Patient Type
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row justify-center">
              <div class="col-12 text-grey">
                <apexchart
                  width="100%"
                  height="320"
                  type="donut"
                  :options="chartOptionsPie"
                  :series="seriesPie"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card
      class="no-shadow bg-white"
      style="border: 1px solid #e0e0e0; border-radius: 8px"
    >
      <q-card-section
        class="row items-center bg-grey-3 q-py-sm"
        style="border-bottom: 1px solid #e0e0e0"
      >
        <div
          class="text-subtitle2 text-center text-weight-bold text-uppercase text-blue-grey-9"
        >
          Real-time Admissions
        </div>

        <q-space />
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="patientList"
          :columns="columns"
          row-key="PATIENTNO"
          :loading="loading"
          flat
          bordered
          class="clean-table"
          table-header-class="bg-blue-9 text-white text-weight-bold text-uppercase"
        >
          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium text-uppercase">
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              <q-badge
                class="text-weight-bold text-uppercase q-py-sm flex flex-center"
                style="width: 95px"
                :color="
                  props.value === 'EMERGENCY'
                    ? 'red'
                    : props.value === 'INPATIENT'
                    ? 'green'
                    : 'blue'
                "
              >
                {{ props.value }}
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { date } from "quasar";
import axios from "axios";

export default {
  name: "DashboardPage",
  data() {
    return {
      patientList: [],
      loading: false,
      inpatientCount: 0,
      outpatientCount: 0,
      erpatientCount: 0,

      columns: [
        {
          name: "PATIENTNO",
          label: "PATIENTNO",
          field: "PATIENTNO",
          align: "center",
          sortable: true,
          format: (val) => val || "N/A",
        },
        {
          name: "fullName",
          label: "Name",
          field: "fullName",
          align: "center",
          sortable: true,
        },
        {
          name: "type",
          label: "Type",
          field: "PATIENTTYPE",
          align: "center",
        },
        {
          name: "createdAt",
          label: "Date Added",
          field: "createdAt",
          align: "center",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
        },
      ],

      series: [],
      chartOptions: {
        chart: { id: "weekly-trend" },
        xaxis: {
          categories: [],
          labels: {
            formatter: function (value) {
              const date = new Date(value + "-01");
              return date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
            },
          },
        },
        colors: ["#1976D2", "#26A69A", "#9C27B0"],
      },

      seriesPie: [],
      chartOptionsPie: {
        chart: {
          id: "patient-type-pie",
        },
        labels: [],
        colors: ["#1976D2", "#26A69A", "#9C27B0"],
        legend: {
          position: "bottom",
        },
        noData: {
          text: "Loading...",
        },
      },
    };
  },
  mounted() {
    this.loadPieData();
    this.loadTrendData();
    this.loadInitialData();
  },
  methods: {
    async loadPieData() {
      try {
        const response = await this.$axios.get(
          "http://10.107.0.2:3000/api/dashboard/pie-chart"
        );

        this.seriesPie = response.data.series;

        this.chartOptionsPie = {
          ...this.chartOptionsPie,
          labels: response.data.labels,
        };
      } catch (error) {
        console.error("Chart Load Error:", error);
      }
    },

    async loadTrendData() {
      try {
        const response = await this.$axios.get(
          "http://10.107.0.2:3000/api/dashboard/line-chart"
        );

        this.chartOptions = {
          ...this.chartOptions,
          xaxis: {
            ...this.chartOptions.xaxis,
            categories: response.data.categories,
          },
        };

        this.series = response.data.series;
      } catch (error) {
        console.error("Error loading trends:", error);
      }
    },
    async loadInitialData() {
      this.loading = true;
      try {
        const response = await axios.get("http://10.107.0.2:3000/api/patients/");
        this.patientList = response.data;
        const inpatients = this.patientList.filter((p) => p.PATIENTTYPE === "INPATIENT");
        const outpatients = this.patientList.filter(
          (p) => p.PATIENTTYPE === "OUTPATIENT"
        );
        const erpatients = this.patientList.filter((p) => p.PATIENTTYPE === "EMERGENCY");

        this.inpatientCount = inpatients.length;
        this.outpatientCount = outpatients.length;
        this.erpatientCount = erpatients.length;
      } catch (error) {
        console.error(error);
        this.$q.notify({
          type: "negative",
          message: "Failed to load Patients",
          position: "top",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>

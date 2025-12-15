<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-h4 text-weight-bolder">213</div>
              <div class="text-subtitle2">Admitted</div>
            </q-card-section>
            <q-card-section class="col-auto flex flex-center">
              <q-icon name="groups" size="50px" class="opacity-50" />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-h4 text-weight-bolder">86</div>
              <div class="text-subtitle2">OPD</div>
            </q-card-section>
            <q-card-section class="col-auto flex flex-center">
              <q-icon name="groups" size="50px" class="opacity-50" />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card class="text-white bg-blue-9">
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-h4 text-weight-bolder">172</div>
              <div class="text-subtitle2">ER</div>
            </q-card-section>
            <q-card-section class="col-auto flex flex-center">
              <q-icon name="groups" size="50px" class="opacity-50" />
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-7">
        <q-card class="fit">
          <q-card-section>
            <div class="text-h7 text-weight-bold text-center text-uppercase">
              Monthly Registration Trends
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-12 col-md-12 text-grey">
                <apexchart
                  width="100%"
                  height="350"
                  type="line"
                  :options="chartOptions"
                  :series="series"
                ></apexchart>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-5">
        <q-card class="fit">
          <q-card-section>
            <div class="text-h7 text-weight-bold text-center text-uppercase">
              By Patient Type
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-12 col-md-12 text-grey">
                <apexchart
                  width="100%"
                  height="320"
                  type="pie"
                  :options="chartOptionsPie"
                  :series="seriesPie"
                ></apexchart>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-card class="no-shadow" style="border: 1px solid #f0f0f0">
      <q-card-section class="row items-center q-pb-none q-mb-md">
        <!-- <div class="text-h6 text-weight-bold">Real-time Admissions</div> -->
        <div class="text-h7 text-weight-bold text-center text-uppercase">
          Real-time Admissions
        </div>
        <q-space />
        <q-btn
          icon="file_download"
          flat
          round
          dense
          color="grey-7"
          tooltip="Export CSV"
        />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-table
          :rows="patientList"
          :columns="columns"
          row-key="patient_id"
          :loading="loading"
          flat
          :rows-per-page-options="[5, 10]"
          class="clean-table"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
        >
          <template v-slot:body-cell-patient_id="props">
            <q-td :props="props">
              <span class="text-grey-8">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              <q-badge
                rounded
                class="q-px-sm q-py-xs"
                :color="
                  props.row.patientType === 'Emergency' || props.row.patientType === 'ER'
                    ? 'red-1'
                    : props.row.patientType === 'Inpatient'
                    ? 'green-1'
                    : 'blue-1'
                "
                :text-color="
                  props.row.patientType === 'Emergency' || props.row.patientType === 'ER'
                    ? 'red-9'
                    : props.row.patientType === 'Inpatient'
                    ? 'green-9'
                    : 'blue-9'
                "
                :label="props.row.patientType"
              />
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
      columns: [
        {
          name: "patient_id",
          label: "Patient ID",
          field: "patient_id",
          align: "center",
          sortable: true,
          style: "width: 100px",
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
          field: "patientType",
          align: "center",
        },
        {
          name: "createdAt",
          label: "Date",
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
          "http://localhost:3000/api/auth/fetchPieChartData"
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
          "http://localhost:3000/api/auth/fetchLineChartData"
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
        const response = await axios.get(
          "http://localhost:3000/api/auth/fetchAllPatient"
        );
        this.patientList = response.data;
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

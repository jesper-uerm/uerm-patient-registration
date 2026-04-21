<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-6 col-md-6">
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
                <span v-else>{{ forAdmissionCount }}</span>
              </div>
              <div
                class="text-subtitle2"
                :class="{
                  'text-subtitle2': !$q.screen.lt.md,
                  'text-caption': $q.screen.lt.md,
                }"
              >
                FOR ADMISSION
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

      <div class="col-6 col-md-6">
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
                IN ER
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
                  type="area"
                  :options="computedLineOptions"
                  :series="erLineSeries"
                ></apexchart>
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
              By Payment Type
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-12 text-grey">
                <apexchart
                  width="100%"
                  height="320"
                  type="donut"
                  :options="computedPieOptions"
                  :series="pieSeries"
                ></apexchart>
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
          row-key="patient_id"
          :loading="loading"
          flat
          bordered
          class="clean-table"
          table-header-class="bg-blue-9 text-white text-weight-bold text-uppercase"
        >
          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium text-uppercase">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-paymentType="props">
            <q-td :props="props">
              <div class="text-uppercase">
                {{ props.value }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-priority="props">
            <q-td :props="props" class="text-center">
              <q-badge
                class="text-weight-bold text-uppercase q-py-sm flex flex-center"
                style="width: 95px"
                :color="
                  props.value && props.value.toLowerCase() === 'high'
                    ? 'red'
                    : props.value && props.value.toLowerCase() === 'medium'
                    ? 'orange'
                    : props.value && props.value.toLowerCase() === 'low'
                    ? 'green'
                    : 'grey'
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
import { defineComponent } from "vue";
// import { date } from "quasar";
import { mapState, mapActions } from "pinia";
import { useTriageStore } from "src/stores/triageStore";

export default defineComponent({
  name: "DashboardPage",

  data() {
    return {
      // columns: [
      //   {
      //     name: "fullName",
      //     label: "Name",
      //     field: "fullName",
      //     align: "center",
      //     sortable: true,
      //   },
      //   { name: "type", label: "Type", field: "patientType", align: "center" },
      //   {
      //     name: "CREATEDAT",
      //     label: "Date",
      //     field: "CREATEDAT",
      //     align: "center",
      //     format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
      //   },
      // ],

      columns: [
        {
          name: "fullName",
          label: "Full Name",
          field: "fullName",
          align: "center",
          sortable: true,
        },
        {
          name: "patientNo",
          label: "Patient No.",
          field: "PATIENTNO",
          align: "center",
          sortable: true,
        },
        {
          name: "paymentType",
          label: "Payment Type",
          field: "paymentType",
          align: "center",
        },
        {
          name: "priority",
          label: "Priority",
          field: "priority",
          align: "center",
        },
        {
          name: "waitTime",
          label: "Wait Time",
          field: "waitTime",
          align: "center",
        },
      ],

      baseChartOptions: {
        chart: { id: "weekly-trend" },
        colors: ["#1976D2", "#26A69A", "#9C27B0"],
        xaxis: {
          labels: {
            formatter: (val) => {
              const d = new Date(val + "-01");
              return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
            },
          },
        },
      },
      basePieOptions: {
        chart: { type: "donut", id: "patient-type-pie" },
        colors: ["#FF9800", "#1976D2", "#4CAF50"],
        legend: { position: "bottom" },
      },
    };
  },

  computed: {
    ...mapState(useTriageStore, [
      "patientList",
      "loading",
      "forAdmissionCount",
      "erpatientCount",
      "pieSeries",
      "pieLabels",
      "lineSeries",
      "lineCategories",
    ]),

    computedLineOptions() {
      return {
        ...this.baseChartOptions,
        colors: ["#1976D2"],
        xaxis: { ...this.baseChartOptions.xaxis, categories: this.lineCategories },
      };
    },

    erLineSeries() {
      if (!this.lineSeries) return [];

      return this.lineSeries.filter((series) => series.name === "ER");
    },

    computedPieOptions() {
      return {
        ...this.basePieOptions,
        labels: this.pieLabels,
      };
    },
  },

  mounted() {
    this.fetchDashboardDataER().catch(() => {
      this.$q.notify({ type: "negative", message: "Failed to load Dashboard data" });
    });
  },

  methods: {
    ...mapActions(useTriageStore, ["fetchDashboardDataER"]),
  },
});
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>

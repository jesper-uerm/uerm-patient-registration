<template>
  <q-page class="q-pa-lg bg-grey-2">
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
                  :series="lineSeries"
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
        <q-btn icon="file_download" flat round dense color="grey-7">
          <q-tooltip>Export CSV</q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="patientList"
          :columns="columns"
          row-key="ID"
          :loading="loading"
          flat
          bordered
          :rows-per-page-options="[5, 10]"
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
import { date } from "quasar";
import { mapState, mapActions } from "pinia";
import { useFinanceStore } from "src/stores/financeStore";

export default defineComponent({
  name: "DashboardPage",

  data() {
    return {
      columns: [
        {
          name: "caseno",
          label: "CASE NO",
          field: "CASENO",
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
        { name: "type", label: "Type", field: "patientType", align: "center" },
        {
          name: "DATEAD",
          label: "Date Admitted",
          field: "DATEAD",
          align: "center",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
        },
      ],

      baseChartOptions: {
        chart: { id: "weekly-trend" },
        colors: ["#1976D2", "#26A69A", "#9C27B0"],
        xaxis: {
          labels: {
            formatter: (val) => {
              if (!val) return "";
              const d = new Date(val + "-01");
              return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
            },
          },
        },
      },

      basePieOptions: {
        chart: { type: "donut", id: "patient-type-pie" },
        colors: ["#1976D2", "#26A69A", "#9C27B0"],
        legend: { position: "bottom" },
        noData: { text: "Loading..." },
      },
    };
  },

  computed: {
    ...mapState(useFinanceStore, [
      "patientList",
      "loading",
      // "approvedCount",
      // "declinedCount",
      "pieSeries",
      "pieLabels",
      "lineSeries",
      "lineCategories",
    ]),

    computedLineOptions() {
      return {
        ...this.baseChartOptions,
        xaxis: { ...this.baseChartOptions.xaxis, categories: this.lineCategories },
      };
    },

    computedPieOptions() {
      return {
        ...this.basePieOptions,
        labels: this.pieLabels,
      };
    },
  },

  mounted() {
    this.fetchFinanceDashboardData().catch(() => {
      this.$q.notify({
        type: "negative",
        message: "Failed to load Dashboard data",
        position: "top",
      });
    });
  },

  methods: {
    ...mapActions(useFinanceStore, ["fetchFinanceDashboardData"]),
  },
});
</script>

<style scoped>
.opacity-50 {
  opacity: 0.5;
}
</style>

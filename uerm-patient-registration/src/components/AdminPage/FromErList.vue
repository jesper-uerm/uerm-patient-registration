<template>
  <q-page class="q-pa-md bg-grey-4 q-py-xl">
    <q-card class="no-shadow" style="border: 1px solid #e0e0e0; border-radius: 8px">
      <q-card-section class="q-py-md q-px-lg" style="background-color: #004aad">
        <div class="text-h6 text-white text-weight-bold">FROM EMERGENCY ROOM</div>
        <div class="text-caption text-grey-5">Search emergency room records</div>
      </q-card-section>

      <q-card-section class="q-py-md q-px-lg bg-grey-1">
        <q-input
          outlined
          dense
          v-model="searchQuery"
          placeholder="Enter Name or ID"
          @keyup.enter="handleSearch"
          debounce="500"
          @update:model-value="handleSearch"
          :disable="loading"
          class="bg-white"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="text-grey-5" />
          </template>

          <template v-slot:after>
            <q-btn
              unelevated
              color="yellow-10"
              label="Search"
              class="q-px-lg"
              @click="handleSearch"
              :loading="loading"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-pa-none q-mx-lg q-mb-md">
        <q-table
          bordered
          :rows="patientListfromER"
          :columns="columns"
          row-key="PATIENTNO"
          :loading="loading"
          :filter="searchQuery"
          flat
          virtual-scroll
          :rows-per-page-options="[10]"
          class="clean-table fit"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
        >
          <template v-slot:body-cell-CASENO="props">
            <q-td :props="props">
              <span class="text-weight-bold text-grey-8">
                {{ props.value || "N/A" }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium">
                {{ props.value }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-addressPresent="props">
            <q-td :props="props" style="max-width: 200px">
              <div class="ellipsis text-grey-7">
                {{ props.row.addressPresent }}
                <q-tooltip>{{ props.row.addressPresent }}</q-tooltip>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-ISRETURNING="props">
            <q-td :props="props">
              <q-badge
                v-if="props.value"
                color="blue-grey-6"
                label="Returning Patient"
                outline
              />
              <q-badge v-else color="blue-6" label="New Patient" outline />
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                v-if="props.value == 1"
                color="green-7"
                label="Approved by Credit and Finance"
                outline
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round color="grey-7" icon="more_vert">
                <q-menu cover auto-close>
                  <q-list style="min-width: 150px">
                    <q-item clickable>
                      <q-item-section avatar>
                        <q-icon name="las la-print" color="green-8" />
                      </q-item-section>
                      <q-item-section>Print Record</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing>
              <q-spinner-gears size="50px" color="blue-10" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width column flex-center text-grey-5 q-pa-xl">
              <q-icon size="4em" name="person_search" class="q-mb-md" />
              <div class="text-subtitle1">
                {{
                  searchQuery
                    ? `No patients found matching "${searchQuery}"`
                    : "No ER patients found"
                }}
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <admitting-form ref="admittingFormRef" />
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapState, mapActions } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";
import AdmittingForm from "src/components/AdminPage/AdmittingForm.vue";

export default {
  name: "FromErList",
  components: { AdmittingForm },

  data() {
    return {
      searchQuery: "",
      columns: [
        {
          name: "PATIENTNO",
          label: "PATIENTNO",
          field: "PATIENTNO",
          align: "center",
          style: "font-weight: 600;",
          format: (val) => val || "N/A",
        },
        {
          name: "fullName",
          label: "NAME",
          field: "fullName",
          align: "center",
          sortable: true,
        },
        {
          name: "birthdate",
          label: "BIRTHDATE",
          field: "birthdateStr",
          format: (val) => this.formatDate(val),
          align: "center",
        },
        {
          name: "addressPresent",
          label: "ADDRESS",
          field: "addressPresent",
          align: "center",
        },
        {
          name: "ISRETURNING",
          label: "PATIENT TYPE",
          field: "ISRETURNING",
          align: "center",
          sortable: true,
        },
        {
          name: "status",
          label: "STATUS",
          field: "IS_APPROVED",
          align: "center",
          style: "width: 150px;",
          headerStyle: "width: 120px;",
        },
        {
          name: "actions",
          label: "Actions",
          field: "actions",
          align: "center",
          style: "width: 140px;",
          headerStyle: "width: 140px;",
        },
      ],
    };
  },

  computed: {
    ...mapState(useInpatientStore, ["patientListfromER", "loading"]),
  },

  mounted() {
    this.fetchFromErList();
  },

  methods: {
    ...mapActions(useInpatientStore, ["fetchFromErList", "searchErPatients"]),

    handleSearch() {
      if (!this.searchQuery) {
        this.fetchFromErList();
        return;
      }
      this.searchErPatients(this.searchQuery);
    },

    formatDate(val) {
      if (!val) return "-";
      return date.formatDate(val, "MMM D, YYYY");
    },
  },
};
</script>

<style scoped>
.clean-table :deep(.q-table__top),
.clean-table :deep(.q-table__bottom),
.clean-table :deep(thead tr:first-child th) {
  border-bottom: 1px solid #f0f0f0;
}

.clean-table :deep(thead tr th) {
  position: sticky;
  z-index: 1;
  background-color: #f8f9fa;
}

.clean-table :deep(tbody tr:hover) {
  background: #fafafa !important;
}

.clean-table :deep(td),
.clean-table :deep(th) {
  border-bottom: 1px solid #f5f5f5;
}
</style>

<template>
  <q-page class="q-pa-md bg-grey-4 q-py-xl">
    <q-card class="no-shadow" style="border: 1px solid #e0e0e0; border-radius: 8px">
      <q-card-section class="col-auto q-py-md q-px-lg" style="background-color: #004aad">
        <div class="row items-left text-left justify-left text-uppercase">
          <div>
            <div
              class="text-h6 text-white text-weight-bold"
              style="letter-spacing: -0.5px"
            >
              Inpatient Search
            </div>
            <div class="text-caption text-grey-5">
              Search database for admitted patient records
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="col-auto q-py-md q-px-lg bg-grey-1">
        <q-input
          outlined
          dense
          v-model="localSearchQuery"
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

      <q-card-section class="col q-pa-none q-mx-lg q-mb-md">
        <q-table
          bordered
          :rows="patientList"
          :columns="columns"
          row-key="PATIENTREGID"
          :loading="loading"
          flat
          virtual-scroll
          :rows-per-page-options="[10]"
          class="clean-table fit"
          header-class="bg-grey-1 text-grey-8 text-weight-bold text-uppercase"
        >
          <template v-slot:body-cell-PATIENTREGID="props">
            <q-td :props="props">
              <span class="text-grey-8">#{{ props.value }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-fullName="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.value }}</div>
            </q-td>
          </template>

          <template v-slot:body-cell-addressPresent="props">
            <q-td :props="props" style="max-width: 150px">
              <div class="ellipsis text-grey-7">
                {{ props.row.addressPresent }}
                <q-tooltip>{{ props.row.addressPresent }}</q-tooltip>
              </div>
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
              <q-badge
                v-else-if="props.value == 0"
                color="red-7"
                label="Disapproved by Credit and Finance"
                outline
              />

              <q-badge
                v-else-if="props.row.ISFORADMISSION == null"
                color="blue-grey-6"
                label="For Assessment in Credit"
                outline
              />

              <q-badge
                v-else
                color="orange-7"
                label="Pending for Approval in Credit"
                outline
              />
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

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round color="grey-7" icon="more_vert">
                <q-menu cover auto-close>
                  <q-list style="min-width: 150px">
                    <q-item
                      clickable
                      :disable="!props.row.PATIENTNO"
                      @click="viewPatient(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="las la-paper-plane" color="blue-10" />
                      </q-item-section>
                      <q-item-section>Send to Credit</q-item-section>

                      <q-tooltip
                        v-if="!props.row.PATIENTNO"
                        anchor="bottom middle"
                        self="bottom middle"
                        class="bg-red text-white"
                      >
                        PATIENTNO IS REQUIRED
                      </q-tooltip>
                    </q-item>
                    <q-item
                      clickable
                      :disable="props.row.ISVALIDATED == 1 || props.row.PATIENTNO != null"
                      @click="validatePatient(props.row)"
                    >
                      <q-item-section avatar>
                        <q-icon name="las la-clipboard-check" color="blue-10" />
                      </q-item-section>
                      <q-item-section>Create Patient Number</q-item-section>
                    </q-item>

                    <q-item clickable @click="handlePrint(props.row)">
                      <q-item-section avatar>
                        <q-icon name="las la-print" color="green-8" />
                      </q-item-section>
                      <q-item-section>Print Record</q-item-section>
                    </q-item>

                    <q-item clickable @click="handlePrintConsent(props.row)">
                      <q-item-section avatar>
                        <q-icon name="las la-file-download" color="green-8" />
                      </q-item-section>
                      <q-item-section>Download Consent</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
              <q-card flat bordered class="q-pa-sm">
                <q-item clickable v-ripple @click="viewPatient(props.row)">
                  <q-item-section avatar>
                    <q-icon name="account_circle" color="blue-10" size="md" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-blue-10">
                      {{ props.row.firstName }} {{ props.row.lastName }}
                    </q-item-label>
                    <q-item-label caption>ID: {{ props.row.PATIENTREGID }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn flat round color="grey-7" icon="more_vert" @click.stop>
                      <q-menu cover auto-close>
                        <q-list style="min-width: 150px">
                          <q-item clickable @click="validatePatient(props.row)">
                            <q-item-section avatar>
                              <q-icon name="check" size="xs" />
                            </q-item-section>
                            <q-item-section>Create Patient Number</q-item-section>
                          </q-item>

                          <q-item clickable @click="handlePrintConsent(props.row)">
                            <q-item-section avatar>
                              <q-icon name="download" size="xs" />
                            </q-item-section>
                            <q-item-section>Download Consent</q-item-section>
                          </q-item>

                          <q-item clickable @click="handlePrint(props.row)">
                            <q-item-section avatar>
                              <q-icon name="print" size="xs" />
                            </q-item-section>
                            <q-item-section>Print Information</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing>
              <q-spinner-gears size="50px" color="blue-10" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width column flex-center text-grey-5 q-pa-xl">
              <q-icon size="4em" name="person_search" class="q-mb-md" />
              <div class="text-subtitle1" v-if="!hasSearched">
                Ready to Search Inpatients
              </div>
              <div class="text-subtitle1" v-else>
                No patients found matching "{{ searchQuery }}"
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog
      v-model="viewDialog"
      backdrop-filter="blur(4px)"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 800px; max-width: 80vw" class="rounded-borders">
        <q-card-section class="bg-gradient-primary text-white q-pa-md relative-position">
          <div class="row justify-center items-center text-center">
            <div class="text-subtitle2 text-weight-bold text-uppercase">
              Patient Profile
            </div>
          </div>

          <q-btn
            icon="las la-times"
            flat
            round
            dense
            v-close-popup
            class="text-white opacity-70 absolute-top-right q-ma-sm"
            aria-label="Close"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg scroll" style="max-height: 60vh">
          <div class="text-subtitle2 text-grey-8 text-uppercase q-mb-sm">
            Personal Information
          </div>
          <q-list bordered separator class="rounded-borders">
            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="las la-user" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Full Name</q-item-label>
                <q-item-label class="text-caption1 text-weight-medium">
                  {{ selectedPatient.LASTNAME }}, {{ selectedPatient.FIRSTNAME }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="las la-venus-mars" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Gender</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.SEX }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="las la-birthday-cake" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Birthdate</q-item-label>
                <q-item-label class="text-caption1">
                  {{ formatDate(selectedPatient.BIRTHDATE) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Contact Information
          </div>
          <q-list bordered separator class="rounded-borders">
            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="las la-home" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Present Address</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.addressPresent || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="items-center">
              <q-item-section avatar>
                <q-icon name="las la-phone" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Mobile Number</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.MOBILE || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="q-pa-md bg-grey-1">
          <q-btn
            unelevated
            :label="
              selectedPatient.ISFORADMISSION
                ? 'Already Forwarded'
                : 'Forward to credit and finance'
            "
            :color="selectedPatient.ISFORADMISSION ? 'grey' : 'yellow-10'"
            :disable="selectedPatient.ISFORADMISSION"
            icon-right="las la-arrow-up"
            @click="handleSendToCredit(selectedPatient)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="viewPatientValidationDialog"
      transition-show="scale"
      transition-hide="scale"
      backdrop-filter="blur(4px)"
    >
      <q-card style="width: 800px; max-width: 80vw" class="rounded-borders">
        <q-card-section class="bg-gradient-primary text-white q-pa-md">
          <div class="row items-center justify-center text-center">
            <div class="text-subtitle2 text-weight-bold text-uppercase">
              Patient Information
            </div>
          </div>

          <q-btn
            icon="las la-times"
            flat
            round
            dense
            v-close-popup
            class="text-white opacity-70 absolute-top-right q-ma-sm"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg scroll q-px-xl" style="max-height: 70vh">
          <div class="text-subtitle2 text-grey-8 text-uppercase q-mb-sm">
            Personal Information
          </div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-user" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Full Name</q-item-label>
                <q-item-label class="text-caption1">
                  {{ formatFullName(selectedPatient) }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-birthday-cake" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Birthdate / Age</q-item-label>
                <q-item-label class="text-caption1">
                  {{ formatDate(selectedPatient.BIRTHDATE) }}
                  ({{ selectedPatient.AGE }} y/o)
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-venus-mars" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Gender</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.SEX || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Address Information
          </div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-home" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Street</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.ADDRESSSTREET || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-city" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Barangay / City</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.ADDRESSBARANGAY || "N/A" }},
                  {{ selectedPatient.ADDRESSCITY || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Government IDs
          </div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-id-card" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>PhilHealth</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.PHILHEALTHID || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-id-card" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Senior ID</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.SENIORID || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-id-card" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>PWD ID</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.PWDID || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Parent Details
          </div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-user" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Father's Name</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.FATHER || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-user" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Mother's Name</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.MOTHER || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            IN CASE OF EMERGENCY
          </div>

          <q-list bordered separator class="rounded-borders">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-user" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Name</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.CPNAME || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-heart" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Relationship</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.CPRELATIONSHIP || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-phone" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Contact</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.CPMOBILE || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-home" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>ADDRESS</q-item-label>
                <q-item-label class="text-caption1">
                  {{ selectedPatient.CPADDRESS || "N/A" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="center" class="q-pa-md bg-grey-1">
          <q-btn
            unelevated
            label="Generate Patient Number"
            color="yellow-10"
            icon-right="las la-share"
            @click="handleValidatePatient(selectedPatient)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="localShowDuplicateDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 700px; max-width: 80vw" class="rounded-borders">
        <q-card-section class="bg-gradient-primary text-white q-pa-md">
          <div class="row items-center justify-center text-center">
            <div class="text-subtitle2 text-weight-bold text-uppercase">
              <q-icon name="las la-exclamation-triangle" class="q-mr-xs" size="xs" />
              Possible Duplicate Found
            </div>
          </div>

          <q-btn
            icon="las la-times"
            flat
            round
            dense
            v-close-popup
            class="text-white opacity-70 absolute-top-right q-ma-sm"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-lg scroll q-px-xl" style="max-height: 70vh">
          <div class="text-caption text-grey-8 text-center q-mb-lg">
            We found existing records that match the details of the patient you are trying
            to register.
          </div>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mb-sm">
            Personal Information Entered
          </div>

          <q-list bordered separator class="rounded-borders q-mb-lg">
            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-user" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Full Name</q-item-label>
                <q-item-label class="text-caption1 text-bold">
                  {{ formatFullName(selectedPatient) }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="las la-birthday-cake" color="grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Birthdate</q-item-label>
                <q-item-label class="text-caption1 text-bold">
                  {{ formatDate(selectedPatient.BIRTHDATE) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="text-subtitle2 text-grey-8 text-uppercase q-mt-lg q-mb-sm">
            Matching Existing Records
          </div>
          <div class="text-caption text-grey-7 q-mb-sm">
            Select the patient you want to link.
          </div>

          <q-markup-table flat bordered>
            <thead class="bg-grey-2">
              <tr>
                <th class="text-left"></th>
                <th class="text-left">Patient No</th>
                <th class="text-left">Full Name</th>
                <th class="text-left">Birthdate</th>
                <th class="text-left">Age</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="patient in duplicateList"
                :key="patient.existingPatientNo"
                @click="localSelectedDuplicate = patient"
                class="cursor-pointer transition-generic"
                :class="
                  localSelectedDuplicate?.existingPatientNo === patient.existingPatientNo
                    ? 'bg-blue-1'
                    : 'hover:bg-grey-1'
                "
              >
                <td class="text-left">
                  <q-radio
                    v-model="localSelectedDuplicate"
                    :val="patient"
                    dense
                    color="primary"
                  />
                </td>
                <td class="text-weight-bold text-primary">
                  {{ patient.existingPatientNo }}
                </td>
                <td>
                  {{ patient.firstName }} {{ patient.middleName }} {{ patient.lastName }}
                  {{ patient.suffix }}
                </td>
                <td>
                  {{ formatDate(patient.birthdate) }}
                </td>
                <td>
                  {{ patient.age }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-separator />
        <q-card-actions align="center" class="bg-grey-1 q-pa-md">
          <q-btn unelevated label="Cancel" color="grey-7" v-close-popup />

          <q-btn
            unelevated
            label="Ignore & Create New"
            color="yellow-10"
            icon-right="las la-user-plus"
            @click="handleIgnoreDuplicate"
          />

          <q-btn
            v-if="localSelectedDuplicate"
            unelevated
            label="Link Record"
            color="blue-10"
            icon-right="las la-link"
            @click="confirmLinkPatient"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- <q-dialog v-model="admitDialog" persistent>
      <q-card style="min-width: 520px; border-radius: 12px">
        <q-card-section class="q-pa-md">
          <div
            class="q-pa-md rounded-borders q-mb-md"
            style="background: #f8f9fa; border: 1px solid #e0e0e0"
          >
            <div class="row items-center q-mb-md">
              <div class="col-auto q-mr-md">
                <div
                  class="bg-blue-1 text-primary flex flex-center rounded-borders"
                  style="width: 42px; height: 42px"
                >
                  <q-icon name="las la-user" size="26px" />
                </div>
              </div>
              <div class="col">
                <div
                  class="text-caption text-grey-6 text-uppercase text-weight-bold"
                  style="line-height: 1"
                >
                  Patient Name
                </div>
                <div class="text-subtitle1 text-uppercase" style="line-height: 1.2">
                  {{ selectedPatient?.fullName || "N/A" }}
                </div>
              </div>
            </div>

            <q-separator class="q-my-md" style="background-color: #e0e0e0" />

            <div class="row items-center q-mb-sm">
              <div class="col-auto q-mr-sm text-center" style="width: 24px">
                <q-icon name="las la-id-badge" class="text-grey-5" size="20px" />
              </div>
              <div class="col text-grey-7">Patient No.</div>
              <div class="col-auto text-weight-bold text-dark">
                {{ selectedPatient?.PATIENTNO || "N/A" }}
              </div>
            </div>

            <div class="row items-center">
              <div class="col-auto q-mr-sm text-center" style="width: 24px">
                <q-icon name="las la-calendar-day" class="text-grey-5" size="20px" />
              </div>
              <div class="col text-grey-7">Birthdate</div>
              <div class="col-auto text-weight-bold text-dark">
                {{ selectedPatient?.birthdateStr || "N/A" }}
              </div>
            </div>
          </div>

          <div class="text-subtitle2 text-grey-8 q-mb-md text-weight-bold">
            Admission Details
          </div>

          <div class="q-gutter-y-md q-px-xs">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-7">
                <q-select
                  outlined
                  dense
                  v-model="formData.admittingPhysician"
                  :options="allDoctors || []"
                  emit-value
                  map-options
                  label-slot
                  stack-label
                  lazy-rules
                  @update:model-value="onDoctorSelected"
                >
                  <template v-slot:label>
                    Admitting Physician<span class="text-red">*</span>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No doctors found
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-sm-5">
                <q-input
                  outlined
                  dense
                  v-model="formData.admittingDepartment"
                  label="Department"
                  stack-label
                  readonly
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-7">
                <q-select
                  outlined
                  stack-label
                  dense
                  v-model="formData.attendingPhysician"
                  :options="allDoctors || []"
                  emit-value
                  map-options
                  label-slot
                  lazy-rules
                  @update:model-value="onAttendingDoctorSelected"
                >
                  <template v-slot:label>
                    Attending Physician<span class="text-red">*</span>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No doctors found
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-sm-5">
                <q-input
                  outlined
                  dense
                  v-model="formData.attendingDepartment"
                  label="Department"
                  stack-label
                  readonly
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn
            flat
            label="Cancel"
            color="grey-7"
            class="q-px-md text-weight-bold"
            v-close-popup
          />
          <q-btn
            unelevated
            label="Confirm & Admit"
            color="yellow-10"
            icon-right="las la-check"
            class="q-px-md text-weight-bold text-white"
            @click="confirmAdmit"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapState, mapActions } from "pinia";
import { useInpatientStore } from "src/stores/inpatientStore";

import { printInpatientInformation } from "src/composables/printInpatientInformation";
import { printPatientConsent } from "src/composables/printPatientConsent";

export default {
  name: "InpatientList",

  setup() {
    const { generatePatientPdf } = printInpatientInformation();
    const { generatePatientConsentPdf } = printPatientConsent();
    return { generatePatientPdf, generatePatientConsentPdf };
  },

  data() {
    return {
      viewDialog: false,
      viewPatientValidationDialog: false,
      admitDialog: false,

      columns: [
        {
          name: "PATIENTNO",
          label: "PATIENTNO",
          field: "PATIENTNO",
          align: "center",
          sortable: true,
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
          align: "center",
          classes: "text-grey-7",
          format: (val) => (val ? date.formatDate(val, "MMM D, YYYY") : "-"),
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
    ...mapState(useInpatientStore, [
      "patientList",
      "loading",
      "searchQuery",
      "hasSearched",
      "selectedPatient",
      "showDuplicateDialog",
      "duplicateList",
      "selectedDuplicate",
      "pendingLinkData",
    ]),

    localSearchQuery: {
      get() {
        return this.useInpatientStore().searchQuery;
      },
      set(val) {
        this.useInpatientStore().searchQuery = val;
      },
    },
    localSelectedDuplicate: {
      get() {
        return this.useInpatientStore().selectedDuplicate;
      },
      set(val) {
        this.useInpatientStore().selectedDuplicate = val;
      },
    },
    localShowDuplicateDialog: {
      get() {
        return this.useInpatientStore().showDuplicateDialog;
      },
      set(val) {
        this.useInpatientStore().showDuplicateDialog = val;
      },
    },
  },

  mounted() {
    this.fetchInitialData();
  },

  methods: {
    ...mapActions(useInpatientStore, [
      "fetchInitialData",
      "searchPatients",
      "sendDataInformation",
      "linkExistingPatient",
      "ignoreDuplicate",
      "sendToCredit",
      "fetchFullPatientData",
    ]),

    useInpatientStore,

    handleSearch() {
      if (this.localSearchQuery === "") {
        this.fetchInitialData();
        return;
      }
      this.searchPatients(this.localSearchQuery);
    },

    viewPatient(row) {
      this.useInpatientStore().selectedPatient = row;
      this.viewDialog = true;
    },

    validatePatient(row) {
      this.useInpatientStore().selectedPatient = row;
      this.viewPatientValidationDialog = true;
    },

    async handleValidatePatient(row) {
      try {
        const success = await this.sendDataInformation(row);

        if (success) {
          this.viewPatientValidationDialog = false;
        }
      } catch (error) {
        console.error("Validation failed:", error);
      }
    },

    async confirmLinkPatient() {
      if (!this.localSelectedDuplicate || !this.pendingLinkData) return;

      try {
        const res = await this.linkExistingPatient(
          this.pendingLinkData.originalId,
          this.localSelectedDuplicate.existingPatientNo
        );

        if (res) {
          this.localShowDuplicateDialog = false;
          this.viewPatientValidationDialog = false;
          this.$q.notify({
            type: "positive",
            message: res?.message || "Patient linked successfully!",
            position: "top",
          });
        }
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: error?.response?.data?.message || error.message || "Linking failed",
          position: "top",
        });
      }
    },

    async handleIgnoreDuplicate() {
      await this.ignoreDuplicate();
      this.viewPatientValidationDialog = false;
    },

    async handleSendToCredit() {
      if (!this.selectedPatient || !this.selectedPatient.PATIENTREGID) {
        this.$q.notify({ type: "negative", message: "Error: No patient selected" });
        return;
      }
      const success = await this.sendToCredit(this.selectedPatient.PATIENTREGID);
      if (success) {
        this.viewDialog = false;
      }
    },

    async handlePrint(row) {
      const fullData = await this.fetchFullPatientData(row.PATIENTREGID);
      if (fullData) await this.generatePatientPdf(fullData);
    },

    async handlePrintConsent(row) {
      const fullData = await this.fetchFullPatientData(row.PATIENTREGID);
      if (fullData) await this.generatePatientConsentPdf(fullData);
    },

    formatDate(val) {
      if (!val) return "-";
      return date.formatDate(val, "MMM D, YYYY");
    },

    formatFullName(p) {
      if (!p) return "";
      if (p.fullName) return p.fullName;
      const parts = [p.firstName, p.middleName, p.lastName].filter(Boolean);
      let fullName = parts.join(" ");
      if (p.suffix) fullName += ` ${p.suffix}`;
      return fullName;
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

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.hover-blue:hover {
  color: #1976d2 !important;
  background-color: #e3f2fd;
}

.hover-green:hover {
  color: #388e3c !important;
  background-color: #e8f5e9;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #004aad 0%, #002a66 100%);
}

.info-box {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.rounded-borders {
  border-radius: 12px;
}
.header-title {
  letter-spacing: 0.7px;
}
</style>

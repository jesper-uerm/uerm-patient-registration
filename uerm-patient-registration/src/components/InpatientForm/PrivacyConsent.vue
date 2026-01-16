<template>
  <q-layout view="lHh Lpr fff" class="main-background">
    <q-page-container>
      <q-page class="window-height window-width row justify-center items-center">
        <div class="row q-pa-lg">
          <div class="row">
            <q-card
              class="shadow-24"
              style="border-radius: 20px"
              :style="{ width: $q.screen.lt.md ? '650px' : '900px', maxWidth: '100%' }"
            >
              <q-card-section class="text-white" style="background-color: #004aad">
                <div class="column items-center justify-center q-py-xs">
                  <div>
                    <q-img
                      src="~assets/uermmc-white-logo.png"
                      alt="UERM Medical Center Logo"
                      contain
                      width="140px"
                      class="cursor-pointer"
                      @click="$router.push('/')"
                    />
                  </div>
                  <div class="text-subtitle1 q-mt-sm">Data Privacy Consent</div>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-md">
                <div class="text-subtitle2 text-center q-mb-md text-grey-8">
                  Terms and Conditions
                </div>
                <q-scroll-area
                  style="height: 320px; border: 1px solid #e0e0e0; border-radius: 8px"
                  :style="{ height: $q.screen.lt.sm ? '200px' : '450px' }"
                  class="q-pa-lg bg-grey-1 text-justify"
                >
                  <p>
                    <strong>1. Data Collection & Usage:</strong>
                    In accordance with the
                    <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, I
                    hereby authorize UERM Memorial Medical Center to collect, process, and
                    store my personal data for the purpose of medical records, hospital
                    administration, and insurance processing.
                  </p>
                  <p>
                    <strong>2. Confidentiality:</strong>
                    UERM ensures that all personal information is treated with strict
                    confidentiality and is accessed only by authorized personnel.
                  </p>
                  <p>
                    <strong>3. Third-Party Sharing:</strong>
                    My data may be shared with PhilHealth, HMOs, and other regulatory
                    bodies as required by law or for the facilitation of my medical
                    benefits.
                  </p>
                  <p>
                    <strong>4. Data Retention:</strong>
                    My records will be retained in accordance with the hospital's
                    retention policy and applicable laws.
                  </p>
                  <p>
                    By signing below, I acknowledge that I have read and understood this
                    Data Privacy Consent form.
                  </p>
                </q-scroll-area>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-checkbox
                  v-model="hasAgreed"
                  label="I have read and agree to the Data Privacy Policy of UERM Memorial Medical Center."
                  color="primary"
                  dense
                />
              </q-card-section>

              <q-card-actions align="right" class="q-px-md q-pb-md">
                <q-btn flat label="Decline" color="grey-7" v-close-popup />
                <q-btn
                  unelevated
                  label="Submit Consent"
                  style="background-color: #004aad; color: white"
                  class="login-btn q-px-lg"
                  :disable="!canSubmit"
                  :loading="loading"
                  @click="submitConsent"
                />
              </q-card-actions>

              <q-card-section class="text-center q-pt-none">
                <q-separator spaced />
                <div class="q-mt-md text-grey-1">
                  <q-footer class="bg-transparent text-grey text-center q-mb-md">
                    <div class="text-caption">
                      &copy; {{ currentYear }} UERM Memorial Medical Center. All rights
                      reserved.
                    </div>
                  </q-footer>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "PrivacyConsentPage",

  data() {
    return {
      hasAgreed: false,
      loading: false,
    };
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  mounted() {},

  methods: {
    async submitConsent() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.$q.notify({
          type: "positive",
          message: "Consent submitted successfully",
          position: "top",
        });
      }, 1500);
    },
  },
};
</script>

<style scoped>
.main-background {
  min-height: 100vh;
  background-color: #ffffff;
  background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0.9),
      rgba(20, 74, 173, 0.9)
    ),
    url("/bg-images/uermmmc_bg.jpg");
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
}

.login-btn {
  height: 45px;
  border-radius: 8px;
  font-weight: bold;
}

/* Signature Pad Styles */
.signature-wrapper {
  border: 2px dashed #bbb;
  border-radius: 8px;
  background-color: #fff;
  overflow: hidden;
  height: 200px;
}

.signature-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: crosshair;
  touch-action: none;
}

.pointer-events-none {
  pointer-events: none;
}
</style>

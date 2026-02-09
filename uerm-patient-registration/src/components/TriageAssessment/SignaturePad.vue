<template>
  <div class="col-12 column flex-center q-gap-md">
    <div
      v-if="signedImage"
      class="signature-preview q-pa-sm bg-grey-2 rounded-borders cursor-pointer"
      @click="showDialog = true"
    >
      <img :src="signedImage" alt="Signature" style="max-width: 100%; height: 100px" />
    </div>
    <q-btn
      v-else
      class="text-center"
      label="Click to Sign"
      color="primary"
      icon="edit"
      outline
      @click="showDialog = true"
    />
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px; width: 100%; max-width: 600px">
        <q-card-section class="row items-center">
          <div class="text-subtitle2 text-grey-9">Triage Personnel Signature:</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section
          class="q-pa-none bg-grey-2 flex flex-center"
          style="overflow: hidden"
        >
          <VueSignaturePad
            id="signature"
            width="100%"
            height="150px"
            ref="signaturePad"
            class="cursor-crosshair"
            :options="{ penColor: 'rgb(0, 0, 0)' }"
          />
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Clear" color="negative" @click="clearSignature" />
          <q-btn
            unelevated
            label="Save Signature"
            color="primary"
            @click="saveSignature"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { VueSignaturePad } from "vue-signature-pad";
export default {
  name: "SignaturePad",
  components: {
    VueSignaturePad,
  },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue", "save"],
  data() {
    return {
      showDialog: false,
      signedImage: this.modelValue || null,
    };
  },
  watch: {
    modelValue(newVal) {
      this.signedImage = newVal;
    },
  },
  methods: {
    clearSignature() {
      this.$refs.signaturePad.clearSignature();
    },
    saveSignature() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (isEmpty) {
        this.$q.notify({
          type: "warning",
          message: "Please provide a signature first.",
          position: "top",
        });
        return;
      }
      this.signedImage = data;
      this.$emit("update:modelValue", data);
      this.$emit("save", data);
      this.showDialog = false;
    },
  },
};
</script>
<style scoped>
.signature-preview {
  border: 1px dashed #ccc;
  min-width: 500px;
  text-align: center;
}
</style>

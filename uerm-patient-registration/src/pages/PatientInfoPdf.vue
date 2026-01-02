<script setup>
import { ref } from "vue";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// Initialize fonts (required)
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else if (pdfFonts && pdfFonts.vfs) {
  pdfMake.vfs = pdfFonts.vfs;
} else {
  pdfMake.vfs = pdfFonts;
}

// 1. Reactive variable to hold the PDF URL
const pdfUrl = ref(null);

const generateAndPreview = () => {
  // Define your PDF content
  const docDefinition = {
    content: [
      { text: "Preview of Your Document", style: "header" },
      {
        text: "This PDF was generated inside Vue 3 without downloading.",
        margin: [0, 20],
      },
      {
        table: {
          body: [
            ["Item", "Cost"],
            ["Service A", "$100"],
            ["Service B", "$200"],
          ],
        },
      },
    ],
    styles: {
      header: { fontSize: 18, bold: true },
    },
  };

  // 2. Generate the PDF as a Data URL instead of downloading
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  pdfDocGenerator.getDataUrl((dataUrl) => {
    // 3. Update the reactive variable
    pdfUrl.value = dataUrl;
  });
};
</script>

<template>
  <div class="container">
    <div class="controls">
      <button @click="generateAndPreview" class="btn-primary">Generate & View PDF</button>
    </div>

    <div v-if="pdfUrl" class="preview-container">
      <h3>Document Preview:</h3>
      <iframe :src="pdfUrl" width="100%" height="600px" type="application/pdf"> </iframe>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  font-family: sans-serif;
}
.controls {
  margin-bottom: 20px;
}

.btn-primary {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.btn-primary:hover {
  background-color: #2980b9;
}

.preview-container {
  border: 1px solid #ddd;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
}
iframe {
  border: 1px solid #ccc;
  background: white; /* Ensure white background for PDF area */
}
</style>

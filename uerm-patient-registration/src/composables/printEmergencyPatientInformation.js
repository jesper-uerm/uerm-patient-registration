export function printEmergencyPatientInformation() {

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  };

  // const getSignatureFromAPI = async (patientId) => {
  //   try {
  //     const response = await fetch(`http://10.107.0.2:3000/api/auth/getpatientSignature/${patientId}`);
  //     if (!response.ok) return null;

  //     const data = await response.json();
  //     return (data && data.signature) ? data.signature : null;
  //   } catch (error) {
  //     console.warn('Failed to fetch signature:', error);
  //     return null;
  //   }
  // };

  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        console.warn(`Could not load image: ${url}`);
        resolve(null);
      };
      img.src = url;
    });
  };

  const initSdk = async () => {
    if (!window.pdfMake) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.71/pdfmake.min.js');
    }
    if (!window.pdfMake.vfs || Object.keys(window.pdfMake.vfs).length === 0) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.71/vfs_fonts.js');
    }
  };

  const generatePatientPdf = async (patient) => {
    try {
      await initSdk();
      const pdf = window.pdfMake;

      const leftLogo = await getBase64ImageFromURL('src/assets/uerm-logo.png');
      const rightLogo = await getBase64ImageFromURL('src/assets/uermmc-blue-logo.png');

      // const signatureData = await getSignatureFromAPI(patient.patientId || patient.id);

      const getLogoColumn = (imgData, align) => {
        if (imgData) {
          return { image: imgData, width: 60, alignment: align };
        }
        return { text: '', width: 60 };
      };

      pdf.fonts = {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf'
        }
      };

      if (!patient) return;

      const createCell = (label, value) => ({
        stack: [
          { text: label.toUpperCase(), fontSize: 7, bold: true, color: '#888888', margin: [0, 0, 0, 4] },
          { text: value || '-', fontSize: 10, bold: true, color: '#333333', margin: [0, 0, 0, 1] }
        ],
        margin: [0, 0, 0, 0]
      });

      const lastname = patient.lastName || 'Unknown';
      const firstname = patient.firstName || 'Unknown';
      const birthdate = patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-';
      const age = patient.age ? patient.age.toString() : '-';
      const sex = patient.gender || patient.sex || '-';
      const chiefComplaint = patient.chiefComplaint || '-';
      const temp = patient.temp || '-';
      const heartrate = patient.heartrate || '-';
      const oxygen = patient.oxygen || '-';
      const bp = patient.bp || '-';
      const respirate = patient.respirate || '-';
      const painScore = patient.painScore || '-';
      const avpu = patient.avpu || '-';
      const contagious = patient.contagious || '-';
      const isolation = patient.isolation || '-';
      const symptoms = patient.symptoms || '-';
      const cpd = patient.cpd || '-';
      const level = patient.level || '-';
      const remarks = patient.remarks || '-';

      // const signatureElement = signatureData
      //   ? { image: signatureData, width: 150, alignment: 'center', margin: [0, 0, 0, 2] }
      //   : { text: '(Signature Not Available)', fontSize: 9, color: '#999', alignment: 'center', margin: [0, 0, 0, 10] };

      // const createdAt = patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-';


      const docDefinition = {
        pageMargins: [30, 30, 30, 30],
        info: { title: `Record_${firstname + '_' + lastname}` },

        content: [
          {
            columns: [
              getLogoColumn(leftLogo, 'left'),
              {
                width: '*',
                stack: [
                  {
                    text: 'UNIVERSITY OF THE EAST RAMON MAGSAYSAY MEMORIAL MEDICAL CENTER, INC.',
                    style: 'header',
                    alignment: 'center',
                  },
                  {
                    text: '64 Aurora Blvd, Doña Imelda, Quezon City, 1113 Metro Manila',
                    style: 'subheader',
                    alignment: 'center',
                    margin: [0, 2, 0, 0],
                  },
                  {
                    text: 'Telephone: +632 715 0861-77 local 215      Website: https://www.uerm.edu.ph',
                    style: 'subheader',
                    alignment: 'center',
                    margin: [0, 2, 0, 0],
                  }
                ]
              },
              getLogoColumn(rightLogo, 'right')
            ],
            margin: [0, 0, 0, 10]
          },

          {
            text: 'OUTPATIENT FORM',
            style: 'headerTitle',
            alignment: 'center',
          },

          {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    text: 'PATIENT INFORMATION',
                    fillColor: '#eeeeee',
                    style: 'sectionHeader',
                    alignment: 'center',
                    colSpan: 4,
                  },
                  {}, {}, {}
                ],
                [
                  createCell('Name', `${firstname} ${lastname}`),
                  createCell('Birthdate', birthdate),
                  createCell('Age', age),
                  createCell('Sex', sex),
                ],
                [
                  { ...createCell('Chief Complaint', chiefComplaint), colSpan: 4 },
                  {},
                  {},
                  {}
                ],
              ]
            }
          },

          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#888888' }] },

          {
            margin: [0, 10, 0, 0],
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    text: 'VITAL SIGNS',
                    style: 'sectionHeader',
                    fillColor: '#eeeeee',
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    colSpan: 4,
                  },
                  {}, {}, {},
                ],
                [
                  createCell('Temperature', temp),
                  createCell('Heart Rate', heartrate),
                  createCell('Oxygen Saturation', oxygen),
                  createCell('Blood Pressure', bp),
                ],
                  [
                  { ...createCell('Respiratory Rate', respirate), colSpan: 1 },
                  { ...createCell('Pain Score', painScore), colSpan: 1 },
                  { ...createCell('AVPU Scale', avpu), colSpan: 2 },
                  {}
                ],
                [
                  { ...createCell('Screening for Contagious Infectious Disease', contagious), colSpan: 2 },
                  {},
                  { ...createCell('Check for Presence of Any of the Following:', symptoms), colSpan: 1 },
                  { ...createCell('Initiate Isolation Precaution and Transfer Immediately to:', isolation), colSpan: 1 },
                ],
                [
                  { ...createCell('Cardio-Pulmonary Distress', cpd), colSpan: 1 },
                  { ...createCell('Triage-Level', level), colSpan: 1 },
                  { ...createCell('Remarks', remarks), colSpan: 2 },
                  {},
                ],
              ]
            }
          },


          // {
          //   margin: [0, 50, 0, 0],
          //   columns: [
          //     { width: '*', text: '' },
          //     {
          //       width: 150,
          //       stack: [
          //         signatureElement,
          //         {
          //           text: `${firstname} ${lastname}`.toUpperCase(),
          //           style: 'subheader',
          //           alignment: 'center',
          //           bold: true,
          //           margin: [0, 0, 0, 5]
          //         },
          //         {
          //           canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 }]
          //         },
          //         {
          //           text: 'SIGNATURE OVER PRINTED NAME',
          //           style: 'subheader',
          //           alignment: 'center',
          //           margin: [0, 5, 0, 0]
          //         },
          //         {
          //           text: `DATE: ${createdAt}`,
          //           fontSize: 8,
          //           alignment: 'center',
          //           margin: [0, 8, 0, 0]
          //         }
          //       ]
          //     },
          //       { width: '*', text: '' }
          //   ]
          // }
        ],

        styles: {
          header: { fontSize: 10, bold: true, margin: [5, 15, 5, 0] },
          headerTitle: { fontSize: 12, bold: true, margin: [5, 5, 5, 0] },
          subheader: { fontSize: 8, italics: true },
          sectionTitle: { fontSize: 14, bold: true, margin: [0, 10, 0, 0] },
          sectionHeader: { fontSize: 9, bold: true, letterSpacing: 1 }
        }
      };

      pdf.createPdf(docDefinition).open();

    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('PDF Error: ' + err.message);
    }
  };

  return { generatePatientPdf };
}

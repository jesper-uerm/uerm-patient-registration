export function printPatientConsent() {

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

  const getSignatureFromAPI = async (patientId) => {
    try {
      const response = await fetch(`http://10.107.0.2:3000/api/auth/getpatientSignature/${patientId}`);
      if (!response.ok) return null;

      const data = await response.json();
      return (data && data.signature) ? data.signature : null;
    } catch (error) {
      console.warn('Failed to fetch signature:', error);
      return null;
    }
  };

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


  const generatePatientConsentPdf = async (patient) => {
    try {
      if (!patient) return;

      await initSdk();
      const pdf = window.pdfMake;

      const leftLogo = await getBase64ImageFromURL('src/assets/uerm-logo.png');
      const rightLogo = await getBase64ImageFromURL('src/assets/uermmc-blue-logo.png');

      const signatureData = await getSignatureFromAPI(patient.patientId || patient.id);

      const lastname = patient.lastName || 'Unknown';
      const firstname = patient.firstName || 'Unknown';
      const fullName = `${firstname} ${lastname}`.toUpperCase();
      const createdAt = patient.createdAt
        ? new Date(patient.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      const getLogoColumn = (imgData, align) => {
        if (imgData) return { image: imgData, width: 60, alignment: align };
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

      const docDefinition = {
        pageMargins: [40, 40, 40, 40],
        info: { title: `Consent_${lastname}_${firstname}` },

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
                    text: 'Data Privacy Office',
                    style: 'subheader',
                    alignment: 'center',
                    margin: [0, 2, 0, 0],
                    bold: true
                  }
                ]
              },
              getLogoColumn(rightLogo, 'right')
            ],
            margin: [0, 0, 0, 20]
          },

          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: '#004aad' }] },

          {
            text: 'DATA PRIVACY CONSENT FORM',
            style: 'headerTitle',
            alignment: 'center',
            margin: [0, 20, 0, 20],
            color: '#004aad'
          },

          {
            stack: [
              {
                text: [
                  { text: '1. Data Collection & Usage: ', bold: true },
                  'In accordance with the Data Privacy Act of 2012 (Republic Act No. 10173), I hereby authorize UERM Memorial Medical Center to collect, process, and store my personal data for the purpose of medical records, hospital administration, and insurance processing.'
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify'
              },
              {
                text: [
                  { text: '2. Confidentiality: ', bold: true },
                  'UERM ensures that all personal information is treated with strict confidentiality and is accessed only by authorized personnel.'
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify'
              },
              {
                text: [
                  { text: '3. Third-Party Sharing: ', bold: true },
                  'My data may be shared with PhilHealth, HMOs, and other regulatory bodies as required by law or for the facilitation of my medical benefits.'
                ],
                margin: [0, 0, 0, 10],
                alignment: 'justify'
              },
              {
                text: [
                  { text: '4. Data Retention: ', bold: true },
                  'My records will be retained in accordance with the hospital\'s retention policy and applicable laws.'
                ],
                margin: [0, 0, 0, 20],
                alignment: 'justify'
              },
              {
                text: 'By signing below, I acknowledge that I have read and understood this Data Privacy Consent form and fully agree to its terms.',
                italics: true,
                alignment: 'center',
                margin: [0, 0, 0, 40]
              }
            ]
          },

          {
            columns: [
              { width: '*', text: '' },
              {
                width: 200,
                stack: [

                  signatureData
                    ? { image: signatureData, width: 120, alignment: 'center', margin: [0, 0, 0, 5] }
                    : { text: '', height: 60 },


                  {
                    text: fullName,
                    style: 'signatureName',
                    alignment: 'center',
                    margin: [0, 5, 0, 0]
                  },

                  { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1 }] },

                  {
                    text: 'Patient / Guardian Signature',
                    style: 'signatureLabel',
                    alignment: 'center'
                  },

                  {
                    text: `Date Signed: ${createdAt}`,
                    style: 'signatureLabel',
                    alignment: 'center',
                    margin: [0, 5, 0, 0]
                  }
                ]
              },
              { width: '*', text: '' }
            ]
          }
        ],

        styles: {
          header: { fontSize: 11, bold: true, margin: [5, 5, 5, 0] },
          headerTitle: { fontSize: 16, bold: true, letterSpacing: 1 },
          subheader: { fontSize: 8, color: '#555' },
          signatureName: { fontSize: 10, bold: true },
          signatureLabel: { fontSize: 8, italics: true, color: '#444' }
        }
      };

      pdf.createPdf(docDefinition).download();

    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('PDF Error: ' + err.message);
    }
  };

  return { generatePatientConsentPdf };
}

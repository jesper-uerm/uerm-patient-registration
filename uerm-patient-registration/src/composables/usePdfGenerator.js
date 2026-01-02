export function usePdfGenerator() {

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

      const name = patient.fullName || patient.lastName || 'Unknown';
      const birthdate = patient.birthdate;
      const physician = patient.physician;
      const itemsReceived = patient.itemsReceived;


      const docDefinition = {
        pageMargins: [40, 20, 40, 40],
        info: { title: `Record_${name}` },

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
                    text: 'Telephone: +632 715 0861-77 local 215          Website: https://www.uerm.edu.ph',
                    style: 'subsubheader',
                    alignment: 'center',
                    margin: [0, 2, 0, 0],
                  }
                ]
              },
              getLogoColumn(rightLogo, 'right')
            ],
            margin: [0, 0, 0, 15]
          },
          {
            text: 'PATIENT INFORMATION',
            style: 'header',
            alignment: 'center',
          },
          { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] },


          {
            table: {
              widths: ['*', '*'],
              body: [
                [
                  {
                    stack: [
                      { text: 'PATIENT NAME', fontSize: 9, bold: true, color: '#6b7280', margin: [0, 0, 0, 2] },
                      { text: name, fontSize: 12, bold: true, color: '#000000' }
                    ],
                  },
                  {
                    stack: [
                      { text: 'BIRTHDATE', fontSize: 9, bold: true, color: '#6b7280', margin: [0, 0, 0, 2] },
                      { text: birthdate, fontSize: 12, bold: true, color: '#000000' }
                    ],
                  }
                ],
                [
                  {
                    stack: [
                      { text: 'PHYSICIAN', fontSize: 9, bold: true, color: '#6b7280', margin: [0, 0, 0, 2] },
                      { text: physician, fontSize: 12, bold: false, color: '#000000' }
                    ]
                  },
                  {
                    stack: [
                      { text: 'RECEIVED ITEMS', fontSize: 9, bold: true, color: '#6b7280', margin: [0, 0, 0, 2] },
                      { text: itemsReceived, fontSize: 11, bold: false, color: '#000000' }
                    ]
                  }
                ]
              ]
            },
            margin: [0, 10]
          }
        ],

        styles: {
          header: { fontSize: 10, bold: true, margin: [5, 15, 5, 0]},
          subheader: { fontSize: 8, italics: true },
          subsubheader: { fontSize: 8, italics: true }
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

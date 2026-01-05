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

      const createCell = (label, value) => ({
        stack: [
          { text: label.toUpperCase(), fontSize: 7, bold: true, color: '#888888', margin: [0, 0, 0, 4] },
          { text: value || '-', fontSize: 10, bold: true, color: '#333333', margin: [0, 0, 0, 1] }
        ],
        margin: [0, 0, 0, 0]
      });

      const lastname = patient.lastName || 'Unknown';
      const firstname = patient.firstName || 'Unknown';
      const middlename = patient.middleName || '-';
      const age = patient.age ? patient.age.toString() : '-';
      const sex = patient.gender || patient.sex || '-';
      const civilStatus = patient.civilStatus || '-';
      const religion = patient.religion || '-';
      const landline = patient.landline || '-';
      const mobile = patient.mobile || '-';
      const email = patient.email || '-';

      const birthdate = patient.birthdate ? new Date(patient.birthdate).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) : '-';
      const birthplace = patient.birthplace || '-';
      const nationality = patient.nationality || '-';

      const presentAddress = patient.addressPresent || '-';
      const permanentAddress = patient.addressPermanent || '-';

      const spousename = patient.spouseName || '-';
      const spouseoccupation = patient.spouseOccupation || '-';
      const spouseemployercontact = patient.spouseEmployerContact || '-';

      const fathersname = patient.ptFatherName || '-';
      const fathersaddress = patient.ptFatherAddress || '-';
      const fathercontactnumber = patient.ptFatherContact || '-';

      const mothersname = patient.ptMotherMaidenNam || '-';
      const mothersaddress = patient.ptMotherAddress || '-';
      const mothercontactnumber = patient.ptMotherContact || '-';

      const ptsourceofincome = patient.ptSourceIncome || patient.specificSourceOfIncome || '-';
      const ptgrossincome = patient.ptGrossIncome ? patient.ptGrossIncome.replace(/"/g, '') : '-';
      const ptHomeOwnership = patient.ptHomeOwnership ? patient.ptHomeOwnership.replace(/"/g, '') : '-';

      const ptYearsStay = patient.ptYearsStay ? patient.ptYearsStay.replace(/"/g, '') : '-';
      const ptCarOwnership = patient.ptCarOwnership || '-';
      const ptNumberOfCars = patient.ptNumberOfCars || '-';

      const cpName = patient.cpName || '-';
      const cpRelationship = patient.cpRelationship || '-';
      const cpLandline = patient.cpLandline || '-';
      const cpMobile = patient.cpMobile || '-';
      const cpAddress = patient.cpAddress || '-';
      const cpOccupation = patient.cpOccupation || '-';
      const cpEmail = patient.cpEmail || '-';
      const cpIncomeSource = patient.cpIncomeSource || '-';
      const cpEmployerNameAddress = patient.cpEmployerNameAddress || '-';
      const cpEmployerNumber = patient.cpEmployerNumber || '-';

      const cpGrossIncome = patient.cpGrossIncome || '-';
      const cpHomeOwnership = patient.cpHomeOwnership || '-';
      const cpHomeStay = patient.cpHomeStay || '-';
      const cpCarOwnership = patient.cpCarOwnership || '-';
      const cpNumberOfCars = patient.cpNumberOfCars || '-';

      const modeOfPayment = patient.modeOfPayment || patient.specificModeOfPayment || '-';
      const creditCards = patient.creditCards || '-';
      const bankAffiliations = patient.bankAffiliations || '-';
      const itemsReceived = patient.itemsReceived ? patient.itemsReceived.replace(/["[\]]/g, '') : '-';

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
                    text: 'Telephone: +632 715 0861-77 local 215          Website: https://www.uerm.edu.ph',
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
            text: 'INPATIENT FORM',
            style: 'headerTitle',
            alignment: 'center',
          },

        {
            margin: [0, 10, 0, 0],
            // layout: 'noBorders', // Uncomment if you want to remove borders
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
                  {},
                  {},
                  {}
                ],
                [
                  createCell('Last Name', lastname),
                  createCell('First Name', firstname),
                  createCell('Middle Name', middlename),
                  createCell('Age', age),
                ],
                [
                  createCell('Sex', sex),
                  createCell('Civil Status', civilStatus),
                  createCell('Religion', religion),
                  createCell('Nationality', nationality),
                ],
                [
                  createCell('Birthdate', birthdate),
                  createCell('Birthplace', birthplace),
                  createCell('Landline', landline),
                  createCell('Mobile', mobile),
                ],

                [
                  { ...createCell('Email Address', email), colSpan: 4 },
                  {},
                  {},
                  {}
                ],

                [
                  { ...createCell('Present Address', presentAddress), colSpan: 2 },
                  {},
                  { ...createCell('Permanent Address', permanentAddress), colSpan: 2 },
                  {}
                ],
              ]
            }
          },


          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#888888' }] },

          {
            margin: [0, 10, 0, 0],
            // layout: 'noBorders',
            table: {
              widths: ['30%', '40%', '30%'],
              body: [
                [
                  {
                    text: 'FAMILY BACKGROUND',
                    style: 'sectionHeader',
                    fillColor: '#eeeeee',
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    colSpan: 3,
                  },
                  {},
                  {},
                ],
                [
                  createCell('Spouse\'s Name', spousename),
                  createCell('Occupation', spouseoccupation),
                  createCell('Immediate Contact No.', spouseemployercontact),
                ],
                [
                  createCell('Father\'s Name', fathersname),
                  createCell('Father\'s Address', fathersaddress),
                  createCell('Contact No.', fathercontactnumber),
                ],
                [
                  createCell('Mother\'s Name', mothersname),
                  createCell('Mother\'s Address', mothersaddress),
                  createCell('Contact No.', mothercontactnumber),
                ]
              ]
            }
          },

          {
            margin: [0, 10, 0, 0],
            // layout: 'noBorders',
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    text: 'FINANCIAL BACKGROUND',
                    style: 'sectionHeader',
                    fillColor: '#eeeeee',
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    colSpan: 4,
                  },
                  {},
                  {},
                  {},
                ],
                [
                  createCell('Source of Income', ptsourceofincome),
                  createCell('Gross Income', ptgrossincome),
                  createCell('Home Ownership', ptHomeOwnership),
                  createCell('Years of Stay', ptYearsStay),
                ],
                [
                  { ...createCell('Car Ownership', ptCarOwnership), colSpan: 2 },
                  {},
                  { ...createCell('No. of Cars Owned', ptNumberOfCars), colSpan: 2 },
                  {}
                ],
              ]
            }
          },

          {
            margin: [0, 10, 0, 0],
            // layout: 'noBorders',
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    text: 'PERSONS / PARTIES RESPONSIBLE FOR THE ACCOUNT OTHER THAN THE PATIENT',
                    style: 'sectionHeader',
                    fillColor: '#eeeeee',
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    colSpan: 4,
                  },
                  {},
                  {},
                  {},
                ],
                [
                  createCell('Full Name', cpName),
                  createCell('Relationship', cpRelationship),
                  createCell('Landline No.', cpLandline),
                  createCell('Mobile No.', cpMobile),
                ],
                [
                  { ...createCell('Complete Address', cpAddress ), colSpan: 2 },
                  {},
                  { ...createCell('Occupation', cpOccupation), colSpan: 1 },
                  { ...createCell('Email Address', cpEmail ), colSpan: 1 },
                ],
                [
                  { ...createCell('Source of Income', cpIncomeSource ), colSpan: 1 },
                  { ...createCell('Employer/Business Name and Address', cpEmployerNameAddress ), colSpan: 2 },
                  {},
                  { ...createCell('Employer/Business Contact No.', cpEmployerNumber), colSpan: 1 },
                ],
                [
                  createCell('Gross Income', cpGrossIncome),
                  createCell('Home Ownership', cpHomeOwnership),
                  createCell('Years of Stay', cpHomeStay),
                  {},
                ],
                [
                  { ...createCell('Car Ownership', cpCarOwnership), colSpan: 2 },
                  {},
                  { ...createCell('No. of Cars Owned', cpNumberOfCars), colSpan: 2 },
                  {}
                ],
              ]
            }
          },

          {
            margin: [0, 10, 0, 0],
            // layout: 'noBorders',
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    text: 'MODE OF PAYMENT',
                    style: 'sectionHeader',
                    fillColor: '#eeeeee',
                    margin: [0, 0, 0, 0],
                    alignment: 'center',
                    colSpan: 4,
                  },
                  {},
                  {},
                  {},
                ],
                [
                  createCell('Mode of Payment ', modeOfPayment),
                  createCell('No. of Credit Card Owned', creditCards),
                  createCell('Bank Affliations', bankAffiliations),
                  createCell('Items Received in Good order and Condition', itemsReceived),
                ],
              ]
            }
          },
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

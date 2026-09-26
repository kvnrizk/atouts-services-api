import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import type { Estimation } from './entities/estimation.entity';

const CATEGORY_LABELS: Record<string, string> = {
  peinture: 'Peinture',
  renovation: 'Renovation',
  electricite: 'Electricite',
  'salles-de-bains': 'Salle de bain',
  'revetements-sol': 'Revetement de sol',
};

const QUALITY_LABELS: Record<string, string> = {
  eco: 'Essentiel',
  standard: 'Confort',
  premium: 'Premium',
};

const UNIT_LABELS: Record<string, string> = {
  m2: 'm\u00B2',
  ml: 'ml',
  unite: 'unite',
  forfait: 'forfait',
};

@Injectable()
export class PdfService {
  async generateEstimationPdf(estimation: Estimation): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const blue = '#2563eb';
      const darkGray = '#1f2937';
      const gray = '#6b7280';
      const lightGray = '#f3f4f6';

      // --- Header ---
      doc
        .fontSize(22)
        .fillColor(blue)
        .text('ATOUTS SERVICES', 50, 50, { align: 'left' });
      doc
        .fontSize(9)
        .fillColor(gray)
        .text('Renovation - Peinture - Electricite - Sols - Salles de bains', 50, 75);

      doc
        .fontSize(10)
        .fillColor(gray)
        .text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 400, 50, {
          align: 'right',
          width: 145,
        });
      doc.text(`Ref : EST-${estimation.id}`, 400, 65, {
        align: 'right',
        width: 145,
      });

      // Divider
      doc
        .moveTo(50, 100)
        .lineTo(545, 100)
        .strokeColor(blue)
        .lineWidth(2)
        .stroke();

      // --- Title ---
      doc
        .fontSize(16)
        .fillColor(darkGray)
        .text('Estimation de prix', 50, 120, { align: 'center' });

      // --- Project info ---
      let y = 155;
      const infoCol1 = 50;
      const infoCol2 = 300;

      doc.fontSize(10).fillColor(gray);
      doc.text('Service :', infoCol1, y);
      doc
        .fillColor(darkGray)
        .text(
          CATEGORY_LABELS[estimation.category] || estimation.category,
          infoCol1 + 100,
          y,
        );

      doc.fillColor(gray).text('Qualite :', infoCol2, y);
      doc
        .fillColor(darkGray)
        .text(
          QUALITY_LABELS[estimation.qualityLevel] || estimation.qualityLevel,
          infoCol2 + 100,
          y,
        );

      y += 20;
      doc.fillColor(gray).text('Surface :', infoCol1, y);
      doc
        .fillColor(darkGray)
        .text(`${estimation.surfaceArea} m\u00B2`, infoCol1 + 100, y);

      if (estimation.rooms) {
        doc.fillColor(gray).text('Pieces :', infoCol2, y);
        doc
          .fillColor(darkGray)
          .text(String(estimation.rooms), infoCol2 + 100, y);
      }

      // --- Client info (if captured) ---
      if (estimation.firstName) {
        y += 30;
        doc.fontSize(11).fillColor(blue).text('Client', 50, y);
        y += 18;
        doc
          .fontSize(10)
          .fillColor(darkGray)
          .text(
            `${estimation.firstName} ${estimation.lastName || ''}`,
            50,
            y,
          );
        if (estimation.email) {
          y += 15;
          doc.fillColor(gray).text(estimation.email, 50, y);
        }
        if (estimation.phone) {
          y += 15;
          doc.fillColor(gray).text(estimation.phone, 50, y);
        }
      }

      // --- Items table ---
      y += 35;
      doc.fontSize(11).fillColor(blue).text('Detail de l\'estimation', 50, y);
      y += 22;

      // Table header
      const tableLeft = 50;
      const colWidths = [220, 50, 40, 75, 75, 75];
      const headers = ['Designation', 'Unite', 'Qte', 'Bas', 'Moyen', 'Haut'];

      doc.rect(tableLeft, y, 495, 20).fill(blue);
      let x = tableLeft + 5;
      doc.fontSize(8).fillColor('#ffffff');
      headers.forEach((h, i) => {
        const align = i >= 3 ? 'right' : 'left';
        const w = colWidths[i] - (i >= 3 ? 10 : 0);
        doc.text(h, x, y + 5, { width: w, align });
        x += colWidths[i];
      });
      y += 20;

      // Table rows
      const items = estimation.selectedItems || [];
      items.forEach((item, idx) => {
        if (y > 720) {
          doc.addPage();
          y = 50;
        }

        if (idx % 2 === 0) {
          doc.rect(tableLeft, y, 495, 18).fill(lightGray);
        }

        x = tableLeft + 5;
        doc.fontSize(8).fillColor(darkGray);
        doc.text(item.label, x, y + 4, { width: colWidths[0] - 10 });
        x += colWidths[0];
        doc.text(UNIT_LABELS[item.unit] || item.unit, x, y + 4, {
          width: colWidths[1],
        });
        x += colWidths[1];
        doc.text(String(item.quantity), x, y + 4, { width: colWidths[2] });
        x += colWidths[2];

        const lineLow = item.quantity * item.unitPriceLow;
        const lineMid = item.quantity * item.unitPriceMid;
        const lineHigh = item.quantity * item.unitPriceHigh;

        doc.text(`${Math.round(lineLow)} \u20AC`, x, y + 4, {
          width: colWidths[3] - 10,
          align: 'right',
        });
        x += colWidths[3];
        doc.text(`${Math.round(lineMid)} \u20AC`, x, y + 4, {
          width: colWidths[4] - 10,
          align: 'right',
        });
        x += colWidths[4];
        doc.text(`${Math.round(lineHigh)} \u20AC`, x, y + 4, {
          width: colWidths[5] - 10,
          align: 'right',
        });

        y += 18;
      });

      // --- Totals ---
      y += 5;
      doc
        .moveTo(tableLeft, y)
        .lineTo(545, y)
        .strokeColor(blue)
        .lineWidth(1)
        .stroke();
      y += 8;

      const totalsX = 380;
      doc.fontSize(10).fillColor(darkGray);
      doc.text('Estimation basse :', totalsX, y, { width: 100 });
      doc
        .font('Helvetica-Bold')
        .text(`${Math.round(Number(estimation.totalLow))} \u20AC`, 480, y, {
          width: 65,
          align: 'right',
        });
      y += 18;
      doc
        .font('Helvetica')
        .text('Estimation moyenne :', totalsX, y, { width: 100 });
      doc
        .font('Helvetica-Bold')
        .fillColor(blue)
        .fontSize(12)
        .text(`${Math.round(Number(estimation.totalMid))} \u20AC`, 480, y, {
          width: 65,
          align: 'right',
        });
      y += 20;
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor(darkGray)
        .text('Estimation haute :', totalsX, y, { width: 100 });
      doc
        .font('Helvetica-Bold')
        .text(`${Math.round(Number(estimation.totalHigh))} \u20AC`, 480, y, {
          width: 65,
          align: 'right',
        });

      // --- Disclaimer ---
      y += 40;
      if (y > 720) {
        doc.addPage();
        y = 50;
      }
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(gray)
        .text(
          'IMPORTANT : Cette estimation est donnee a titre indicatif et ne constitue pas un devis. Les prix reels peuvent varier en fonction de l\'etat des supports, des contraintes d\'acces et des materiaux choisis. Pour obtenir un devis precis et detaille, contactez-nous pour une visite sur place gratuite.',
          50,
          y,
          { width: 495, align: 'justify' },
        );

      // --- Footer ---
      const footerY = 780;
      doc
        .moveTo(50, footerY)
        .lineTo(545, footerY)
        .strokeColor(lightGray)
        .lineWidth(0.5)
        .stroke();
      doc
        .fontSize(7)
        .fillColor(gray)
        .text(
          'Atouts Services | 06 34 02 61 80 | atouts.services92@gmail.com | atouts-services.fr',
          50,
          footerY + 5,
          { align: 'center', width: 495 },
        );

      doc.end();
    });
  }
}

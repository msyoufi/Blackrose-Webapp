import jsPDF from "jspdf";
import { downloadImage } from "./images.service";
import { formatCurrency } from "../utils/utils";

// The image_url property of the passed perfumes must be a Data URL and NOT a download URL!!!!
export async function generatePerfumesPDF(perfumes: Perfume[]): Promise<void> {
  const doc = new jsPDF({ unit: 'em', format: 'A6' });

  const margin = 1;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const itemHeight = 10;
  const itemWidth = pageWidth - margin * 2;

  const imgHeight = itemHeight - margin * 2;
  const imgWidth = imgHeight;

  let x = margin;
  let xtext = imgWidth + margin;

  let y = margin;
  let ytext = margin * 4;

  // create a default image in case perfume image is not provided
  const defaultImage = document.createElement('img');
  defaultImage.src = 'images/perfume-icon.png';

  // write the cover page
  doc.setFontSize(20);
  doc.text('Black Rose', (pageWidth / 2) - 5, 10);

  doc.setFontSize(16);
  doc.text('Designer Perfumes', (pageWidth / 2) - 6.25, 15);

  doc.setFontSize(8);
  doc.text(new Date().toDateString(), pageWidth - 9, pageHeight - 3);

  // add perfumes to the seconde page
  doc.addPage();

  const lastItme = perfumes.length - 1;

  perfumes.forEach((perfume, i) => {
    const { name, brand, size, price, image_url, in_stock } = perfume;

    if (image_url) {
      doc.addImage(image_url, 'WEBP', x, y + 1, imgWidth, imgHeight);

    } else {
      doc.addImage(defaultImage, 'PNG', x, y + 1, imgWidth, imgHeight);
    }

    // doc.setFont('helvetica', 'bold', 600);
    doc.setFontSize(13);
    doc.text(name, xtext, ytext);

    doc.setFontSize(11);
    doc.text(brand, xtext, ytext + 1.5);

    doc.setFontSize(10);
    doc.text(`${size} ml - ${formatCurrency(price)} USh`, xtext, ytext + 4);

    // draw a border
    in_stock
      ? doc.setDrawColor(235, 224, 224) // gray
      : doc.setDrawColor(236, 168, 168); // red

    doc.setLineWidth(0.05)
    doc.roundedRect(x, y, itemWidth, itemHeight, .2, .2);

    y += itemHeight + margin;
    ytext += itemHeight + margin;

    // Add new page if beyond bottom margin
    if (y + itemHeight > pageHeight && i < lastItme) {
      doc.addPage();
      y = margin;
      ytext = margin * 4;
    }
  });

  doc.save('perfumes.pdf');
}

export async function downloadAllImagesAsDataUrl(perfumes: Perfume[]): Promise<Perfume[]> {
  let blob: Blob | null = null;

  return await Promise.all(
    perfumes.map(
      async ({ image_url, ...perfume }) => {
        if (image_url) {
          blob = await downloadImage(perfume.id);
          image_url = await blobToDataUrl(blob);
        }

        return { ...perfume, image_url };
      }
    )
  );
}

function blobToDataUrl(image: Blob): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);

    reader.readAsDataURL(image);
  });
}
import jsPDF from 'jspdf';
import { downloadImage } from './images.storage.service';
import { formatCurrency, sortByKey } from '../utils/utils';

// The image_url property of the passed perfumes must be a Data URL and NOT a download URL!!!!
// Use the methode bellow 'downloadAllImagesAsDataUrl' to download the images first.
export async function generatePerfumesPDF(
  perfumes: Perfume[],
  collection: PerfumeCollection | 'All',
  sex: PerfumeSex | 'All'
): Promise<void> {
  const doc = new jsPDF({ unit: 'em', format: 'A6' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFont('helvetica', 'normal');

  writeCoverPage(doc, pageWidth, pageHeight, collection, sex);

  // add perfumes beggining from the seconde page
  doc.addPage();

  writePerfumes(doc, pageWidth, pageHeight, perfumes);

  doc.save(`${collection}_${sex}_Perfumes.pdf`);
}

function writeCoverPage(
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  collection: PerfumeCollection | 'All',
  sex: PerfumeSex | 'All'
): void {
  const center = pageWidth / 2;

  // draw logo
  const logo = document.createElement('img');
  logo.src = 'images/blackrose-logo.jpg';
  // the logo is quadratic
  const logoWidth = 9
  doc.addImage(logo, 'JPG', (pageWidth - logoWidth) / 2, 3, logoWidth, logoWidth);

  // set collection
  doc.setFontSize(14);
  let title = collection + ' Perfumes';
  if (collection === 'Private')
    title = title.replace(' ', ' Collection ');
  doc.text(title, center, 14, { align: 'center' });

  // set sex
  if (sex !== 'All') {
    doc.setFontSize(12);
    doc.text(sex, center, 15.5, { align: 'center' });
  }

  // set contact infos
  doc.setFontSize(10);
  const x = 8;
  const y = 17;

  const locationLogo = document.createElement('img');
  locationLogo.src = 'images/location-icon.png';
  doc.addImage(locationLogo, 'PNG', x - 1.5, y + .3, 1, 1);

  const address1 = 'Acacia Mall';
  doc.text(address1, x, y + .6);

  const address2 = 'Main Entrance - Opposite KFC';
  doc.text(address2, x, y + 1.5);

  const whatsappLogo = document.createElement('img');
  whatsappLogo.src = 'images/whatsapp-icon.png';
  doc.addImage(whatsappLogo, 'PNG', x - 1.5, y + 2.1, 1, 1);

  const phoneNumber = '0744749099';
  doc.text(phoneNumber, x, y + 2.85);

  const instagramLogo = document.createElement('img');
  instagramLogo.src = 'images/insta-icon.png';
  doc.addImage(instagramLogo, 'PNG', x - 1.35, y + 3.6, .7, .7);

  const instagram = '@blackroseperfumes_ug';
  doc.text(instagram, x, y + 4.2);

  const flaconImg = document.createElement('img');
  flaconImg.src = 'images/flacon-photo.png';
  doc.addImage(flaconImg, 'PNG', 2, pageHeight - 8, 7, 7);

  doc.setFontSize(7);
  doc.text(new Date().toDateString(), pageWidth - 7, pageHeight - 2.2);
}

function writePerfumes(
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  perfumes: Perfume[]
): void {
  const margin = 1;
  const itemHeight = 10;
  const itemWidth = pageWidth - margin * 2;
  let x = margin;
  let xtext = 9;
  let y = margin;
  let ytext = margin * 4;

  // create a default image in case perfume image is not provided
  const defaultImage = new Image();
  defaultImage.src = 'images/perfume-icon.png';

  const sortedPerfumes = sortByKey(perfumes, 'sex');
  const lastIndex = sortedPerfumes.length - 1;

  sortedPerfumes.forEach((perfume, i) => {
    const { name, brand, size, price, image_url } = perfume;

    if (image_url) {
      const { width: imgWidth, height: imgHeight, fileType } = doc.getImageProperties(image_url);

      const ratio = imgWidth / imgHeight;
      const displayHeight = itemHeight - margin * 2;
      const displayWidth = displayHeight * ratio;

      doc.addImage(image_url, fileType, x, y + 1, displayWidth, displayHeight);

    } else {
      const imgHeight = itemHeight - margin * 2;
      doc.addImage(defaultImage, 'PNG', x, y + 1, imgHeight, imgHeight);
    }

    doc.setFontSize(12);
    const nameLines = doc.splitTextToSize(name, itemWidth - 9);
    doc.text(nameLines, xtext, ytext);

    doc.setFontSize(10);
    doc.text(brand, xtext, ytext + nameLines.length + .5);

    doc.setFontSize(10);
    doc.text(`${size} ml - ${formatCurrency(price)} UGX`, xtext, ytext + 4);

    // draw a border
    doc.setLineWidth(0.05)
    doc.setDrawColor(235, 224, 224) // gray
    doc.roundedRect(x, y, itemWidth, itemHeight, .2, .2);

    y += itemHeight + margin;
    ytext += itemHeight + margin;

    // Add new page if beyond bottom margin and still items in the list
    if (y + itemHeight > pageHeight && i < lastIndex) {
      doc.addPage();
      y = margin;
      ytext = margin * 4;
    }
  });
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
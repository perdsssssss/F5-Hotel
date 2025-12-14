const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateBookingPdf(booking) {
    return new Promise((resolve, reject) => {
        try {
            const outDir = path.join(__dirname, '..', 'public', 'pdfs');
            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

            const fileName = `booking-${booking._id}.pdf`;
            const filePath = path.join(outDir, fileName);

            const doc = new PDFDocument({ size: 'A4', margin: 50 });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Styled Header and Layout
            const pageWidth = doc.page.width;
            const pageMargins = doc.page.margins;
            const usableWidth = pageWidth - pageMargins.left - pageMargins.right;

            // Header bar
            const headerHeight = 70;
            doc.save();
            doc.rect(pageMargins.left, 50, usableWidth, headerHeight).fill('#DFA974');
            doc.fillColor('#ffffff').fontSize(20).text('F5 HOTEL', pageMargins.left + 18, 62);
            doc.fontSize(11).text('Booking Confirmation', pageMargins.left + 18, 86 - 6);
            const createdDate = new Date(booking.createdAt || Date.now()).toLocaleDateString();
            doc.fontSize(10).text(`Date: ${createdDate}`, pageMargins.left + usableWidth - 120, 70, { width: 110, align: 'right' });
            doc.restore();

            // Divider
            doc.moveTo(pageMargins.left, 50 + headerHeight + 6).lineTo(pageMargins.left + usableWidth, 50 + headerHeight + 6).strokeColor('#CCCCCC').stroke();

            // Two-column layout: left = guest & booking details, right = summary box
            const startY = 50 + headerHeight + 20;
            const leftX = pageMargins.left;
            const leftWidth = Math.floor(usableWidth * 0.64);
            const rightX = leftX + leftWidth + 12;
            const rightWidth = usableWidth - leftWidth - 12;

            // Left column - guest & booking details
            doc.fillColor('black').fontSize(11);
            doc.text('Guest Information', leftX, startY, { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10);
            doc.text(`Booking ID: ${booking._id}`, { width: leftWidth });
            doc.text(`Name: ${booking.userName}`, { width: leftWidth });
            doc.text(`Email: ${booking.userEmail}`, { width: leftWidth });
            doc.text(`Phone: ${booking.userPhone}`, { width: leftWidth });
            doc.moveDown(0.4);

            doc.fontSize(11).text('Reservation Details', { underline: true });
            doc.moveDown(0.3);
            doc.fontSize(10);
            doc.text(`Room Type: ${booking.roomType}`, { width: leftWidth });
            doc.text(`Check-In: ${new Date(booking.checkInDate).toLocaleDateString()}`, { width: leftWidth });
            doc.text(`Check-Out: ${new Date(booking.checkOutDate).toLocaleDateString()}`, { width: leftWidth });
            doc.text(`Nights: ${booking.totalNights}`, { width: leftWidth });
            doc.text(`Rooms: ${booking.numberOfRooms}`, { width: leftWidth });
            doc.text(`Guests: ${booking.numberOfGuests}`, { width: leftWidth });
            doc.moveDown(0.6);

            doc.fontSize(10).text('Special Requests:', { continued: false, underline: true });
            doc.moveDown(0.2);
            doc.fontSize(10).text(booking.specialRequests || 'None', { width: leftWidth });

            // Right column - summary box
            const boxY = startY;
            const boxHeight = 140;
            doc.roundedRect(rightX, boxY, rightWidth, boxHeight, 6).fill('#F7EDE1');
            doc.fillColor('#000000').fontSize(10).text('Booking Summary', rightX + 12, boxY + 12);
            doc.fontSize(12).fillColor('#333').text(`Rooms: ${booking.numberOfRooms}`, rightX + 12, boxY + 34);
            doc.text(`Guests: ${booking.numberOfGuests}`, rightX + 12, boxY + 52);
            doc.text(`Nights: ${booking.totalNights}`, rightX + 12, boxY + 70);

            // Total box inside summary
            const totalBoxY = boxY + boxHeight - 46;
            const totalBoxHeight = 34;
            doc.roundedRect(rightX + 12, totalBoxY, rightWidth - 24, totalBoxHeight, 4).fill('#DFA974');
            doc.fillColor('#ffffff').fontSize(12).text(`Total: ₱${Number(booking.totalPrice).toLocaleString()}`, rightX + 18, totalBoxY + 8);

            // Footer note
            const footerY = doc.page.height - pageMargins.bottom - 60;
            doc.fillColor('#666').fontSize(9).text('Thank you for booking with F5 HOTEL. We look forward to welcoming you.', pageMargins.left, footerY, { align: 'center', width: usableWidth });
            doc.fontSize(8).fillColor('#999').text('F5 HOTEL • 123 Hotel St, City • contact@f5hotel.example • +63 912 345 6789', pageMargins.left, footerY + 16, { align: 'center', width: usableWidth });

            doc.end();

            stream.on('finish', () => {
                // Return URL relative to server static root
                const publicUrl = `/public/pdfs/${fileName}`;
                resolve(publicUrl);
            });

            stream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { generateBookingPdf };

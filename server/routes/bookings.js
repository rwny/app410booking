const express = require('express');
const router = express.Router();
const { GoogleSpreadsheet } = require('google-spreadsheet');

// Google Sheets API configuration
const SHEET_ID = 'YOUR_SHEET_ID'; // Replace with your Google Sheet ID
const CREDENTIALS_PATH = 'path/to/your/credentials.json'; // Replace with the path to your credentials file

async function accessSpreadsheet() {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    const creds = require(CREDENTIALS_PATH);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads document properties and worksheets
    return doc;
}

// POST route to create a new booking
router.post('/', async (req, res) => {
    try {
        const { roomId, userId, date, timeSlot } = req.body;

        const doc = await accessSpreadsheet();
        const sheet = doc.sheetsByIndex[0]; // Use the first sheet

        // Check if the room is already booked for the given date and time slot
        const rows = await sheet.getRows();
        const existingBooking = rows.find(row =>
            row.roomId === roomId && row.date === date && row.timeSlot === timeSlot
        );

        if (existingBooking) {
            return res.status(400).json({ message: 'Room already booked for this time slot' });
        }

        // Add the new booking to the sheet
        await sheet.addRow({ roomId, userId, date, timeSlot });

        res.status(201).json({ message: 'Booking created successfully' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET route to get all bookings with optional filtering by roomId and date
router.get('/', async (req, res) => {
    try {
        const { roomId, date } = req.query;
        
        const doc = await accessSpreadsheet();
        const sheet = doc.sheetsByIndex[0]; // Use the first sheet

        const rows = await sheet.getRows();
        let bookings = rows.map(row => ({
            roomId: row.roomId,
            userId: row.userId,
            date: row.date,
            timeSlot: row.timeSlot
        }));
        
        // Apply filters if provided
        if (roomId) {
            bookings = bookings.filter(booking => booking.roomId === roomId);
        }
        
        if (date) {
            bookings = bookings.filter(booking => booking.date === date);
        }

        res.status(200).json(bookings);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

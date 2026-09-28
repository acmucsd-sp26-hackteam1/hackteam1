const Event = require("../models/event");

exports.createEvent = async (req, res) => {
    try {
        const { 
            name,
            ownerUid,
            startDate,
            endDate,
            startTime,
            endTime,
            isRecurring,
            recurringDays,
            location,
            description
         } = req.body;

         if (!name || !ownerUid || !startDate || !startTime || !endTime) {
            return res.status(400).json({
                error: "name, ownerUid, startDate, startTime, and endTime are required"
            });
         }

         const event = await Event.create({
            name,
            ownerUid,
            startDate,
            endDate,
            startTime,
            endTime,
            isRecurring,
            recurringDays,
            location,
            description
         });

         res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const { ownerUid } = req.params;
        const events = await Event.find({ ownerUid });

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
            
        );

        if (!event) return res.status(404).json ({ error: "Event not found" });

        res.json(event);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByIdAndDelete(id);

        if(!event) return res.status(404).json({ error: "Event not found "});

        res.json({ message: "Event successfully deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};